const getContinuousFlux = function(x0: number, y0: number, x1: number, y1: number){
    const dx = x1-x0;
    const dy = y1-y0;
    const dd = (dx*dx+dy*dy);
    const d = Math.sqrt(dd);
    const f = 1/d;
    const fx = f*(dx/d);
    const fy = f*(dy/d);
    return [fx,fy];
}



const normalize = function(vector: number[]){
    let sum = 0;
    for(let v of vector){
        sum += v;
    }
    return vector.map(v=>v/sum);
};

const zip = function(...args: any[]){
    const len = Math.max(...args.map(v=>v.length));
    const res = [];
    for(let i = 0; i < len; i++){
        res.push(args.map(v=>v[i]));
    }
    return res;
}


const UNTOUCHED = 0;
const NEW_FRONTLINE = 1;
const PASSED = 2;

export const getDiffusionKernel = function(width: number, height: number){

    const cx = Math.floor(width/2);
    const cy = Math.floor(height/2);

    const boundX = function(x: number){
        return (x+width)%width;
    };

    const boundY = function(y: number){
        return (y+width)%width;
    };

    const toIndex = function(x: number, y: number){
        return boundX(x-cx)+boundY(y-cy)*width;
    };

    const toId = function(x: number, y: number){
        x = boundX(x);
        y = boundY(y);
        return x+"-"+y;
    };

    const velocityGridX = new Float32Array(width*height);
    const velocityGridY = new Float32Array(width*height);
    const flowGrid = new Float32Array(width*height);
    
    flowGrid[0] = 1;
    
    let frontline = [[cx,cy]];
    const stateMap = new Uint8Array(width*height);
    const getState = function(x: number, y: number){
        return stateMap[toIndex(x,y)];
    };
    const setState = function(x: number, y: number, state: number){
        stateMap[toIndex(x,y)] = state;
    };
    let itr = 0;
    while(true){
        itr++;
        const newFrontline = [];
        for(let [x,y] of frontline){
            setState(x,y,PASSED);
        }
        for(let [x,y] of frontline){
            const idx = toIndex(x,y);
            // register neighbors
            const neighbors = [[x,y-1],[x,y+1],[x-1,y],[x+1,y]].filter(([x1,y1])=>getState(x1,y1) !== PASSED);
            //divide flow by the rest
            const totalFlow = flowGrid[idx];
            let flowVector = normalize(neighbors.map(([x1,y1])=>{
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
            for(let [[x1,y1],flow] of zip(neighbors,flowVector)){
                const idx1 = toIndex(x1,y1);
                flowGrid[idx1] += flow;
                const dx = x1-x;
                const dy = y1-y;
                velocityGridX[idx] += dx*flow;
                velocityGridY[idx] += dx*flow;
                
                if(getState(x1,y1) !== NEW_FRONTLINE){
                    setState(x1,y1,NEW_FRONTLINE);
                    newFrontline.push([x1,y1]);
                }
            }
        }
        frontline = newFrontline;
        // garbage collector collects old frontline
        if(frontline.length === 0)break;
    }
    return [velocityGridX, velocityGridY];
};


