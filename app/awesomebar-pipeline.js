function createColorValueArray(pl, cur) {
  let [r,g,b] = [0,0,139];
  let inc = 30;
  let first = pl.slice(0, cur).map(x => 
    "rgb(" + ((r+=inc)%255).toString() + "," + ((g+=inc)%255).toString() + "," + ((b+=inc)%255).toString()  
  ).reverse();
  first.push("rgb(0,0,139)");

  [r,g,b] = [0,0,139];
  let second = pl.slice(cur+1).map(x => 
    "rgb(" + ((r+=inc)%255).toString() + "," + ((g+=inc)%255).toString() + "," + ((b+=inc)%255).toString()  
  );
  return first.concat(second);
}

const tips = [
  ["Alt-A: Add After", "Alt-B: Add Before"],
  ["Alt-Left: Previous", "Alt-Right: Next"],
  ["Ctrl-Enter: Run", ""],
];
let tipIndex = 0;
function updateTips() {
  let i = tipIndex % tips.length;
  tipIndex++;
  document.getElementById("tip1").innerHTML = tips[i][0];
  document.getElementById("tip2").innerHTML = tips[i][1];
}

function updatePipelineOnAwesomeBar(pl, cur, name) {
  document.getElementById("pipeline-name").innerHTML = name;
  const c = document.getElementById("pipeline-container");
  c.innerHTML = "";

  let cv = createColorValueArray(pl, cur);

  let d = document.createElement("div"); 
  d.className = "arrow-right second-arrow";
  d.style.background = cv[0];
  c.appendChild(d);

  pl.forEach((p,i) => {
    let d = document.createElement("div"); 
    d.className = "shortcut-tip";
    d.style.backgroundColor = cv[i];
    d.textContent = p.lang;
    if (i == cur) {
      d.className += " currentpipe";
      d.style.color = "white";
    }
    c.appendChild(d);
    d = document.createElement("div"); 
    d.className = "arrow-right first-arrow";
    d.style.borderLeftColor = cv[i];
    d.style.background = cv[i+1];
    c.appendChild(d);
  });
  updateTips();
}

export {createColorValueArray, updatePipelineOnAwesomeBar};
