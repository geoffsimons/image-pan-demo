# image-pan-demo
Small little demo of a div acting as a viewport into a larger image, which can be panned.

# To try it out
I don't have this up on JSFiddle yet, but you can clone this repo and load up the drag.html file in a browser to see it in action.

# Known Issues
* Dragging outside the viewport div causes a loss of state because the event handler(s) is bound to only the div.
* Have not been able to test multi-touch. Need to figure out how to do that with Chrome.
