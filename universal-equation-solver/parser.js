// binary operator and functions
// unary operator (prefix and siffix)
// parenthesis

// this is stage one, so the result closely reflects the syntax
// z.b. the operator an funccall are considered differently
// b.2. the operator contains grouping () and equality = which will not be part of the final form

const ERRORS = {
    CHUNK: 1,
    OPEN_PAREN: 2,
    ID: 3,
    NUMBER: 4,
    GROUP: 5,
    CLOSE_PAREN: 6,
    CLOSE_PAREN_OR_COMMA: 7,
    PREFIX: 8,
    SUFFIX: 9,
    BINARY: 10,
};

const NODES = {
    ID: 1,
    NUMBER: 2,
    FUNCCALL: 3,
    OPERATOR: 4,
    GROUP: 5,
}

// namespacing
const NewNode = {
    id: function(value){
        return {type: NODES.ID, value};
    },
    number: function(value){
        return {type: NODES.NUMBER, value};
    },
    funccall: function(funcname,arguments){
        return {type: NODES.FUNCCALL, funcname, arguments};
    },
    operator: function(opname,arguments){
        return {type: NODES.OPERATOR, opname, arguments};
    },
    group: function(value){
        return {type: NODES.GROUP, value};
    },
};


// immer trim lassen nach dem primitive aussprechen

const getId = function(str){
    let match = str.match(/^[a-zA-Z_][a-zA-Z_0-9]*/);
    if(!match){
        return [false,str,ERRORS.ID];
    }
    match = match[0];
    str = str.slice(match.length).trimStart();
    return [NewNode.id(match),str,false];
}

const getNumber = function(str){
    let match = str.match(/^[+\-]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+\-]?\d+)?/);
    if(!match){
        return [false,str,ERRORS.NUMBER];
    }
    match = match[0];
    str = str.slice(match.length).trimStart();
    return [NewNode.number(match),str,false];
}


const getFunctionArgs = function(str){
    let str0 = str;
    let res,err;

    if(str[0] !== "(")return [false,str0,ERRORS.OPEN_PAREN];
    str = str.slice(1).trimStart();
    let args = [];
    while(true){
        [res,str,err] = getExpression(str);
        if(str[0] === ","){
            str = str.slice(1).trimStart();
            args.push(res);
        }else if(str[0] === ")"){
            str = str.slice(1).trimStart();
            args.push(res);
            return [args,str,false];
        }else{
            return [false,str0,ERRORS.CLOSE_PAREN_OR_COMMA];
        }
    }
};

const getGroup = function(str){
    let str0 = str;
    let res,err;
    if(str[0] !== "(")return [false,str0,ERRORS.OPEN_PAREN];
    str = str.slice(1).trimStart();
    [res,str,err] = getExpression(str);
    if(err)return [false,str0,err];
    if(str[0] !== ")")return [false,str0,ERRORS.CLOSE_PAREN];
    str = str.slice(1).trimStart();
    return [newNode.group(res),str,false];
};

// chunk is a unit of code which opearator considers as a single block
const getChunk = function(str){// str -> [token,str] or false
    let str0 = str;
    let res,err;
    //returns id, group, or function

    // check if id or function
    [res,str,err] = getId(str);
    if(!err){
        const id = res;
        [res,str,err] = getFunctionArgs(str);
        if(!err){
            return [newNode.funccall(id,res),str,false];
        }else{
            return [id,str,false];
        }
    }
    // check if group
    [res,str,err] = getGroup(str);
    if(!err){
        return [res,str,false];
    }
    // check if number
    [res,str,err] = getNumber(str);
    if(!err){
        return [res,str,false];
    }
    // return error
    return [false,str0,ERRORS.CHUNK];
};

const createMatcher = function(prefix,tokens,error){
    let tokenList = [null];
    for(let token of tokens){
        while(tokenList.length <= token.length){
            tokenList.push(new Set());
        }
        tokenList[token.length].add(token);
    }
    return function(str){
        for(let l = 1; l < tokenList.length; l++){
            const token = str.slice(0,l);
            if(tokenList[l].has(token)){
                return [p+token,str.slice(l).trimStart(),false];
            }
        }
        return [false,str,error];
    }
}

const getPrefix = createMatcher("p",["+","-"],ERRORS.PREFIX);
const getSuffix = createMatcher("s",["+","-"],ERRORS.SUFFIX);
const getBinary = createMatcher("b",["+","-","*","/","^"],ERRORS.SUFFIX);

/*
chunk: id, group, function
start -> prefix, chunk
chunk -> suffix, binary, end
prefix -> prefix, chunk
suffix -> suffix, binary, end
binary -> prefix, chunk
// when unparsable, return to the parent with the ticket "chunk-end"
*/

const STATE = {
    START: 1,
    CHUNK: 2,
    PREFIX: 3,
    SUFFIX: 4,
    BINARY: 5,
};

const getExpression = function(str){
    const ops = [];
    const vals = [];
    let state = STATE.START;


    
}

