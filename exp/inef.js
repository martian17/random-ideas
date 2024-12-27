const darr = new Float64Array(1);
const iarr = new Int32Array(darr.buffer);
const barr = new Uint8Array(darr.buffer);

const bytesToBits = function(bytes){
    const arr = [];
    for(let i = 0; i < bytes.length; i++){
        for(let j = 0; j < 8; j++){
            arr.push((bytes[i]>>>j)&1);
        }
    }
    return arr;
};

const doubleToBits = function(n){
    darr[0] = n;
    return bytesToBits(barr.slice(0,8));
};


const intToBits = function(n){
    iarr[0] = n;
    return bytesToBits(barr.slice(0,4));
};


const toBits = function(db){
    const bits = doubleToBits(db);
    const mentissa = bits.slice(0,52);
    const exp = bits.slice(52,63).reverse();
    const sign = bits[64];
    const isSubnormal = exp.reduce((a,b)=>a|b) === 0;
    
    let arridx = parseInt(exp.join(""),2);
    arridx--;
    if(isSubnormal)arridx = 0;
    let arr = new Array(2098).fill(0);
    for(let i = 0; i < 52; i++){
        arr[arridx] = mentissa[i];
        arridx++;
    }
    if(!isSubnormal)arr[arridx] = 1;
    return arr;
}

const bitsToInt = function(bits){
    let byte = 0;
    for(let i = 0; i < 32; i++){
        byte |= bits[i]<<i;
    }
    return byte;
}

const toDouble = function(bits){
    let mpow = 2046;
    let i = bits.length-1;
    for(; i >= 0; i--){
        if(bits[i] === 1)break;
        mpow--;
    }
    let pow = intToBits(mpow).slice(0,11);
    let frac = bits.slice(0,i).reverse().slice(0,53).reverse().slice(1);
    for(let i = frac.length; i < 52; i++){
        frac.push(0);
    }
    let dbits = frac.concat(pow);
    dbits.push(0);
    const b1 = bitsToInt(dbits.slice(0,32));
    const b2 = bitsToInt(dbits.slice(32,64));
    iarr[0] = b1;
    iarr[1] = b2;
    return darr[0];
}

let magicNumberSeed = [1.0000000000000002,1.0000000000000004,1.0000000000000009,1.0000000000000018,1.0000000000000036,1.000000000000007,1.0000000000000142,1.0000000000000284,1.0000000000000568,1.0000000000001137,1.0000000000002274,1.0000000000004547,1.0000000000009095,1.000000000001819,1.000000000003638,1.000000000007276,1.000000000014552,1.0000000000291038,1.0000000000582077,1.0000000001164153,1.0000000002328306,1.0000000004656613,1.0000000009313226,1.0000000018626451,1.0000000037252903,1.0000000074505806,1.0000000149011612,1.0000000298023228,1.0000000596046466,1.0000001192092967,1.0000002384186075,1.000000476837272,1.0000009536747712,1.0000019073504518,1.0000038147045416,1.000007629423635,1.0000152589054785,1.000030518043791,1.0000610370189331,1.0001220777633837,1.0002441704297478,1.0004884004786945,1.0009770394924165,1.0019550335910028,1.0039138893383475,1.007843097206448,1.0157477085866857,1.0317434074991028,1.0644944589178595,1.1331484530668263,1.2840254166877414,1.6487212707001282,2.718281828459045,7.3890560989306495,54.59815003314423,2980.957987041727,8886110.520507865,78962960182680.56,6.235149080811596e+27,3.8877084059945687e+55,1.511427665004083e+111,2.2844135865396945e+222];

let magicNumbers = [];
let idx = 0;
for(let i = 0; i < 1022; i++){
    magicNumbers.push(1);
}
for(let i = 0; i < magicNumberSeed.length; i++){
    magicNumbers.push(magicNumberSeed[i]);
}
for(let i = 0; i < 1014; i++){
    magicNumbers.push(Infinity);
}


const epower = function(n){
    if(n < 0)return 1/epower(-n);
    let bits = toBits(n);
    let result = 1;
    for(let i = 0; i < bits.length; i++){
        if(bits[i] === 0)continue;
        result *= magicNumbers[i];
    }
    return result;
}

const epowerBits = function(bits){
    let result = 1;
    console.log(JSON.stringify(bits));
    for(let i = 0; i < bits.length; i++){
        if(bits[i] === 0)continue;
        result *= magicNumbers[i];
    }
    return result;
}

const ln = function(n){
    let blen = 2046+52;
    let resultBits = new Array(blen).fill(0);
    let res = 1;
    for(let i = blen-1; i >= 0; i--){
        let res1 = res * magicNumbers[i];
        if(res1 <= n){
            resultBits[i] = 1;
            res = res1;
        }
    }
    return toDouble(resultBits);
}


let add = function(a,b){
    return ln(epower(a)*epower(b));
}

console.log(add(2,3));


