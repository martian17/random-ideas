type Fstring = Formula | string;
type FstringArray = Fstring[] | Fstring[][];

const toFormula = function(val: Fstring): Formula{
    if(typeof val === "string"){
        return parseFormula(val);
    }else if(val instanceof Formula){
        return val;
    }
    console.log(val);
    throw new Error("Unexpected input");
}

const toFormulaArray = function(val: FstringArray): Formula[]{
    // @ts-ignore
    const fstrings: Fstring[] = val[0] instanceof Array ? val[0] : val;
    return fstrings.map(v=>toFormula(v));
}


class Formula{
}
