import {promises as fs} from "fs";
import util from "util";
import {exec as exec_base} from "child_process";
const exec = util.promisify(exec_base);


const dirs = await fs.readdir(".");
for(let dir of dirs){
    if(!(await fs.stat(dir)).isDirectory())
        continue;
    let status = '';
    let allPushed = false;
    try{
        status = (await exec(`cd ${dir} && git status`)).stdout;
        //allPushed = (await exec(`cd ${dir} && git log --decorate`)).stdout
        //    .split("\n")[0];
    }catch(err){
        continue;
    }
    console.log(dir);
    /*console.log(dir);
    console.log("`"+status+"`");
    console.log(status === `On branch main
nothing to commit, working tree clean
`);*/
    // if un-commited, show
//     if(status !== `On branch main
// nothing to commit, working tree clean
// `)console.log(dir);

//     if(status === `On branch main
// nothing to commit, working tree clean
// ` && allPushed.match("HEAD -> main, origin/main"))
//     {
//         console.log(dir);
//         //console.log(allPushed);// && allPushed)console.log(dir);
//     }
}
//console.log(dirs);


//const {stdout, stderr} = await exec("ls");



