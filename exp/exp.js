const darr = new Float64Array(1);
const farr = new Float32Array(darr.buffer);
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

const floatToBits = function(n){
    farr[0] = n;
    return bytesToBits(barr.slice(0,4));
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
    
    let pow = parseInt(exp.join(""),2)-1023;
    if(isSubnormal)pow = -1022;
    let arr = new Array(2046+52).fill(0);
    for(let i = 0; i < 52; i++){
        arr[i+pow+1022] = mentissa[i];
    }
    if(!isSubnormal)arr[pow+1022+52] = 1;
    return arr;
}

let magicNumbers = [];
for(let i = -1022-52; i <= 1023; i++){
    magicNumbers.push(Math.E**(2**i));
}
console.log(JSON.stringify(magicNumbers).replace(/null/g,"Infinity"));


const epower = function(n){
    if(n < 0)return 1/epower(-n);
    let bits = toBits(n);
    let result = 1;
    console.log(JSON.stringify(bits));
    for(let i = 0; i < bits.length; i++){
        if(bits[i] === 0)continue;
        result *= magicNumbers[i];
    }
    return result;
}

console.log(epower(3.14159265),Math.E**3.14159265);


