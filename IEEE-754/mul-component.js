import {Vin, Vout, VinRelay, Gate, CompositeGate, ManyToOneGate, Not, And, Or} from "./index.js";


class ShiftedAddition extends CompositeGate{
    cosntructor(){
    }
}


class FullMultiplication extends CompositeGate{
    constructor(n){
        super(n*2,n*2);
        
    }
}


