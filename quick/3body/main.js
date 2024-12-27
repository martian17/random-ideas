// const bodies = [];
// [ m1, x1,  y1,  z1,  dx1,  dy1,  dz1,  ddx1,  ddy1,  ddz1,
// | kx1, ky1, kz1, kdx1, kdy1, kdz1, kddx1, kddy1, kddz1,
// | x2, y2, z2 ...

const CHUNK_SIZE = 19;
const CHUNK_MASS = 0;
const CHUNK_X = 1;
const CHUNK_Y = 2;
const CHUNK_Z = 3;
const CHUNK_VX = 4;
const CHUNK_VY = 5;
const CHUNK_VZ = 6;
const CHUNK_AX = 7;
const CHUNK_AY = 8;
const CHUNK_AZ = 9;
const CHUNK_KX = 10;
const CHUNK_KY = 11;
const CHUNK_KZ = 12;
const CHUNK_KVX = 13;
const CHUNK_KVY = 14;
const CHUNK_KVZ = 15;
const CHUNK_KAX = 16;
const CHUNK_KAY = 17;
const CHUNK_KAZ = 18;
const G = 6.6743e-11;

const AU = 1.496e+11;
const EV = 29800;//earth velocity m/s
const DAY = 60*60*24;
const TAU = Math.PI*2;

const rand1 = function(){
    return Math.random()*2-1;
};

const randIntervals = function(span,cnt){
    let res = [];
    for(let i = 0; i < cnt; i++){
        res.push(Math.floor(Math.random()*span));
    }
    res.sort((a,b)=>a-b);
    let prev = 0;
    for(let i = 0; i < res.length; i++){
        let val = res[i];
        res[i] = val-prev;
        prev = val;
    }
    return res;
};

const updateAcceleration = function(bodies){
    for(let offset1 = 0; offset1 < bodies.length; offset1 += CHUNK_SIZE){
        let ddx = 0;
        let ddy = 0;
        let ddz = 0;
        for(let offset2 = 0; offset2 < bodies.length; offset2 += CHUNK_SIZE){
            if(offset1 === offset2)continue;
            const rx = bodies[offset2+CHUNK_X] - bodies[offset1+CHUNK_X];
            const ry = bodies[offset2+CHUNK_Y] - bodies[offset1+CHUNK_Y];
            const rz = bodies[offset2+CHUNK_Z] - bodies[offset1+CHUNK_Z];
            const r3 = (rx*rx+ry*ry+rz*rz)**(3/2);
            const m = bodies[offset2+CHUNK_MASS];
            //acc += disp*G*M/r^3
            ddx += rx*G*m/r3;
            ddy += ry*G*m/r3;
            ddz += rz*G*m/r3;
        }
        bodies[offset1+CHUNK_AX] = ddx;
        bodies[offset1+CHUNK_AY] = ddy;
        bodies[offset1+CHUNK_AZ] = ddz;
    }
}


const updateAccelerationK = function(bodies){
    for(let offset1 = 0; offset1 < bodies.length; offset1 += CHUNK_SIZE){
        let ddx = 0;
        let ddy = 0;
        let ddz = 0;
        for(let offset2 = 0; offset2 < bodies.length; offset2 += CHUNK_SIZE){
            if(offset1 === offset2)continue;
            const rx = bodies[offset2+CHUNK_KX] - bodies[offset1+CHUNK_KX];
            const ry = bodies[offset2+CHUNK_KY] - bodies[offset1+CHUNK_KY];
            const rz = bodies[offset2+CHUNK_KZ] - bodies[offset1+CHUNK_KZ];
            const r3 = (rx*rx+ry*ry+rz*rz)**(3/2);
            const m = bodies[offset2+CHUNK_MASS];
            //acc += disp*G*M/r^3
            ddx += rx*G*m/r3;
            ddy += ry*G*m/r3;
            ddz += rz*G*m/r3;
        }
        bodies[offset1+CHUNK_KAX] = ddx;
        bodies[offset1+CHUNK_KAY] = ddy;
        bodies[offset1+CHUNK_KAZ] = ddz;
    }
}

const rk4Step = function(bodies,dt){
    const hdt = dt/2;
    // calculate k2
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        bodies[offset+CHUNK_KX ] = bodies[offset+CHUNK_X ] + bodies[offset+CHUNK_VX]*hdt;
        bodies[offset+CHUNK_KY ] = bodies[offset+CHUNK_Y ] + bodies[offset+CHUNK_VY]*hdt;
        bodies[offset+CHUNK_KZ ] = bodies[offset+CHUNK_Z ] + bodies[offset+CHUNK_VZ]*hdt;
        bodies[offset+CHUNK_KVX] = bodies[offset+CHUNK_VX] + bodies[offset+CHUNK_AX]*hdt;
        bodies[offset+CHUNK_KVY] = bodies[offset+CHUNK_VY] + bodies[offset+CHUNK_AY]*hdt;
        bodies[offset+CHUNK_KVZ] = bodies[offset+CHUNK_VZ] + bodies[offset+CHUNK_AZ]*hdt;
    }
    updateAccelerationK(bodies);
    // calculate k3
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        bodies[offset+CHUNK_KX ] = bodies[offset+CHUNK_X ] + bodies[offset+CHUNK_KVX]*hdt;
        bodies[offset+CHUNK_KY ] = bodies[offset+CHUNK_Y ] + bodies[offset+CHUNK_KVY]*hdt;
        bodies[offset+CHUNK_KZ ] = bodies[offset+CHUNK_Z ] + bodies[offset+CHUNK_KVZ]*hdt;
        bodies[offset+CHUNK_KVX] = bodies[offset+CHUNK_VX] + bodies[offset+CHUNK_KAX]*hdt;
        bodies[offset+CHUNK_KVY] = bodies[offset+CHUNK_VY] + bodies[offset+CHUNK_KAY]*hdt;
        bodies[offset+CHUNK_KVZ] = bodies[offset+CHUNK_VZ] + bodies[offset+CHUNK_KAZ]*hdt;
    }
    updateAccelerationK(bodies);
    // calculate k4
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        bodies[offset+CHUNK_X ] = bodies[offset+CHUNK_X ] + bodies[offset+CHUNK_KVX]*hdt;
        bodies[offset+CHUNK_Y ] = bodies[offset+CHUNK_Y ] + bodies[offset+CHUNK_KVY]*hdt;
        bodies[offset+CHUNK_Z ] = bodies[offset+CHUNK_Z ] + bodies[offset+CHUNK_KVZ]*hdt;
        bodies[offset+CHUNK_VX] = bodies[offset+CHUNK_VX] + bodies[offset+CHUNK_KAX]*hdt;
        bodies[offset+CHUNK_VY] = bodies[offset+CHUNK_VY] + bodies[offset+CHUNK_KAY]*hdt;
        bodies[offset+CHUNK_VZ] = bodies[offset+CHUNK_VZ] + bodies[offset+CHUNK_KAZ]*hdt;
    }
    updateAcceleration(bodies);
};

const nullOutBuffer = function(bodies){
    // null out displacement offset
    let xpms = 0;
    let ypms = 0;
    let zpms = 0;
    let totalMass = 0;
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        const mass = bodies[offset+CHUNK_MASS];
        xpms += bodies[offset+CHUNK_X]*mass;
        ypms += bodies[offset+CHUNK_Y]*mass;
        zpms += bodies[offset+CHUNK_Z]*mass;
        totalMass += mass;
    }
    const xavg = xpms/totalMass;
    const yavg = ypms/totalMass;
    const zavg = zpms/totalMass;
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        bodies[offset+CHUNK_X] -= xavg;
        bodies[offset+CHUNK_Y] -= yavg;
        bodies[offset+CHUNK_Z] -= zavg;
    }
    // null out the velocity offset
    let xmmt = 0;
    let ymmt = 0;
    let zmmt = 0;
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        const mass = bodies[offset+CHUNK_MASS];
        xmmt += bodies[offset+CHUNK_VX]*mass;
        ymmt += bodies[offset+CHUNK_VY]*mass;
        zmmt += bodies[offset+CHUNK_VZ]*mass;
    }
    let vxavg = xmmt/totalMass;
    let vyavg = ymmt/totalMass;
    let vzavg = zmmt/totalMass;
    for(let offset = 0; offset < bodies.length; offset += CHUNK_SIZE){
        bodies[offset+CHUNK_VX] -= vxavg;
        bodies[offset+CHUNK_VY] -= vyavg;
        bodies[offset+CHUNK_VZ] -= vzavg;
    }
    return bodies;
};


const judgeBodyBufferPure = function(buffer0){
    const buffer = buffer0.slice();
    const length = (buffer.length/CHUNK_SIZE)|0;
    const bound = 5*AU;
    // outside bounding box => bust
    // too close => bust
    let days = 0;
    while(true){
        // Give branch prediction a chance
        for(let j = 0; j < 100; j++){
            rk4Step(buffer,DAY);
        }
        days += 100;
        for(let offset = 0; offset < buffer.length; offset += CHUNK_SIZE){
            if(
                buffer[offset+CHUNK_X] < -bound || bound < buffer[offset+CHUNK_X] ||
                buffer[offset+CHUNK_Y] < -bound || bound < buffer[offset+CHUNK_Y] ||
                buffer[offset+CHUNK_Z] < -bound || bound < buffer[offset+CHUNK_Z]
            ){
                return days;
            }
        }
    }
};


const mutateBuffer = function(buffer,r){
    // only vary the velocity, that way it would be similar to how real spacecrafts capture orbits
    // for(let i = CHUNK_X; i <= CHUNK_Z; i++){
    //     buffer[i] += Math.random()*r;
    // }
    for(let i = CHUNK_X; i <= CHUNK_Z; i++){
        //buffer[i] += Math.random()*r*EV;
    }
    return buffer;
};

const evolveGeneration = function(genes,childCount,r){
    const bodies = [];
    const childGenes = [];
    for(let [buffer,score] of genes){
        // split the timeline into random intervals
        // stop the simulation there, and move it by error
        let refBuffer = buffer.slice();
        const intervals = randIntervals(score/10,childCount);
        for(let itv of intervals){
            for(let i = 0; i < itv; i++){
                rk4Step(refBuffer,DAY);
            }
            const childBuffer = mutateBuffer(refBuffer.slice(),r);
            nullOutBuffer(childBuffer);
            const childScore = judgeBodyBufferPure(childBuffer);
            childGenes.push([childBuffer,childScore]);
        }
    }
    return childGenes;
};

const createInterestingBodies = function(){
    const CHILD_CNT = 10;
    const BATCH_SIZE = 10;
    const GENERATIONS = 100;
    const BUFFER_SIZE = CHUNK_SIZE*3;
    // create the starting batch
    let genes = [];
    for(let i = 0; i < BATCH_SIZE*CHILD_CNT; i++){
        const buffer = new Float64Array(BUFFER_SIZE);
        for(let offset = 0; offset < BUFFER_SIZE; offset += CHUNK_SIZE){
            buffer[offset+CHUNK_MASS] = 1.989e+30;
            buffer[offset+CHUNK_X] = rand1()*5*AU;
            buffer[offset+CHUNK_Y] = rand1()*5*AU;
            buffer[offset+CHUNK_Z] = rand1()*5*AU;
            buffer[offset+CHUNK_VX] = rand1()*0.2*EV;
            buffer[offset+CHUNK_VY] = rand1()*0.2*EV;
            buffer[offset+CHUNK_VZ] = rand1()*0.2*EV;
        }
        nullOutBuffer(buffer);
        genes.push([buffer,judgeBodyBufferPure(buffer)]);
    }
    genes = genes.sort((a,b)=>{
        // Might introduce some randomness here
        return b[1] - a[1];
    }).slice(0,BATCH_SIZE);
    console.log(genes);

    let r = 0.001// error in velocity in multiples of earth velocity
    const COOLING_FACTOR = 0.7;
    for(let i = 0; i < GENERATIONS; i++){
        console.log(`generation ${i}`,genes.map(g=>g[1]));
        genes = evolveGeneration(genes,CHILD_CNT,r);
        r *= COOLING_FACTOR;
        // kill the bad genes
        genes = genes.sort((a,b)=>{
            // Might introduce some randomness here
            return b[1] - a[1];
        }).slice(0,BATCH_SIZE);
        debugger;
    }
    return genes[0][0];
};







// "Slow" code, object representation
//
// short version with functional mechanism
// const nullOutBodies = function(bodies){
//     // null out displacement offset
//     const [cx,cy,cz] = div(bodies.map(b=>mul(b.v,b.mass)).reduce(add2),bodies.map(b=>b.mass).reduce(add2));
//     bodies.map(b=>{
//         b.x -= cx;
//         b.y -= cy;
//         b.z -= cz;
//     });
//     // null out velocity offset
//     const [avx,avy,avz] = div(bodies.map(b=>b.dv).reduce(add2),bodies.length);
//     bodies.map(b=>{
//         b.vx -= avx;
//         b.vy -= avy;
//         b.vz -= avz;
//     });
// };
//
// old util functions
//
// const judgeBodies = function(bodies){
//     // outside bounding box => bust
//     // too close => bust
//     const buffer = encodeBodies(bodies);
//     const bound = 5*AU;
//     let days = 0;
//     while(true){
//         for(let j = 0; j < 1000; j++){
//             rk4Step(buffer,DAY);
//         }
//         days += 1000;
//         decodeBodies(buffer,bodies);
//         for(let body of bodies){
//             if(
//                 body.x < -bound || bound < body.x ||
//                 body.y < -bound || bound < body.y ||
//                 body.z < -bound || bound < body.z
//             ){
//                 return days;
//             }
//         }
//     }
// };



Array.prototype.inPlaceMap = function(cb){
    for(let i = 0; i < this.length; i++){
        this[i] = cb(this[i],i);
    }
    return this;
};

const createGenericOperator = function(op){
    return function(...vals){
        let acc = typeof vals[0] === "number" ? vals[0] : [...vals[0]];
        let isVec = typeof acc !== "number";
        for(let i = 1; i < vals.length; i++){
            let val = vals[i];
            if(typeof val === "number"){
                if(!isVec){
                    acc = op(acc,val)
                }else{
                    acc.inPlaceMap(v=>op(v,val));
                }
            }else{
                if(!isVec){
                    let acc1 = [...val].inPlaceMap(v=>op(v,acc));
                    acc = acc1;
                    isVec = true;
                }else{
                    for(let i = 0; i < acc.length; i++){
                        acc[i] = op(acc[i],val[i]);
                    }
                }
            }
        }
        return acc;
    }
}

const log = function(...vals){
    console.log(...vals);
    return vals.at(-1);
}
const to2 = function(fun){
    return (a,b)=>{
        return fun(a,b);
    };
};

const add = createGenericOperator((a,b)=>a+b);
const mul = createGenericOperator((a,b)=>a*b);
const div = createGenericOperator((a,b)=>a/b);
const add2 = to2(add);

const magn = function(v){
    return Math.sqrt(v.map(v=>v*v).reduce(add2));
}



class Body{
    mass = 0;
    x    = 0;
    y    = 0;
    z    = 0;
    vx   = 0;
    vy   = 0;
    vz   = 0;
    ax   = 0;
    ay   = 0;
    az   = 0;
    constructor(params = {}){
        for(let key in params){
            this[key] = params[key];
        }
    }
    clone(){
        const body = new Body();
        body.mass = this.mass;
        body.x    = this.x   ;
        body.y    = this.y   ;
        body.z    = this.z   ;
        body.vx   = this.vx  ;
        body.vy   = this.vy  ;
        body.vz   = this.vz  ;
        body.ax   = this.ax  ;
        body.ay   = this.ay  ;
        body.az   = this.az  ;
        return body;
    }
    get v(){
        const {x,y,z} = this;
        return [x,y,z];
    }
    get dv(){
        const {vx,vy,vz} = this;
        return [vx,vy,vz];
    }
    get ddv(){
        const {ax,ay,az} = this;
        return [ax,ay,az];
    }
    connectOscillator(actx){
        const oscillator = actx.createOscillator(); //creates oscillator
        oscillator.type = "sine"; //chooses the type of wave
        console.log(this.vx,this.vy,this.vz,magn(this.dv));
        oscillator.frequency.value = magn(this.dv)/100;

        const gainNode = actx.createGain();
        gainNode.gain.value = 1/30;

        gainNode.connect(actx.destination);

        oscillator.connect(gainNode); //sends to output
        oscillator.start(actx.currentTime) //starts the sound at the
        this.oscillator = oscillator;
    }
    updateFrequency(){
        this.oscillator.frequency.value = magn(this.dv)/50;
    }
}

const encodeBodies = function(bodies){
    const buffer = new Float64Array(bodies.length*CHUNK_SIZE);
    for(let i = 0; i < bodies.length; i++){
        const offset = i*CHUNK_SIZE;
        const body = bodies[i];
        buffer[offset+0] = body.mass;
        buffer[offset+1] = body.x;
        buffer[offset+2] = body.y;
        buffer[offset+3] = body.z;
        buffer[offset+4] = body.vx;
        buffer[offset+5] = body.vy;
        buffer[offset+6] = body.vz;
    }
    updateAcceleration(buffer);
    return buffer;
};


const decodeBodies = function(buffer,bodies = []){
    const len = buffer.length/CHUNK_SIZE;
    if(len%1 !== 0)throw new Error("Chunk not aligned");
    while(bodies.length < len){
        bodies.push(new Body);
    }
    for(let i = 0; i < len; i++){
        const body = bodies[i];
        const offset = i*CHUNK_SIZE;
        body.mass = buffer[offset+0]; 
        body.x    = buffer[offset+1]; 
        body.y    = buffer[offset+2]; 
        body.z    = buffer[offset+3]; 
        body.vx   = buffer[offset+4]; 
        body.vy   = buffer[offset+5]; 
        body.vz   = buffer[offset+6]; 
        body.ax   = buffer[offset+7]; 
        body.ay   = buffer[offset+8]; 
        body.az   = buffer[offset+9]; 
    }
    return bodies;
};

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const side = width < height ? width : height;
const viewAU = 20;
const AUSize = side/viewAU;
//equals to 20AU
const renderBodies = function(bodies,days,maxDays){
    ctx.clearRect(0,0,width,height);
    for(let body of bodies){
        const x = ((body.x/AU)+viewAU/2)*AUSize;
        const y = ((body.y/AU)+viewAU/2)*AUSize;
        ctx.beginPath();
        ctx.arc(x,y,3,0,TAU);
        ctx.fill();
    }
    ctx.fillText(`${days}/${maxDays}`,100,100);
};


const startSimulation = async function(){
    // console.log("asdfasd");
    const [bodies,maxDays] = createInterestingBodies();
    const buffer = encodeBodies(bodies);
    console.log(buffer);

    //const buffer = new Float64Array([1.989e+30, -398470123032.0434, 394868695454.98615, -556813506781.9174, -5149.600572301151, -289.1235302067803, -2517.492184588701, 1.8524082839634604e-23, 6.251234668838815e-24, -4.16291193407575e-24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.989e+30, -403987762894.6275, -319641312481.0409, 314622513035.801, 1206.0136929446235, 2907.498704437943, -1853.6735209267501, 3.436085418322786e-23, -6.295883649682426e-24, 1.4124916912956567e-23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.989e+30, 802457885926.6707, -75227382973.94528, 242190993746.1164, 3943.5868793565273, -2618.3751742311633, 4371.165705515451, 2.6496914733714377e-23, -6.546100973888311e-26, 5.043875354930401e-24, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //const buffer = new Float64Array([1.989e+30, 245797944894.24652, 55045138269.93182, 486761283626.175, -179.95732883597475, -1402.2593020946813, 228.50793870512643, 3.1688767995491376e-23, -3.1590613807619666e-23, -3.223003910320858e-23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.989e+30, 392117323580.21747, -259487357056.0473, -76165239372.32129, -4084.1867271258725, 2788.5156228992605, 3273.287117408756, 1.851451762226286e-23, 5.769409243723047e-24, 4.0650092379496875e-23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.989e+30, -637915268474.464, 204442218786.11548, -410596044253.8537, 4264.144055961848, -1386.2563208045785, -3501.795056113882, 2.3590746123590003e-23, -8.625945971997604e-24, 1.2568327563126797e-23, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //const maxDays = 303000;
    //const bodies = decodeBodies(buffer);



    const actx = new AudioContext(); //allows access to webaudioapi
    bodies.map(b=>b.connectOscillator(actx))
    //bodies[0].connectOscillator(actx)
    let days = 0;
    while(true){
        renderBodies(bodies,days,maxDays);
        for(let i = 0; i < 10; i++){
            rk4Step(buffer,DAY);
        }
        days += 10;
        decodeBodies(buffer,bodies);
        bodies.map(b=>b.updateFrequency());
        await new Promise(res=>setTimeout(res,20));
    }
    // while(true){
    //     renderBodies(bodies);
    //     let ad = 10;
    //     for(let a = 0; a < ad; a++){
    //         for(let i = 0; i < 10000/ad; i++){
    //             rk4Step(buffer,DAY/500);
    //         }
    //         decodeBodies(buffer,bodies);
    //         bodies.map(b=>b.updateFrequency())
    //     }
    //     //bodies[0].updateFrequency()
    //     await new Promise(res=>setTimeout(res,20));
    // }
}

canvas.addEventListener("click",startSimulation);




