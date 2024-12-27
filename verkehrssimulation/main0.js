const canvas = document.createElement("canvas");


document.body.appendChild(canvas);
{
    let width;
    let height;
    
    const updateSize = function(){
        if(width === window.innerWidth && height === window.innerHeight)return;
        width = window.innerWidth;
        height = window.innerHeight;
        render();
    }
    
    updateSize();
    
    window.addEventListener("resize", updateSize);
}

const ctx = canvas.getContext("2d");


const width = 100;
const height = 100;


let prevX, prevY;

canvas.addEventListener("mousedown",(e)=>{
    const x = e.clientX;
    const y = e.clientY;
    prevX = x;
    prevY = y;
});

canvas.addEventListener("mousemove",(e)=>{
    const x = e.clientX;
    const y = e.clientY;
    onDelta(prevX,prevY,x,y);
    prevX = x;
    prevY = y; 
});

canvas.addEventListener("mouseup",(e)=>{
    const x = e.clientX;
    const y = e.clientY;
    onDelta(prevX,prevY,x,y);
});

const toLocalCoordinates = function(x,y){
}

const onDelta = function(x0,y0,x1,y1){
    // translate to local coordinates
    
}


const cells = [];








