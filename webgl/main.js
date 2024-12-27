const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const gl = canvas.getContext("webgl");
gl.clearColor(0,0,0,1)
gl.clear(gl.COLOR_BUFFER_BIT);

