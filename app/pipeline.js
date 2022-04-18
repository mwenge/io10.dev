import {getPipe} from "./pipe.js";
async function getPipeline(id, initialIndex = 0) {
  function previousPipeID() {
    if (!current)
      return null;
    let cur = current - 1;
    return pipeline[cur].pid;
  }
  const simpleHash = str => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash &= hash; // Convert to 32bit integer
          }
      return new Uint32Array([hash])[0].toString(36);
  };
  let pipelineItem = localStorage.getItem(id);
  let pipeline = pipelineItem ? JSON.parse(pipelineItem) : [];

  if (!pipeline.length) {
    let pid = id + "-" + pipeline.length.toString();
    pipeline.push({pid: pid, lang: "*.py"});
    localStorage.setItem(id, JSON.stringify(pipeline));
  }

  let current = initialIndex;
  let pipe = null;
  const rangeIterator = {
    lang: function() {
      return pipeline[current].lang;
    },
    updateLanguage: function(lang) {
      if (pipeline[current].lang == lang) return;
      pipeline[current].lang = lang;
      localStorage.setItem(id, JSON.stringify(pipeline));
      pipe.updateLang(lang);
    },
    initializePipeInfo: async function(cur) {
      await this.updateCurrentPipeInfo(cur);
    },
    deleteCurrent: async function() {
      if (pipeline.length == 1) return pipe;
      pipe.delete();
      pipeline.splice(current,1);
      localStorage.setItem(id, JSON.stringify(pipeline));
      if (current) current--;
      let pid = pipeline[current].pid;
      pipe = await getPipe(previousPipeID(), pid);
      // If the pipe is now at the start of the pipeline, make sure it
      // has an input.
      if (!current && await pipe.input() == undefined) {
        pipe.updateInput('');
      }
      return pipe
    },
    updateCurrentPipeInfo: async function(cur) {
      let pid = pipeline[cur].pid;
      pipe = await getPipe(previousPipeID(), pid);
      return pipe
    },
    insertAfter: async function() {
      let pid = simpleHash(pipeline[current].pid + Math.floor(Math.random() * 1000).toString());
      current++;
      pipeline.splice(current, 0, {pid:pid, lang:"*.py"});
      localStorage.setItem(id, JSON.stringify(pipeline));
      pipe = await getPipe(previousPipeID(), pid);
      return pipe;
    },
    insertBefore: async function() {
      if (!current) {
        return pipe;
      }
      let pid = simpleHash(pipeline[current].pid + Math.floor(Math.random() * 1000).toString());
      pipeline.splice(current, 0, {pid:pid, lang:"*.py"});
      localStorage.setItem(id, JSON.stringify(pipeline));
      pipe = await getPipe(previousPipeID(), pid);
      return pipe;
    },
    moveToPreviousPipe: async function() {
      if (!current) {
        return null;
      }
      current--;
      pipe = await this.updateCurrentPipeInfo(current);
      return pipe;
    },
    moveToFirstPipe: async function() {
      current = 0;
      pipe = await this.updateCurrentPipeInfo(current);
      return pipe;
    },
    moveToNextPipe: async function() {
      if (current == pipeline.length - 1) {
        return null;
      }
      current++;
      pipe = await this.updateCurrentPipeInfo(current);
      return pipe;
    },
    getNextPipe: async function(cur) {
      if (cur == pipeline.length - 1) {
        return null;
      }
      cur++;
      let pid = pipeline[cur].pid;
      let np = await getPipe(previousPipeID(), pid);
      return np;
    },
    updateInput: async function(data) {
      await pipe.updateInput(data);
    },
    currentPipe: function() {
      return pipe;
    },
    refreshCurrentPipe: async function() {
      pipe = await this.updateCurrentPipeInfo(current);
      return pipe;
    },
    currentPipeIndex: function() {
      return current;
    },
    currentPipeline: function() {
      return pipeline;
    },
  };
  await rangeIterator.initializePipeInfo(current);

  return rangeIterator;
}
export { getPipeline };
