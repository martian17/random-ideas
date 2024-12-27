const canvas = document.createElement("cnavas");
const width = canvas.width = 512;
const height = canvas.height = 512;

let state = new Float64Array(width*height);

let backBuffer = new Float64Array(width*height);

const radius = 10;
const stepState = function(state){
    const state1 = backBuffer;
    state1.fill(0);
    //convolution stage
    for(let i = ){
    }
}


