import {Vin, Vout, High, Low VinRelay, Gate, CompositeGate, ManyToOneGate, Not, And, Or} from "hd.js";

const repeat = function(item,n){
    const arr = [];
    for(let i = 0; i < n; i++){
        arr.push(item);
    }
    return arr;
};

export class Xor extends CompositeGate{
    constructor(){
        super(2,1,[...arguments]);
        this.output = this.outputs[0];
        let [i1, i2] = this.mappedInputs;
        let [i1n, i2n] = this.mappedInputs.map(relay=>new Not(relay).output);
        let a1 = new And(i1,i2n).output;
        let a2 = new And(i1n,i2).output;
        let out = new Or(a1,a2).output;
        out.connect(this.mappedOutputs[0]);
    }
}

class AddCarry extends CompositeGate{
    constructor(){
        super(3,2,[...arguments]);
        let [i1,i2,i3] = this.mappedInputs;
        let xor12 = new Xor(i1,i2).output;
        let p1 = new Xor(xor12,i3).output;
        let p2 = new Or(new And(i1,i2).output,new And(xor12,i3).output).output;
        this.mappedOutputs[0].connect(p2);
        this.mappedOutputs[1].connect(p1);
    }
}

class FullMult extends CompositeGate{
    constructor(n){
        super(n*2,n*2);
        const baseDigits = [...repeat(Low,n),...this.mappedInput];
        for(let offset = 0; offset < n; offset++){
            
            addCarry(baseDigits.slice(-offset));
            
        }
    }
}


