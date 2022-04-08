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

function quickPipeDisplayUpdate(cur, inc) {
  if (!cur) {
    return;
  }
  const c = document.getElementById("pipeline-container");
  let ch = c.getElementsByClassName("pipe");
  let x = ch[cur];
  x.className = "pipe";
  x = ch[cur + inc];
  x.className = "pipe activepipe";
}
let cv = createColorValueArray();
function updatePipelineOnAwesomeBar(pl, cur, name, files) {
  document.getElementById("pipeline-name").innerHTML = name;
  const c = document.getElementById("pipeline-container");
  c.innerHTML = "";

	let d;
  let z = 1000;
  pl.forEach((p,i) => {
    d = document.createElement("div"); 
    d.className = "pipe";
    d.textContent = p.lang;
    if (i == cur) {
      d.className += " activepipe";
      if (files.length) {
        // Add the file tip.
        let f = document.createElement("div"); 
        f.className = "file-tip";
        f.textContent = "FILES AVAILABLE: '" + files.join('\', \'') + "'";
        c.appendChild(f);
      }
    }
    c.appendChild(d);
    d.style.zIndex = z--;
  });
}

export {createColorValueArray, updatePipelineOnAwesomeBar, quickPipeDisplayUpdate};
