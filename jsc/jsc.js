const input = `
AABCCCCCCCC
AABCCCCCCCC
AABCCCCCCCC
BABCDDDEEEE
BBBFDEEEEEE
GGGFDDDHHHH
GGGFFFDHIII
GGGGDDDHIJJ
GGGGKKKHIJJ
GGGGKGGHIJJ
GGGGGGGHIII
`.trim().split("\n");

let regions = new Map;
for(let i = 0; i < 11; i++){
    for(let j = 0; j < 11; j++){
        let c = input[i][j];
        let idx;
        let bucket;
        if(!(bucket = regions.get(c))){
            bucket = [];
            regions.set(c,bucket);
        }
        bucket.push([i,j]);
    }
}

regions = [...regions].map(([a,b])=>b);


const isIllegal = function(loc1,loc2){
    let dy = (loc1[0]-loc2[0]);
    let dx = (loc1[1]-loc2[1]);
    return dy*dy+dx*dx <= 2;
};

const searchRegions = function(regions,stars,index){
    if(index === regions.length){
        console.log(stars);
        return;
    }
    let region = regions[index];
    outer:
    for(let i = 0; i < region.length; i++){
        if(index === 0)console.log(i,stars);
        let loc = region[i];
        let ycnt = 0;
        let xcnt = 0;
        for(let star of stars){
            if(isIllegal(loc,star))continue outer;
            if(star[0] === loc[0])ycnt++;
            if(star[1] === loc[1])xcnt++;
            if(ycnt > 1 || xcnt > 1)continue outer;

        }
        stars.push(loc);

        inner:
        for(let j = i+1; j < region.length; j++){
            let loc = region[j];
            let ycnt = 0;
            let xcnt = 0;
            for(let star of stars){
                if(isIllegal(loc,star))continue inner;
                if(star[0] === loc[0])ycnt++;
                if(star[1] === loc[1])xcnt++;
                if(ycnt > 1 || xcnt > 1)continue inner;
            }
            stars.push(loc);
            searchRegions(regions,stars,index+1);
            if(stars.length === 22)return;
            stars.pop();
        }
        stars.pop();
    }
}

searchRegions(regions,[],0);




