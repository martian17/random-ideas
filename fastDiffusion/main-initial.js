const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const width = canvas.width = 500;
const height = canvas.height = 500;

const ctx = canvas.getContext("2d");
const imgdata = ctx.getImageData(0,0,width,height);
const data = imgdata.data;

const getContinuousFlux = function(x0,y0,x1,y1){
    const dx = x1-x0;
    const dy = y1-y0;
    const dd = (dx*dx+dy*dy);
    const d = Math.sqrt(dd);
    const f = 1/d;
    const fx = f*(dx/d);
    const fy = f*(dy/d);
    return [fx,fy];
}
// const getFlux = function(x0,y0,x1,y1,x2,y2){
//     const dx1 = x1-x0;
//     const dy1 = y1-y0;
//     const dx2 = x2-x0;
//     const dy2 = y2-y0;
// 
//     const dd1 = (dx1*dx1+dy1*dy1);
//     const dd2 = (dx2*dx2+dy2*dy2);
//     const d1 = Math.sqrt(dd1);
//     const d2 = Math.sqrt(dd2);
//     // total flow, inverse square
//     const f1 = 1/dd1;
//     const f2 = 1/dd2;
//     // vector flow (relative)
//     const fx1 = f1*(dx1/d1);
//     const fy1 = f1*(dy1/d1);
//     const fx2 = f2*(dx2/d2);
//     const fy2 = f2*(dy2/d2);
//     
//     return [fx2-fx1, fy2-fy1];
// }


const toId = function(x,y){
    x = (x+width)%width;
    y = (y+height)%height;
    return x+"-"+y;
}

const normalize = function(vector){
    let sum = 0;
    for(let v of vector){
        sum += v;
    }
    return vector.map(v=>v/sum);
};

const zip = function(...args){
    const len = Math.max(...args.map(v=>v.length));
    const res = [];
    for(let i = 0; i < len; i++){
        res.push(args.map(v=>v[i]));
    }
    return res;
}

const velGrid = new Float32Array(width*height*2);
const flowGrid = new Float32Array(width*height);

flowGrid[250*width+250] = 1;

let frontline = new Set(["250-250"]);
const passed = new Set;
console.log("asdfas");
while(true){
    console.log(frontline);
    const newFrontline = new Set;
    for(let fl of frontline){
        passed.add(fl);
    }
    for(let fl of frontline){
        const [x,y] = fl.split("-").map(v=>parseInt(v));
        const idx = x+y*width;
        // register neighbors
        const ids = [toId(x,y-1),toId(x,y+1),toId(x-1,y),toId(x+1,y)].filter(id=>!passed.has(id));
        //divide flow by the rest
        const totalFlow = flowGrid[idx];
        let flowVector = normalize(ids.map(id=>{
            const [x1,y1] = id.split("-").map(v=>parseInt(v));

            const [fx,fy] = getContinuousFlux(250,250,(x+x1)/2,(y+y1)/2);
            const dx = x1-x;
            const dy = y1-y;
            return fx*dx+fy*dy;
        })).map(f=>f*totalFlow);
        if(flowVector.length === 1){
            // prevent bunch up when there is a collision
            flowVector = [0];
        }
        //console.log(flowVector);
        for(let [id,flow] of zip(ids,flowVector)){
            const [x1,y1] = id.split("-").map(v=>parseInt(v));
            const idx1 = x1+y1*width;
            flowGrid[idx1] += flow;
            const dx = x1-x;
            const dy = y1-y;
            velGrid[idx1*2+0] += dx*flow;
            velGrid[idx1*2+1] += dy*flow;
            newFrontline.add(id);
        }
        // render
        const color = 255-Math.floor(totalFlow*500)
        data[idx*4+0] = color;
        data[idx*4+1] = color;
        data[idx*4+2] = color;
        data[idx*4+3] = 255;
    }
    ctx.putImageData(imgdata,0,0);
    //register frontline to passed
    frontline = newFrontline;
    // garbage collector collects old frontline
    await new Promise(res=>setTimeout(res,0));
}






