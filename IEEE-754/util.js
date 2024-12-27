import {Vin, Vout, High, Low VinRelay, Gate, CompositeGate, ManyToOneGate, Not, And, Or} from "hd.js";

const repeat = function(n,content){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(content);
    }
    return arr;
}

const createUtilArray = function(arr){
    arr.replace = function(idx,length,cb){
        let subarr = cb(arr.slice(idx,idx+length,cb));
        for(let i = 0; i < arr.length; i++){
            arr[idx+i] = subarr[i];
        }
    }
    // arr.replace = function(idx,subarr){
    //     for(let i = 0; i < arr.length; i++){
    //         arr[idx+i] = subarr[i];
    //     }
    // }
    return arr;
}


class AddCarry extends CompositeGate{
    constructor(){
        super(3,2,[...arguments]);
        let [i1,i2,i3] = this.mappedInputs;
        let xor12 = new Xor(i1,i2).output;
        let p1 = new Xor(xor12,i3).output;
        let p2 = new Or(new And(i1,i2).output,new And(xor12,i3).output).output;
        this.mappedOutputs[0].connect(p1);
        this.mappedOutputs[1].connect(p2);
    }
}


// Everything in little endian
class AddN extends CompositeCircuit{
    constructor(n){
        super(n*2,n+1);
        const acc = this.mappedInputs.slice(0,n);
        const digits = this.mappedInputs.slice(n);
        let carry = Low;
        for(let i = 0; i < n; i++){
            const d1 = acc[i];
            const d2 = digits[i];
            let out;
            [carry,out] = new AddCarry(d1,d2,carry).outputs;
            acc[i] = out;
        }
        acc.push(carry);
    }
}

class MulN extends CompositeCircuit{
    constructor(n){
        super(n*2,n*2);
        const acc = createUtilArray(repeat(Low,n*2));
        for(let i = 0; i < n; i++){
            acc.replace(i,);
        }
    }
}
















