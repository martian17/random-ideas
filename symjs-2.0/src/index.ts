type Fstring = Formula | string;

const toFormula = function(val: Fstring): Formula{
    if(typeof val === "string"){
        return parseFormula(val);
    }else if(val instanceof Formula){
        return val;
    }
    console.log(val);
    throw new Error("Unexpected input");
}

type FstringArray = Fstring[] | Fstring[][];

const toFormulaArray = function(val: FstringArray): Formula[]{
    // @ts-ignore
    const fstrings: Fstring[] = val[0] instanceof Array ? val[0] : val;
    return fstrings.map(v=>toFormula(v));
}

class Formula{
    isDivision(): boolean{
        return this instanceof Division;
    }
    isAddition(): boolean{
        return this instanceof Addition;
    }
    isMultiplication(): boolean{
        return this instanceof Multiplication;
    }
    sign = 1;
    negate(){

        this.sign *= -1;
    }
    equal(b: Fstring){
        b = toFormula(b);
        return this.toString() === b.toString();
    }
    add(f: Fstring){
        f = toFormula(f);
        return Addition.from(this,f);
    }
    multiply(f: Fstring){
        f = toFormula(f);
        if(typeof f === "string"){
            f = parseFormula(f);
        }
        return Multiplication.from(this,f);
    }
    divide(f: Fstring){
        f = toFormula(f);
        if(typeof f === "string"){
            f = parseFormula(f);
        }
        return Division.from(this,f);
    }
}

class Addition extends Formula{
    terms: Formula[] = [];
    static from(...args: FstringArray){
        args = toFormulaArray(args);
        const addition = new Addition;
        addition.terms = args;
        return addition;
    }
    negate(){
        //sign DNE on addition nanodesu!
        this.terms.map(t=>t.negate());
        return this;
    }
    toString(){
        let terms = this.terms.map(t=>t.toString()).sort();
        let res = terms[0];
        for(let term of terms.slice(1)){
            if(term[0] === "-"){
                res += term;
            }else{
                res += "+"+term;
            }
        }
        return `(${res})`;
    }
    add(f: Fstring){
        if(typeof f === "string"){
            f = parseFormula(f);
        }
        let fstr = f.toString();
        let fcnt = 1;
        let fmain = fstr;
        if(fstr[0] === "-"){
            fcnt = -1;
            fmain = fmain.slice(1);
        }
        let terms1 = [];
        for(let term of this.terms){
            let tstr = term.toString();
            let tmain = tstr;
            let tcnt = 1;
            if(tstr[0] === "-"){
                tcnt = -1;
                tmain = tmain.slice(1);
            }
            if(tmain === fmain){
                fcnt += tcnt;
            }else{
                terms1.push(term);
            }
        }
        if(fcnt === -1){
            terms1.push(f.negate());
        }else if(fcnt === 1){
            terms1.push(f);
        }else if(fcnt === 0){
            // do nothing
        }else{
            terms1.push(f.multiply(`${fcnt}`));
        }
        this.terms = terms1;
        return this;
    }
}

class Division extends Formula{
    num!: Formula;
    den!: Formula;
    static from(num: Fstring, den: Fstring){
        num = toFormula(num);
        den = toFormula(den);
        const division = new Division;
        division.num = num;
        division.den = den;
        return division;
    }
    toString(){
        return `${this.sign===-1?"-":""}(${this.num.toString()})/(${this.den.toString()})`
    }
    flip(){
        [this.num,this.den] = [this.den,this.num];
    }
}

class Multiplication extends Formula{
    terms: Formula[] = [];
    static from(..._args: FstringArray){
        const args = toFormulaArray(_args);
        const multiplication = new Multiplication;
        multiplication.terms = args;
        return multiplication;
    }
    toString(){
        let terms = this.terms.map(t=>t.toString()).sort();
        let sign = this.sign;
        terms = terms.map(v=>{
            if(v[0] === "-"){
                sign *= -1;
                return v.slice(1);
            }else{
                return v;
            }
        })
        let res = terms[0];
        for(let term of terms.slice(1)){
            res += "*"+term;
        }
        return `${sign===-1?"-":""}(${res})`;
    }
}

class Symbol extends Formula{
    static from(value){
        const symbol = new Symbol;
        symbol.value = value;
        return symbol;
    }
    toString(){
        return (this.sign===-1?"-":"")+this.value;
    }
}

class Equation extends Formula{
    static from(left,right){
        const equation = new Equation;
        equation.left = left;
        equation.right = right;
        return equation;
    }
    divCheck(){
        const {left,right} = this;
        if(!left.isDivision() || !right.isDivision){
            throw new Error("flipDiv: not division");
        }
        return [left,right];
    }
    flipDiv(){
        const [left,right] = this.divCheck();
        left.flip();
        right.flip();
        return this;
    }
    divMovLR(){
        let [left,right] = this.divCheck();
        let ln = left.num;
        let ld = left.den;
        let rn = right.num;
        let rd = right.den;
        left = ln;
        right.num = Multiplication.from(ld,rn);
        this.left = left;
        this.right = right;
        return this;
    }
    divMovRL(){
        [this.left,this.right] = [this.right,this.left];
        this.divMoveLR();
        [this.left,this.right] = [this.right,this.left];
        return this;
    }
    addToBoth(str){
        this.left = this.left.add(str);
        this.right = this.right.add(str);
        return this;
    }
    toString(){
        return this.left.toString()+"="+this.right.toString();
    }
}

class Number extends Formula{
    static from(value){
        const number = new Number;
        number.value = value;
        return number
    }
    toString(){
        return `${this.value}`;
    }
    negate(){
        this.value = -this.value;
    }
}






const binaries = new Map([..."=+-/*"].map((v,i)=>[v,i]));
const prefixes = new Set("-");

// @ts-ignore
const precedences: Map<operator, number[]> = new Map(`
= 10 11
+ 20 19
- 30 29
/ 40 39
* 50 49
p- 60 60
( -100 100 -- immediately push to stack
) -100 0 -- never see on the left side
EOF -200 -200 -- never on the left side
`.trim().split("\n").map(l=>l.split(" ")).map(([o,p1,p2])=>[o,[parseInt(p1),parseInt(p2)]]));

type operator = "=" | "+" | "-" | "/" | "*" | "p-" | "(" | ")" | "EOF";

const takeOperand = function(str: string): [Number | Symbol, string]{
    let match;
    if(match = str.match(/^[0-9]+/)?.[0]){
        return [Number.from(match),str.slice(match.length).trim()];
    }else if(match = str.match(/^[A-Za-z_][A-Za-z_0-9]*/)?.[0]){
        return [Symbol.from(match),str.slice(match.length).trim()];
    }
    console.log(str);
    throw new Error("Unexpected operand (identifier or number)");
};


// parser states
const PRE = 0; 
const OP  = 1;
const BIN = 2;
const CP  = 3;
const ID  = 4;
const END = 5;

const stateMap = [
    [1,1,0,0,1,0],
    [1,1,0,0,1,0],
    [1,1,0,0,1,0],
    [0,0,1,1,0,1],
    [0,0,1,1,0,1],
];


const parseFormula = function(str: string): Formula{
    const operators: operator[] = [];
    const operands: Formula[] = [];
    const reduce = function(){
        let newop = operators.pop();
        if(!newop)throw new Error("Unexpectedly ran out of operators!");
        let p = precedences.get(newop)[1];
        while(operators.length !== 0 && precedences.get(operators.at(-1))[0] > p){
            let op = operators.pop();
            if(binaries.has(op)){
                let right = operands.pop();
                let left = operands.pop();
                if(op === "="){
                    operands.push(Equation.from(left,right));
                }else if(op === "+" || op === "-"){
                    if(op === "-")right.negate();
                    operands.push(Addition.from(left,right));
                }else if(op === "*"){
                    operands.push(Multiplication.from(left,right));
                }else if(op === "/"){
                    operands.push(Division.from(left,right));
                }else{
                    throw new Error(`"${op}" binary operator not found`);
                }
            }else if(op[0] === "p" && prefixes.has(op.slice(1))){
                let right = operands.at(-1);
                if(op === "p-"){
                    right.negate();
                }else{
                    throw new Error(`"${op}" prefix operator not found`);
                }
            }else{
                // possibly parenthesis, but should be forbidden by precedence
                throw new Error(`"${op}" unexpected operator`);
            }
        }
        operators.push(newop);
    }
    let rest = str.trim();
    let state = PRE;
    while(true){
        let sp = stateMap[state];
        if(sp[PRE] && prefixes.has(rest[0])){
            operators.push("p"+rest[0]);
            rest = rest.slice(1).trim();
            state = PRE;
            reduce();
        }else if(sp[OP] && rest[0] === "("){
            operators.push("(");
            rest = rest.slice(1).trim();
            state = OP;
        }else if(sp[BIN] && binaries.has(rest[0])){
            operators.push(rest[0]);
            rest = rest.slice(1).trim();
            state = BIN;
            reduce();
        }else if(sp[CP] && rest[0] === ")"){
            operators.push(")");
            rest = rest.slice(1).trim();
            state = CP;
            reduce();
            operators.pop();
            if(operators.at(-1) !== "("){
                throw new Error("Expected matching parenthesis");
            }
            operators.pop();
        }else if(sp[ID] && rest.match(/^[A-Za-z0-9_]/)){
            let token;
            [token,rest] = takeOperand(rest);
            operands.push(token);
            state = ID;
        }else if(sp[END]){
            if(rest !== ""){
                throw new Error(`Unexpected token ${rest}`);
            }
            operators.push("EOF");
            reduce();
            if(operators.length !== 1){
                console.log(operators);
                throw new Error("Unused operators");
            }else if(operands.length !== 1){
                console.log(operands);
                throw new Error("Wrong number of remaining operands, expected 1");
            }
            return operands[0];
        }
    }
}
