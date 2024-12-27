const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = 1000;
const height = canvas.height = 500;
const imgdata = ctx.getImageData(0,0,width,height);
const data = imgdata.data;

const getIterations = function(r,i){
    let zr = 0;
    let zi = 0;
    for(let a = 0; a < 1000; a++){
        let zr1 = zr*zr-zi*zi+r;
        let zi1 = 2*zr*zi+i;
        zr = zr1;
        zi = zi1
        const r2 = zr*zr+zi*zi;
        if(r2 > 4){
            return a;
        }
    }
    return -1;
}


for(let y = 0; y < height; y++){
    for(let x = 0; x < width; x++){
        const idx = (y*width+x)*4;
        const r = (x-700)/300;
        const i = (y-250)/300;
        const itr = getIterations(r,i)
        if(itr !== -1){
            data[idx+0] = (Math.sin(itr/4)+1)/2*256;
            data[idx+1] = (Math.cos(itr/4)+1)/2*256;
            data[idx+2] = (Math.tan(itr/4)+1)/2*256;
            data[idx+3] = 255;
        }else{
            data[idx+0] = 0;
            data[idx+1] = 0;
            data[idx+2] = 0;
            data[idx+3] = 255;
        }
    }
}

ctx.putImageData(imgdata,0,0);
document.body.appendChild(canvas);

