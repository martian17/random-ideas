

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

export const getDiffusionKernel = async function(width,height){

    const cx = Math.floor(width/2);
    const cy = Math.floor(height/2);

    const boundX = function(x){
        return (x+width)%width;
    };

    const boundY = function(y){
        return (y+width)%width;
    };

    const toIndex = function(x,y){
        return boundX(x-cx)+boundY(y-cy)*width;
    };

    const toId = function(x,y){
        x = boundX(x);
        y = boundY(y);
        return x+"-"+y;
    };

    const velocityGrid = new Float32Array(width*height*2);
    const flowGrid = new Float32Array(width*height);
    
    flowGrid[0] = 1;
    
    let frontline = new Set([`${cx}-${cy}`]);
    const passed = new Set;
    let itr = 0;
    while(true){
        itr++;
        const newFrontline = new Set;
        for(let fl of frontline){
            passed.add(fl);
        }
        for(let fl of frontline){
            const [x,y] = fl.split("-").map(v=>parseInt(v));
            const idx = toIndex(x,y);
            // register neighbors
            const ids = [toId(x,y-1),toId(x,y+1),toId(x-1,y),toId(x+1,y)].filter(id=>!passed.has(id));
            //divide flow by the rest
            const totalFlow = flowGrid[idx];
            let flowVector = normalize(ids.map(id=>{
                const [x1,y1] = id.split("-").map(v=>parseInt(v));
    
                const [fx,fy] = getContinuousFlux(cx,cy,(x+x1)/2,(y+y1)/2);
                const dx = x1-x;
                const dy = y1-y;
                return fx*dx+fy*dy;
            })).map(f=>f*totalFlow);
            if(itr === 1)console.log(flowVector);
            if(flowVector.length === 1){
                // prevent bunch up when there is a collision
                flowVector = [0];
            }
            for(let [id,flow] of zip(ids,flowVector)){
                const [x1,y1] = id.split("-").map(v=>parseInt(v));
                const idx1 = toIndex(x1,y1);
                flowGrid[idx1] += flow;
                const dx = x1-x;
                const dy = y1-y;
                velocityGrid[idx1*2+0] += dx*flow;
                velocityGrid[idx1*2+1] += dy*flow;
                newFrontline.add(id);
            }
        }
        frontline = newFrontline;
        // garbage collector collects old frontline
        if(frontline.size === 0)break;
    }
    return velocityGrid;
};

