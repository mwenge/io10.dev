let colorWheelLength = 40;
function createColorValueArray() {
  let [r,g,b] = [0,0,139];
  let [inr, ing, inb] = [10, 20, 30];
  let colors = [];
  for (let i = 0; i < colorWheelLength; i++)
    colors.push("rgb(" + ((r+=inr)%255).toString() + "," + ((g+=ing)%255).toString() + "," + ((b+=inb)%255).toString());
  return colors;
}

const tips = [
  ["Alt-A: Add After", "Alt-B: Add Before"],
  ["Alt-Left: Previous", "Alt-Right: Next"],
  ["Ctrl-Enter: Run", "Alt-D: Delete Current"],
];
let tipIndex = 0;
function updateTips() {
  let i = tipIndex % tips.length;
  tipIndex++;
  document.getElementById("tip1").innerHTML = tips[i][0];
  document.getElementById("tip2").innerHTML = tips[i][1];
}

let cv = createColorValueArray();
function updatePipelineOnAwesomeBar(pl, cur, name) {
  document.getElementById("pipeline-name").innerHTML = name;
  const c = document.getElementById("pipeline-container");
  c.innerHTML = "";

  let d = document.createElement("div"); 
  d.className = "arrow-right second-arrow";
  d.style.background = cv[0];
  c.appendChild(d);

  pl.forEach((p,i) => {
    let d = document.createElement("div"); 
    d.className = "shortcut-tip";
    d.style.backgroundColor = cv[i % colorWheelLength];
    d.textContent = p.lang;
    if (i == cur) {
      d.className += " currentpipe";
      d.style.color = "white";
    }
    c.appendChild(d);
    d = document.createElement("div"); 
    d.className = "arrow-right first-arrow";
    d.style.borderLeftColor = cv[i % colorWheelLength];
    d.style.background = cv[(i % colorWheelLength) + 1];
    c.appendChild(d);
  });
  updateTips();
}

export {createColorValueArray, updatePipelineOnAwesomeBar};
