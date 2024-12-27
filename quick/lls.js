const lls = function(points){
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sx2 = 0;
    let sy2 = 0;
    let n = points.length;
    for(let [x,y] of points){
        sx += x;
        sy += y;
        sxy += x*y;
        sx2 += x*x;
        sy2 += y*y;
    }
    let c1 = 2*sx2;
    let c2 = 2*sx;
    let c3 = -2*sxy;
    let c4 = 2*sx;
    let c5 = 2*n;
    let c6 = -2*sy;
    let L = c2*c4-c5*c1;
    let R = c6*c1-c3*c4;
    let b = R/L;
    let a = -(b*c2+c3)/c1;
    return [a,b];
}
const vectify = function(a,b){
    if(typeof a === "number" && b instanceof Array)
        return [b.map(v=>a),b];
    if(typeof b === "number" && a instanceof Array)
        return [a,a.map(v=>b)];
    if(a instanceof Array && b instanceof Array)
        return [a,b];
    console.log(a,b);
    throw new Error("either of the two needs to be a vector");
}

const vecdiff = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]-v2[i]);
    }
    return r;
};
const vecadd = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]+v2[i]);
    }
    return r;
};
const vecmul = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]*v2[i]);
    }
    return r;
};
const vecdiv = function(v1,v2){
    [v1,v2] = vectify(v1,v2);
    let r = [];
    for(let i = 0; i < v1.length; i++){
        r.push(v1[i]/v2[i]);
    }
    return r;
};

const vecsum = function(vec){
    let r = 0;
    for(let val of vec){
        r += val;
    }
    return r;
};

const vecNegate = function(vec){
    let r = [];
    for(let val of vec){
        r.push(-val);
    }
    return r;
};

const vecmagn = function(vec){
    let r = 0;
    for(let v of vec){
        r += v*v;
    }
    return Math.sqrt(r);
};

const findClosestPoints = function([a,va],[b,vb]){
    const A = va;
    const B = vecNegate(vb);
    const C = vecdiff(a,b);
    const c1 = vecsum(vecmul(A,A));
    const c2 = vecsum(vecmul(A,B));
    const c3 = vecsum(vecmul(A,C));
    const c4 = vecsum(vecmul(A,B));
    const c5 = vecsum(vecmul(B,B));
    const c6 = vecsum(vecmul(B,C));
    console.log(c1,c2,c3,c4,c5,c6);

    const N = c1*c6-c3*c4;
    const D = c2*c4-c1*c5;
    console.log(N,D);
    const t2 = N/D;
    const t1 = -(t2*c2+c3)/c1;
    return [
        vecadd(a,vecmul(va,t1)),
        vecadd(b,vecmul(vb,t2))
    ];
};

const findClosestMidPoint = function(l1,l2){
    const [p1,p2] = findClosestPoints(l1,l2);
    return vecdiv(vecadd(p1,p2),2);
}

const lls3d = function(points){
    const [a,b] = lls(points.map(([x,y,z])=>[z,x]));
    const [c,d] = lls(points.map(([x,y,z])=>[z,y]));
    const [e,f] = lls(points.map(([x,y,z])=>[x,y]));
    // e,f unused
    return [[b,d,0],[a,d,1]]
}


console.log(findClosestPoints([[1,2,0],[1,1,1]],[[-2,1,0],[1,-1,1]]));
//console.log(findClosestPoints([[0,0,0],[1,1,0]],[[0,0,1],[1,-1,0]]));
//console.log(lls([[2,1],[3,3],[3.5,3],[3.5,5],[4,5]]));
