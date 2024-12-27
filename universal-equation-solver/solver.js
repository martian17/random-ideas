// test
// combinators
// term things
// everything with stringify
// compare everything with hash


// base class
class Equation{
    stringify(){
        return "";
    }
    simplify(){
        return this.clone();
    }
    clone(){
        return Object.assign(Object.create(Object.getPrototypeOf(this)),this)
    }
}

const M = {};

M.gcd = function(a,b){
    if (b > a) {
        const temp = a;
        a = b;
        b = temp;
    }
    while (true) {
        if (b == 0) return a;
        a %= b;
        if (a == 0) return b;
        b %= a;
    }
};

class Fraction extends Equation{
    static create(sign,num,den){
        const f = new Fraction();
        f.sign = sign|0;
        f.num = num|0;
        f.den = den|0;
    }
    simplify(){
        const {sign,num,den} = this;
        const _gcd = M.gcd(num,den);
        return Fraction.from(sign,num,den);
    }
    stringify(){
        const {sign,num,den} = this;
        let s = sign === -1 ? "-" : "";
        if(den === 1)
            return s+num;
        return `${s}${num}/${den}`;
    }
}

class Variable extends Equation{
    static create(name){
        this.name = name;
    }
    stringify(){
    }
}

class Terms{
    terms = [];
    stringify(){
        // 
    }
}

