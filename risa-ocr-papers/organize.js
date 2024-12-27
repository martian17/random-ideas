const fs = require("fs");
const { execSync } = require('child_process');

const res = fs.readdirSync(".");
console.log(res);

let files = res.filter(r=>r.slice(-4) === "jpeg");
console.log(files);

const normalize = function(f){
    f = f.replace(/\s/g,"");
    f = f.slice(0,-5)
    if(!f.match(/\(/)){
        f += "(0)";
    }
    f = f.replace(/\(.+\)/,(match)=>{
        let n = parseInt(match.slice(1,-1));
        return `${n+1}`;
    });
    return f;
}

//files = files.map(v=>normalize(v));

files = files.sort((f1,f2)=>{
    return normalize(f1) < normalize(f2) ? -1 : 1;
});

for(let i = 0; i < files.length; i++){
    const fname = ("000"+i).slice(-4);
    fs.renameSync("./"+files[i],`./${fname}.jpg`);
    //console.log(i);
    //execSync(`tesseract -l eng ./${i}.jpg ./${i}`);
}


//console.log(files);

