//NOTE: Currently assumes that user will be moving the
//      first img found under container, but the actual
//      handlers are applied to the container.
function PanAndZoom(container) {

  //TODO: Q: What happens if someone calls this function
  //        more than 1 time on different containers?
  //  A: I think it would override the first container.
  //TODO: Possibly have a new PanAndZoomController(container [, target])
  //      * target - A selector of the thing that will be transformed.

  var img = container.getElementsByTagName('img')[0];

  container.addEventListener('mousedown' , handleMouseStart);
  container.addEventListener('touchstart', handleTouchStart);

  var position = { x: 0, y: 0};
  var delta = { x: 0, y: 0 };

  var origin = { x: 0, y: 0};

  var scaleFactor = 1;

  function handleMouseStart(e) {
    console.log('mouseStart:',e);

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup'  , dragEnd);
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
  }

  function handleTouchMove(e) {
    var touch = e.touches[0];
    // console.log('touchMove:',touch);
    delta.x = touch.screenX - origin.x;
    delta.y = touch.screenY - origin.y;
    adjustImage();
  }

  function adjustImage() {
    var dx = position.x + delta.x;
    var dy = position.y + delta.y;
    var style = `transform: translate(${dx}px,${dy}px)`;
    img.setAttribute('style', style);
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
}
