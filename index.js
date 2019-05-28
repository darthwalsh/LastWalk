function $(id) {
  return document.getElementById(id);
}

window.onload = () => {
  $("walk").onclick = () => 
    $("walktime").textContent = 1 + +$("walktime").textContent;
};

