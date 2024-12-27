import fs from "fs";

let table =`
A 	.-
B 	-...
C 	-.-.
D 	-..
E 	.
F 	..-.
G 	--.
H 	....
I 	..
J 	.---
K 	-.-
L 	.-..
M 	--
N 	-.
O 	---
P 	.--.
Q 	--.-
R 	.-.
S 	...
T 	-
U 	..-
V 	...-
W 	.--
X 	-..-
Y 	-.--
Z 	--..
0 	-----
1 	.----
2 	..---
3 	...--
4 	....-
5 	.....
6 	-....
7 	--...
8 	---..
9 	----.
. 	.-.-.-
, 	--..--
? 	..--..
= 	-...-
`;

table = table.trim().split("\n").map((l)=>{
    const [a,b] = l.split(/\s+/g);
    return [b,a];
});
table = new Map(table);
table.set("......."," ")
//console.log(table);


let res = fs.readFileSync("./challenge.txt").toString().trim().split(/\s+/g).map(v=>table.get(v)).join("");
res = res.split(" ").map(v=>String.fromCharCode(parseInt(v))).join("");
res = atob(res);


const rot13Char = function(cs){
    let c = cs.charCodeAt(0);
    let a = "a".charCodeAt(0);
    let z = "z".charCodeAt(0);
    let zz = z+1;
    let d = (zz-a)

    let code = a+((c-a)+13+d*10)%d;
    return String.fromCharCode(code);
}

const rot13 = function(str){
    return [...str].map(v=>rot13Char(v)).join("");
}

console.log(rot13(res));

// console.log([...res].map(v=>v.charCodeAt(0)));
// console.log([..."passwd"].map(v=>v.charCodeAt(0)));
// console.log(res);

