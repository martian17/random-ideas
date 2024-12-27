import express from "express";
const app = express();

app.get("/", (err,req,res,next)=>{
    console.log("handler 1");
    res.send("1");
},(req,res,next)=>{
    next();
},function(req,res){
    console.log("A");
    console.log([...arguments].slice(2));
    console.log(arguments[2]());
},(req,res)=>{
    console.log("B");
    //throw new Error("asdf");
    res.json(405);
},(err,req,res,next)=>{
    console.log("handler 2");
    res.send("2");
});

app.listen(3030);


