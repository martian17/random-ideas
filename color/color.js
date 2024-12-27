const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
const imgdata = ctx.getImageData(0,0,500,500);
const data = imgdata.data;

const render = function(){
    for(let y = 0; y < 500; y++){
        for(let x = 0; x < 500; x++){
            const idx = (y*500+x)*4;
            const dx = (x-250)/250;
            const dy = (y-250)/250;
            const rad = Math.sqrt(dx**2+dy**2)
            if(rad >= 1)continue;
            const angle = Math.atan2(dy,dx);
            const r = (0.5+Math.sin(angle))*256;
            const g = (0.5+Math.sin(angle+Math.PI*2/3))*256;
            const b = (0.5+Math.sin(angle+Math.PI*4/3))*256;
            data[idx+0] = r;
            data[idx+1] = g;
            data[idx+2] = b;
            data[idx+3] = 255;
        }
    }
    ctx.putImageData(imgdata,0,0);
}


render();
