const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width = 500;
const height = canvas.height = 500;
document.body.appendChild(canvas);


const gridWidth = 50;
const gridHeight = 50;

// block types
// start x 1 (with possible goals)
// 1000
// goal (with ID 3 bits)
// 1001
// road <type:4> + <destination id:4> + direction bits
// 01xx
// road (occupied) <type:4> + <destination id:4> + direction bits
// 11xx
// null (all 0)
// 0000
//
const TYPE_BITS = 0b1111;

const DIRECTION = 0b11;

const START = 0b1000;
const GOAL = 0b1001;
const GOALID = 0b11110000;
const ROAD = 0b1100;
const EMPTY_ROAD = 0b0100;
const OCCUPIED_ROAD = 0b1100;

const CAR_MASK = 0b11111000;

const isRoad = function(cell){
    return isOccupiedRoad(cell) || isEmptyRoad(cell);
    //return cell & EMPTY_ROAD;
}
const isOccupiedRoad = function(cell){
    return (cell & OCCUPIED_ROAD) === OCCUPIED_ROAD;
}
const isEmptyRoad = function(cell){
    return (cell & OCCUPIED_ROAD) === EMPTY_ROAD;
}
const isStart = function(cell){
    return (cell & TYPE_BITS) === START;
}
const isGoal = function(cell){
    return (cell & TYPE_BITS) === GOAL;
}


const UP = 0b00; 0
const DOWN = 0b01; 2
const LEFT = 0b10; 1
const RIGHT = 0b11; 3

const toAnticlockwise = function(dir){
    //up left down right
    return (dir>>>1) | ((dir&1) << 1);
}

const flipDirection = function(dir){
    return dir^1;
}

const dirToDj = function(dir){
    // branchless mapping
    // UP 0
    // DOWN 0
    // LEFT -1
    // RIGHT 1
    return ((((dir&1)<<1) & (dir&0b10)) | (((~dir)>>>1)&1)) - 1;
}

const dirToDi = function(dir){
    // branchless mapping
    // UP -1
    // DOWN 1
    // LEFT 0
    // RIGHT 0
    return ((((dir&1)<<1) & ((~dir)&0b10)) | ((dir>>>1)&1)) - 1;
}

const dirToRelative = function(ref,dir){
    // backwards -> 0 0
    // forwards -> 1  2
    // left -> 2      1
    // right -> 3     3
    return ref^dir^(ref>>>1)^((~(ref|dir)>>>1)&1)
}
// test
// const FORWARDS = 1;
// const BACKWARDS = 0;
// 
// dirToRelative(LEFT,LEFT) === FORWARDS &&
// dirToRelative(RIGHT,RIGHT) === FORWARDS &&
// dirToRelative(UP,UP) === FORWARDS &&
// dirToRelative(DOWN,DOWN) === FORWARDS &&
// dirToRelative(LEFT,RIGHT) === BACKWARDS &&
// dirToRelative(RIGHT,LEFT) === BACKWARDS &&
// dirToRelative(UP,DOWN) === BACKWARDS &&
// dirToRelative(DOWN,UP) === BACKWARDS &&
// 
// dirToRelative(UP,LEFT) === LEFT &&
// dirToRelative(UP,RIGHT) === RIGHT &&
// dirToRelative(RIGHT,UP) === LEFT &&
// dirToRelative(RIGHT,DOWN) === RIGHT &&
// dirToRelative(DOWN,RIGHT) === LEFT &&
// dirToRelative(DOWN,LEFT) === RIGHT &&
// dirToRelative(LEFT,DOWN) === LEFT &&
// dirToRelative(LEFT,UP) === RIGHT;

const routeToAbsolute = function(ref,route){
    // LEFT -> LEFT => DOWN
    // LEFT -> FORWARDS => LEFT
    // LEFT -> RIGHT => UP
    // LEFT -> BACKWARDS => RIGHT
    return toAnticlockwise((toAnticlockwise(ref) - toAnticlockwise(route) + 6)%4);


    // Gave up branchless
    // // (ref, ans) => dir
    // // ((dir^ref)^1)^((~(ref)>>1)&1) === ans
    // // (dir^ref)^1 === ans^((~(ref)>>1)&1)
    // // (dir^ref) === ans^((~(ref)>>1)&1)^1
    // // dir === ans^((~(ref)>>1)&1)^1^ref
    // return route^((~(ref)>>1)&1)^1^ref
}

// test: should always be true
// for(let a = 0; a < 4; a++){
//     for(let b = 0; b < 4; b++){
//         console.log(routeToAbsolute(a,dirToRelative(a,b)) === b);
//     }
// }

const GOALID_LIMIT = 12;


const grid = new Int32Array(gridWidth * gridHeight);

const cw = width/gridWidth;
const ch = height/gridHeight;

const logBinary = function(n){
    let r = "";
    for(let i = 31; i >= 0; i--){
        r += ((n>>>i)&1);
    }
    return r;
}

const render = function(grid,gridWidth,gridHeight,ctx,width,height){
    ctx.clearRect(0,0,width,height);
    const cw = width/gridWidth;
    const ch = height/gridHeight;
    for(let i = 0; i < gridHeight; i++){
        for(let j = 0; j < gridWidth; j++){
            const val = grid[i*gridWidth+j];
            const type = val & TYPE_BITS
            if(type === 0)continue;
            if(type === START){
                ctx.fillStyle = "#0f0";
                ctx.fillRect(cw*j,ch*i,cw,ch);
            }else if(type === GOAL){
                ctx.fillStyle = "#f00";
                ctx.fillRect(cw*j,ch*i,cw,ch);
            }else if(isRoad(val)){// roads
                if(isEmptyRoad(val)){// roads (empty)
                    ctx.strokeStyle = "#000";
                    ctx.strokeRect(cw*j,ch*i,cw,ch);
                }else if(isOccupiedRoad(val)){// roads (occupied)
                    ctx.strokeStyle = "#fff";
                    ctx.fillStyle = "#000";
                    ctx.fillRect(cw*j,ch*i,cw,ch);
                }
                const direction = type & 0b11;
                const top = [cw*j+cw/2,ch*i+ch/4];
                const bot = [cw*j+cw/2,ch*i+ch*3/4];
                const lef = [cw*j+cw/4,ch*i+ch/2];
                const rig = [cw*j+cw*3/4,ch*i+ch/2];
                ctx.beginPath();
                if(direction & 0b10){// horizontal
                    ctx.moveTo(...lef);
                    ctx.lineTo(...rig);
                }else{// vertical
                    ctx.moveTo(...top);
                    ctx.lineTo(...bot);
                }
                ctx.stroke();
                ctx.beginPath();
                if(direction === UP || direction === LEFT){// top left corner
                    ctx.moveTo(...top);
                    ctx.lineTo(...lef);
                }else if(direction === DOWN || direction === RIGHT){// bottom right corner
                    ctx.moveTo(...bot);
                    ctx.lineTo(...rig);
                }
                ctx.stroke();
                ctx.beginPath();
                if(direction === UP || direction === RIGHT){// top right corner
                    ctx.moveTo(...top);
                    ctx.lineTo(...rig);
                }else if(direction === DOWN || direction === LEFT){// bottom left corner
                    ctx.moveTo(...bot);
                    ctx.lineTo(...lef);
                }
                ctx.stroke();
            }
        }
    }
};

const inputStates = {
    isMouseDown: false,
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    deltaX: 0,
    deltaY: 0,
    downX: 0,
    downY: 0,
    direction: 0,
    key: "",
    mousemove(x,y){
        if((x === this.x) && (y === this.y))return;
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = x;
        this.y = y;
        this.updateDelta();
    },
    mouseup(x,y){
        this.downX = x;
        this.downY = y;
        this.isMouseDown = false;
    },
    mousedown(x,y){
        this.downX = x;
        this.downY = y;
        this.lastX = x;
        this.lastY = y;
        this.x = x;
        this.y = y;
        this.isMouseDown = true;
        this.updateDelta();
    },
    updateDelta(){
        const dx = this.deltaX = this.x - this.lastX;
        const dy = this.deltaY = this.y - this.lastY;
        const mdx = Math.abs(dx);
        const mdy = Math.abs(dy);
        if(mdx > mdy){// left-right
            if(dx < 0){
                this.direction = LEFT;
            }else{
                this.direction = RIGHT;
            }
        }else{// up-down
            if(dy < 0){
                this.direction = UP;
            }else{
                this.direction = DOWN;
            }
        }
    }
};

canvas.addEventListener("mousedown",(e)=>{
    const x = e.clientX + window.scrollX - canvas.offsetLeft;
    const y = e.clientY + window.scrollY - canvas.offsetTop;
    inputStates.mousedown(x,y);
    onPaint();
});

window.addEventListener("mousemove",(e)=>{
    const x = e.clientX + window.scrollX - canvas.offsetLeft;
    const y = e.clientY + window.scrollY - canvas.offsetTop;
    inputStates.mousemove(x,y);
    if(inputStates.isMouseDown)onPaint();
});

window.addEventListener("mouseup",(e)=>{
    const x = e.clientX + window.scrollX - canvas.offsetLeft;
    const y = e.clientY + window.scrollY - canvas.offsetTop;
    inputStates.mouseup(x,y);
});

window.addEventListener("keydown",(e)=>{
    inputStates.key = e.key;
});

window.addEventListener("keyup",(_e)=>{
    inputStates.key = "";
});

// list of goal IDs
// 32 bits - 4 bits -> 28 bits available for tracking
// 14 possible goals
let goalStates = [];
for(let goalId = 0; goalId < GOALID_LIMIT; goalId++){
    goalStates.push({
        id: goalId,
        i: 0,
        j: 0,
        occupied: false,
    });
}


function onPaint(){
    const {x,y,key,direction} = inputStates;
    console.log(x,y,key,direction);
    const i = Math.floor(y/ch);
    const j = Math.floor(x/cw);
    const idx = i*gridWidth + j;
    const oldCell = grid[idx];
    let cell = 0;
    if(key === "s"){
        if(isStart(oldCell))return;
        cell |= START;
    }else if(key === "g"){
        if(isGoal(oldCell))return;
        cell |= GOAL;
        // assign a goal ID
        let assigned = false;
        for(let goalId = 0; goalId < GOALID_LIMIT; goalId++){
            const goal = goalStates[goalId];
            if(goal.occupied)continue;
            goal.occupied = true;
            goal.i = i;
            goal.j = j;
            cell |= goalId<<4;
            assigned = true;
            break;
        }
        if(assigned === false)return;
    }else if(key === "e"){
        // erace
        if(isGoal(oldCell)){
            const oldId = (oldCell & GOALID) >>> 4;
            // erace the registered goal
            goalStates[oldId].occupied = false;
        }
    }else{// road
        cell |= EMPTY_ROAD;
        cell |= direction;
        if(isRoad(oldCell) && ((oldCell & DIRECTION) === direction))return;
        if(isOccupiedRoad(oldCell)){
            cell |= OCCUPIED_ROAD;
        }
    }
    grid[idx] = cell;
    updateRoute();
    render(grid,gridWidth,gridHeight,ctx,width,height);
}

function updateRoute(){
    // reset the routes
    for(let idx = 0; idx < grid.length; idx++){
        grid[idx] &= 0b11111111;
    }

    // for each goals, null out directions and run breadth first floodfill
    // this has the same effect as running dijkstra
    for(let goal of goalStates){
        if(!goal.occupied)continue;
        const goalId = goal.id;
        let fillQueue = [[goal.i,goal.j]];
        while(fillQueue.length !== 0){
            const newFillQueue = [];
            for(let [i,j] of fillQueue){
                // connection values
                // 0: no connection 1: left, 2: right, 3: straight
                for(let dir = 0; dir < 4; dir++){// loop directions
                    const di = dirToDi(dir);
                    const dj = dirToDj(dir);
                    const i1 = i+di;
                    const j1 = j+dj;
                    if(i1 < 0 || i1 >= gridHeight || j1 < 0 || j1 >= gridWidth){
                        continue;
                    }
                    // check if the direction is compatible
                    const fdir = flipDirection(dir);
                    const nidx = i1*gridWidth+j1;
                    let neighbor = grid[nidx];

                    if(!isRoad(neighbor))continue;
                    const existingRoute = (neighbor >>> (goalId*2+8)) & 0b11;
                    if(existingRoute)continue;// already has a route
                    const route = dirToRelative(neighbor & DIRECTION, fdir);
                    // in the case that the route is backwards (forbidden), then it will be left as empty.
                    neighbor |= route << (goalId*2+8);
                    grid[nidx] = neighbor;
                    // there could be duplications, but it's max 4
                    // hopefully the overhead isn't too big to worry about
                    // we can experiment, if we have time
                    newFillQueue.push([i1,j1]);
                }
            }
            fillQueue = newFillQueue;
        }
    }
}


function step(){
    const moveQueue = [];
    for(let i = 0; i < gridHeight; i++){
        for(let j = 0; j < gridWidth; j++){
            const cell = grid[i*gridWidth+j];
            if(cell === 0)continue;
            if(isStart(cell)){
                if(Math.random() > 0.1)continue;
                const routeList = [];
                for(let dir = 0; dir < 4; dir++){// loop directions
                    const di = dirToDi(dir);
                    const dj = dirToDj(dir);
                    const i1 = i+di;
                    const j1 = j+dj;
                    if(i1 < 0 || i1 >= gridHeight || j1 < 0 || j1 >= gridWidth){
                        continue;
                    }
                    const neighbor = grid[i1*gridWidth + j1];
                    if(!isRoad(neighbor))continue;
                    // fill the bitmap iwth possible ids
                    for(let goalId = 0; goalId < GOALID_LIMIT; goalId++){
                        const route = (neighbor >>> (goalId*2+8)) & 0b11;
                        if(!route)continue;
                        routeList.push([i1,j1,goalId]);
                    }
                }
                if(routeList.length === 0)continue;
                const [i1,j1,goalId] = routeList[Math.floor(routeList.length*Math.random())];
                if(isOccupiedRoad(grid[i1*gridWidth + j1]))continue;
                moveQueue.push([i,j,i1,j1,goalId]);
            }else if(isOccupiedRoad(cell)){
                const cellDir = cell&0b11;
                const goalId = (cell>>>4)&0b1111;
                // check the possible moves
                const route = (cell >>> (goalId*2+8)) & 0b11;
                const dir = routeToAbsolute(cellDir,route);
                const di = dirToDi(dir);
                const dj = dirToDj(dir);
                const i1 = i+di;
                const j1 = j+dj;
                const candidate = grid[i1*gridWidth + j1];
                if(isEmptyRoad(candidate) || isGoal(candidate)){
                    moveQueue.push([i,j,i1,j1,goalId]);
                }else{
                    for(let route1 = 1; route1 < 4; route1++){
                        if(route1 === route)continue;
                        const dir = routeToAbsolute(cellDir,route1);
                        const di = dirToDi(dir);
                        const dj = dirToDj(dir);
                        const i1 = i+di;
                        const j1 = j+dj;
                        const candidate = grid[i1*gridWidth + j1];
                        if(!isEmptyRoad(candidate) && !isGoal(candidate))continue;
                        const route2 = (cell >>> (goalId*2+8)) & 0b11;
                        if(route2 === 0)continue;
                        //moveQueue.push([i,j,i1,j1,goalId]);
                        break;
                    }
                }
            }
        }
    }
    for(let [i,j,i1,j1,goalId] of moveQueue){
        let nextCell = grid[i1*gridWidth + j1];
        if(isOccupiedRoad(nextCell))continue;
        let oldCell = grid[i*gridWidth + j];
        if(isEmptyRoad(nextCell))nextCell |= OCCUPIED_ROAD | (goalId<<4);
        if(isOccupiedRoad(oldCell))oldCell &= ~CAR_MASK;
        grid[i1*gridWidth + j1] = nextCell;
        grid[i*gridWidth + j] = oldCell;
    }
}


const main = function(){
    step();
    render(grid,gridWidth,gridHeight,ctx,width,height);
    setTimeout(main,10);
}
main();

window.logBinary = logBinary;
window.grid = grid;

