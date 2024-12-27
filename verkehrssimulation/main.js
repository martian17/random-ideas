const canvas = document.createElement("canvas");

document.body.appendChild(canvas);

const width = canvas.width = 500;
const height = canvas.height = 500;


const ctx = canvas.getContext("2d");

const cellSize = 50;

//cells initialized to zero
const cells = new Uint32Array(10*10);
cells.width = 10;
cells.height = 10;

class Cells{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.cells = new Uint32Array(width*height);
    }
    get(x,y){
        const idx = y*this.width+x;
        return this.cells[idx];
    }
    set(x,y,value){
        const idx = y*this.width+x;
        return this.cells[idx] = value;
    }
    setKind(x,y,kind){
        const idx = y*this.width+x;
        return this.cells[idx] = (this.cells[idx] & ~KINDMASK)&kind;
    }
    occupy(x,y){
    }
    unoccupy
}
// road format
// ******** ******** ******** ********
// 11223344 55667788 99001122 GGGGO1DD
// dijjstra direction      goal ocupd dir

// start format
// ******** ******** ******** ********
// ******** ******** ******** *****001

// goal format
// ******** ******** ******** ********
// ******** ******** ******** GGGG*010



const OCCUPIED = 8;
// kind
const LEFT = 1;
const RIGHT = 2;
const UP = 3;
const DOWN = 4;
const START = 5;
const GOAL = 6;

const KINDMASK = 7;

const MOUSE_UP = 0;
const MOUSE_DOWN = 1;
const MOUSE_MOVING = 2;

// bit 17 till 32 store direction
// max 8 different goals

let prevX, prevY;

let downState = MOUSE_UP;
canvas.addEventListener("mousedown",(e)=>{
    downState = MOUSE_DOWN;
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    prevX = x;
    prevY = y;
});

canvas.addEventListener("mousemove",(e)=>{
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    if(downState !== MOUSE_UP){
        downState = MOUSE_MOVING;
        console.log(downState);
        onDelta(prevX,prevY,x,y);
    }
    prevX = x;
    prevY = y; 
});

canvas.addEventListener("mouseup",(e)=>{
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    if(downState === MOUSE_DOWN)onDelta(prevX,prevY,x,y);
    downState = MOUSE_UP;
});

canvas.addEventListener("keydown",(e)=>{
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    onKeydown(e,x,y);
})

const toLocalCoordinates = function(x,y){
    return [Math.floor(x/cellSize),Math.floor(y/cellSize)]
}


const toIndex = function(x,y){
    return y*cells.width+x;
}

const toCanvasCoordinates = function(index){
    return [index%cells.width*cellSize,Math.floor(index/cells.height)*cellSize];
}

const rangeIncl = function*(start,end){
    if(start < end){
        for(let i = start; i <= end; i++){
            yield i;
        }
    }else{
        for(let i = start; i >= end; i--){
            yield i;
        }
    }
};

const dist = function(x0,y0,x1,y1){
    const dx = x1-x0;
    const dy = y1-y0;
    return Math.sqrt(dx*dx+dy*dy);
};

const onKeydown = function(e,x,y){
    [x,y] = toLocalCoordinates(x,y);
    const idx = toIndex(x,y);
    const cell = cells[idx];
    if(e.key === "ArrowLeft"){
        cells[idx] = (cell & ~KINDMASK) | LEFT;
    }else if(e.key === "ArrowRight"){
        cells[idx] = (cell & ~KINDMASK) | RIGHT;
    }else if(e.key === "ArrowUp"){
        cells[idx] = (cell & ~KINDMASK) | UP;
    }else if(e.key === "ArrowDown"){
        cells[idx] = (cell & ~KINDMASK) | DOWN;
    }else if(e.key === "e"){
        cells[idx] = 0;
    }else if(e.key === "s"){
        cells[idx] = START;
    }else if(e.key === "g"){
        cells[idx] = GOAL;
    }
}



const onDelta = function(x0,y0,x1,y1){
    let dx = x1-x0;
    let dy = y1-y0;
    let direction;
    if(Math.abs(dy) < Math.abs(dx)){
        if(dx < 0){
            direction = LEFT;
        }else{
            direction = RIGHT;
        }
    }else{
        if(dy < 0){
            direction = UP;
        }else{
            direction = DOWN;
        }
    }
    // translate to local coordinates
    [x0,y0] = toLocalCoordinates(x0,y0);
    [x1,y1] = toLocalCoordinates(x1,y1);
    let x = Math.floor(x0);
    let y = Math.floor(y0);
    const ddx = x1-x0 < 0 ? -1 : 1;
    const ddy = y1-y0 < 0 ? -1 : 1;
    for(let i = 0; i < 1000; i++){
        const idx = toIndex(x,y);
        cells[idx] = (cells[idx] & OCCUPIED) | direction | ISROAD;
        const x11 = x + ddx;
        const y11 = y + ddy;
        if(x === x1 && y === y1)break;
        if(dist(x0,y0,x11,y) + dist(x1,y1,x11,y) < dist(x0,y0,x,y11) + dist(x1,y1,x,y11)){
            x = x11;
        }else{
            y = y11;
        }
    }
    render();
}


const render = function(){
    ctx.clearRect(0,0,width,height);
    for(let i = 0; i < cells.length; i++){
        const cell = cells[i];
        if(!(cell & ISROAD))continue;
        const [x,y] = toCanvasCoordinates(i);
        if(cell & OCCUPIED){
            ctx.fillStyle = "#000";
            ctx.strokeStyle = "#fff";
            ctx.fillRect(x,y,cellSize,cellSize);
        }else{
            ctx.strokeStyle = "#000";
            ctx.fillStyle = "#fff";
            ctx.strokeRect(x,y,cellSize,cellSize);
        }
        const kind = cell & KINDMASK;
        if(kind === LEFT){
            ctx.beginPath();
            ctx.moveTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.stroke();
        }else if(kind === RIGHT){
            ctx.beginPath();
            ctx.moveTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.stroke();
        }else if(kind === UP){
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.lineTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.lineTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.stroke();
        }else if(kind === DOWN){ 
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.lineTo(x+cellSize*1/2,y+cellSize*1/4);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.lineTo(x+cellSize*1/4,y+cellSize*1/2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x+cellSize*1/2,y+cellSize*3/4);
            ctx.lineTo(x+cellSize*3/4,y+cellSize*1/2);
            ctx.stroke();
        }
    }
}









