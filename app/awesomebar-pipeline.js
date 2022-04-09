
let colorWheelLength = 40;
function createColorValueArray() {
  let [r,g,b] = [40,40,40];
  let [inr, ing, inb] = [80, 20, 10];
  let colors = [];
  colors.push("#404040");
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
  if (cur + inc == ch.length) {
    return;
  }
  let x = ch[cur];
  x.className = "pipe";
  x = ch[cur + inc];
  x.className = "pipe activepipe";
}
let cv = createColorValueArray();
function updatePipelineOnAwesomeBar(pl, cur, name, files, pli) {
  const pln = document.getElementById("pipeline-name");
	pln.innerHTML = name;
  document.getElementsByClassName("pipeline-name")[0].style.background = cv[pli];

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
