const matrix = `
1
.89 1
.91 .92 1
.88 .93 .95 1
.84 .86 .92 .85 1
.88 .91 .95 .87 .85 1
.84 .88 .86 .87 .83 .82 1
`.trim().split("\n").map(v=>v.split(" ").map(v=>parseFloat(v)))

console.log(matrix);

const transpose = function(matrix){
    const bucket = [];
    for(let i = 0; i < matrix.length; i++){
        const row = matrix[i];
        for(let j = 0; j < row.length; j++){
            if(!bucket[j])bucket[j] = [];
            const r = bucket[j];
            r[i] = row[j];
        }
    }
    //return bucket.map(b=>b.filter(v=>v !== undefined));
    return bucket.map(b=>b.reverse().filter(v=>v !== undefined))
}

const avg = function(lst){
    let sum = 0;
    for(let val of lst){
        sum += val;
    }
    return sum/lst.length;
}

console.log(transpose(matrix));

for(let row of transpose(matrix)){
    row = row.slice(0,-1);
    console.log(avg(row));
}
 okay, okay did s



