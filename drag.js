var con = document.getElementById('container');

var img = con.getElementsByTagName('img')[0];

con.addEventListener('mousedown', dragStart);

var position = { x: 0, y: 0};
var delta = { x: 0, y: 0 };
var scaleFactor = 1;

function dragStart(e) {
  //e should tell us where the drag started, but we kind of don't care.
  console.log('dragStart:',e);
  con.addEventListener('mousemove', dragMove);
  con.addEventListener('mouseup'  , dragEnd);
}

function dragMove(e) {
  // console.log('dragMove:',e);
  delta.x += e.movementX;
  delta.y += e.movementY;
  adjustImage();
}

function adjustImage() {
  var dx = position.x + delta.x;
  var dy = position.y + delta.y;
  var style = `transform: translate(${dx}px,${dy}px)`;
  img.setAttribute('style', style);
}

function dragEnd(e) {
  console.log('dragEnd:',e);
  con.removeEventListener('mousemove', dragMove);
  con.removeEventListener('mouseup'  , dragEnd);
  position.x += delta.x;
  position.y += delta.y;
  delta.x = delta.y = 0;
  adjustImage(); //TODO: Is this necessary?
}
