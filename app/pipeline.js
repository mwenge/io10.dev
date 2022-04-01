import {getPipe} from "./pipe.js";
async function getPipeline(id) {
  function previousPipeID() {
    if (!current)
      return null;
    let cur = current - 1;
    return pipeline[cur].pid;
  }
  let pipelineItem = localStorage.getItem(id);
  let pipeline = pipelineItem ? JSON.parse(pipelineItem) : [];

  if (!pipeline.length) {
    let pid = id + "-" + pipeline.length.toString();
    pipeline.push({pid: pid, lang: "*.py"});
    localStorage.setItem(id, JSON.stringify(pipeline));
  }

  let current = 0;
  let pipe = null;
  let nextPipe = null;
  const rangeIterator = {
    lang: function() {
      return pipeline[current].lang;
    },
    updateLanguage: function(lang) {
      if (pipeline[current].lang == lang) return;
      pipeline[current].lang = lang;
      localStorage.setItem(id, JSON.stringify(pipeline));
    },
    initializePipeInfo: async function(cur) {
      await this.updateCurrentPipeInfo(cur);
    },
    deleteCurrent: async function() {
      pipe.delete();
      pipeline.splice(current,1);
      localStorage.setItem(id, JSON.stringify(pipeline));
      if (current) current--;
      pid = pipeline[current].pid;
      pipe = await getPipe(previousPipeID(), pid);
      nextPipe = await this.getNextPipe(current);
      if (!nextPipe) return pipe;
      await nextPipe.updateInput(pipe.output());
      return pipe
    },
    updateCurrentPipeInfo: async function(cur) {
      let pid = pipeline[cur].pid;
      pipe = await getPipe(previousPipeID(), pid);
      return pipe
    },
    insertAfter: async function() {
      let pid = id + "-" + (pipeline.length).toString();
      current++;
      pipeline.splice(current, 0, {pid:pid, lang:"*.py"});
      localStorage.setItem(id, JSON.stringify(pipeline));
      pipe = await getPipe(previousPipeID(), pid);
      return pipe;
    },
    insertBefore: async function() {
      let prev = await this.previousPipe();
      if (!prev) {
        return pipe;
      }
      current--;
      let pid = id + "-" + (pipeline.length).toString();
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
    updatePipeData: async function(data) {
      await pipe.updateData(data);
      nextPipe = await this.getNextPipe(current);
      if (!nextPipe) {
        return;
      }
      await nextPipe.updateInput(data.output);
      return;
    },
    currentPipe: function() {
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
