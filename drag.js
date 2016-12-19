//NOTE: Currently assumes that user will be moving the
//      first img found under container, but the actual
//      handlers are applied to the container.
function PanAndZoom(container) {

  //TODO: Q: What happens if someone calls this function
  //        more than 1 time on different containers?
  //  A: I think it would override the first container.
  //TODO: Possibly have a new PanAndZoomController(container [, target])
  //      * target - A selector of the thing that will be transformed.

  var width = container.clientWidth;
  var height = container.clientHeight;

  // var maxSplit = Math.sqrt(width * width + height * height);

  console.log('PanAndZoom, w:',width,'h:',height);

  var img = container.getElementsByTagName('img')[0];

  container.addEventListener('mousedown' , handleMouseStart);
  container.addEventListener('touchstart', handleTouchStart);

  var position = { x: 0, y: 0, scale: 1};
  var delta = { x: 0, y: 0, scale: 1 };

  var origin = { x: 0, y: 0, scale: 1};
  var curSplit = 0;

  var rotation = 0;

  function handleMouseStart(e) {
    console.log('mouseStart:',e);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup'  , dragEnd);
  }

  //Using linear distance
  function calcSplit(t1, t2) {
    var dx = t2.screenX - t1.screenX;
    var dy = t2.screenY - t1.screenY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function handleTouchStart(e) {
    console.log('touchStart:',e.touches);

    if(e.touches.length == 1) {
      container.addEventListener('touchend' , dragEnd);
      container.addEventListener('touchmove', handleTouchMove);
      //TODO: Consider just setting origin to the touch event?
      origin.x = e.touches[0].screenX;
      origin.y = e.touches[0].screenY;
      return;
    }
    if(e.touches.length == 2) {
      container.addEventListener('touchend' , pinchEnd);
      container.addEventListener('touchmove', handlePinchMove);
      //TODO: Set the center of gravity, possibly just using origin.
      curSplit = calcSplit(e.touches[0], e.touches[1]);
      return;
    }
    //We are ignoring touches with length > 2;
  }

  function handleMouseMove(e) {
    console.log('mouseMove:',e);
    delta.x += e.movementX;
    delta.y += e.movementY;
    adjustImage();
  }

  function handlePinchMove(e) {
    console.log('pinchMove:',e.touches);
    var split = calcSplit(e.touches[0], e.touches[1]);
    delta.scale = split / curSplit;
  }

  function handleTouchMove(e) {
    var touch = e.touches[0];
    // console.log('touchMove:',touch);
    delta.x = touch.screenX - origin.x;
    delta.y = touch.screenY - origin.y;
    adjustImage();
  }

  function clampDelta() {
    var scale = position.scale * delta.scale;

    let w = img.width;
    let h = img.height;

    let sw = w * scale;
    let sh = h * scale;

    let minx = width  - sw - position.x;
    let miny = height - sh - position.y;

    let maxx = -position.x;
    let maxy = -position.y;

    if(delta.x < minx) delta.x = minx;
    if(delta.y < miny) delta.y = miny;
    if(delta.x > maxx) delta.x = maxx;
    if(delta.y > maxy) delta.y = maxy;
  }

  function adjustImage() {
    clampDelta();
    var dx = position.x + delta.x;
    var dy = position.y + delta.y;
    var scale = position.scale * delta.scale;

    let w = img.width;
    let h = img.height;

    let sw = w * scale;
    let sh = h * scale;

    let sx = Math.round(sw / 2);
    let sy = Math.round(sh / 2);

    var ops = [];
    ops.push(`translate(${dx}px,${dy}px)`);
    ops.push(`translate(${-w/2}px,${-h/2}px)`);
    ops.push(`translate(${sx}px,${sy}px)`);
    ops.push(`scale(${scale})`);
    img.setAttribute('style', `transform: ${ops.join(' ')}`);

    // for(let prop in img) {
    //   console.log('img['+prop+']:', img[prop]);
    // }
  }

  function fitImage() {
    let ang = rotation % 360;
    var flip = (ang == 90 || ang == 270);

    console.log('fitImage img:',img);

    // let w = img.clientWidth;
    // let h = img.clientHeight;
    let w = img.width;
    let h = img.height;

    console.log('fitImage, w:',w,'h:',h);

    position.scale = flip ?
      (w > h ? height / w : width  / h) :
      (w > h ? width  / w : height / h);

    position.scale *= 2; //TEST TEST TEST

    adjustImage();
  }


  function pinchEnd(e) {
    console.log('pinchEnd:',e);

  }

  function dragEnd(e) {
    console.log('dragEnd:',e);
    container.removeEventListener('mousemove', handleMouseMove);
    container.removeEventListener('mouseup'  , dragEnd);

    container.removeEventListener('touchmove', handleTouchMove);
    container.removeEventListener('touchend' , dragEnd);
    position.x += delta.x;
    position.y += delta.y;
    delta.x = delta.y = 0;
    adjustImage(); //TODO: Is this necessary?
  }
  img.addEventListener('load',fitImage);
  // fitImage();
}
