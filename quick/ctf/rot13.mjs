const rot13Char = function(cs){
    let c = cs.charCodeAt(0);
    let a = "a".charCodeAt(0);
    let z = "z".charCodeAt(0);
    let zz = z+1;

    let code = a+((c-a)+13)%(zz-a);
    return String.fromCharCode(code);
}

const rot13 = function(str){
    return [...str].map(v=>rot13Char(v)).join("");
}



console.log(rot13(rot13("abcdefghijklmnopqrstuvwxyz")))
console.log(rot13("rgp"));

