import {getPipe} from "./pipe.js";
async function getPipeline(id) {
  let pipelineItem = localStorage.getItem(id);
  let pipeline = pipelineItem ? JSON.parse(pipelineItem) : [];
  function addNewPipe() {
    let pipeid = id + "-" + pipeline.length.toString();
    pipeline.push(pipeid);
    localStorage.setItem(id, JSON.stringify(pipeline));
  }

  if (!pipeline) {
    addNewPipe();
  }

  let current = 0;
  let pipeid = id + "-" + current.toString();
  let pipe = await getPipe(pipeid);
  const rangeIterator = {
    addPipe: function() {
      addNewPipe();
    },
    currentPipe: function() {
      return pipe.pipe();
    },
  };
  return rangeIterator;
}
export { getPipeline };
