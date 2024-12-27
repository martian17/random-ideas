const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const width = canvas.width = 500;
const height = canvas.height = 500;


const nodes = {
    a: {
        mass: 1,
        x: 0,
        y: 0,
        fixed: true
    },
    b: {
        mass: 1,
        x: 1,
        y: 0,
        fixed: false
    },
    c: {
        mass: 1,
        x: 2,
        y: 0,
        fixed: false
    }
};

const edges = "a_b b_c".split(" ").map(v=>v.split("_"));

// solve and generate a differential equation based on angles

// reduce the amount of variables based on the constraint?
// every edge has angle, but they are dependent







