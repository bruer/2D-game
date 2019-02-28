let ctx = document.getElementById('canvas').getContext('2d');

function Ground() {
    this.x = 0;
    this.y = 120;
    this.w = 300;
    this.h = 30;
    this.color = 'green';
    
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.move = function() {}
}

function Mario(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.vx = 1;
    this.vy = 0;
    this.color = 'blue';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

function Goomba(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.vx = 0;
    this.vy = -1;
    this.color = 'red';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

function Beer(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = 'yellow';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.move = function() {}
}

function Block(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 50;
    this.color = '#804848';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.move = function() {}
}

let grd = new Ground();

let m = new Mario(30, 100);
// m.draw();

let g = new Goomba(80, 100);
// g.draw();

let b = new Beer(130, 100);
// b.draw();

let blk = new Block(180, 70);
// blk.draw();

let objects = [grd, m, g, b, blk];
console.log(objects);

function animate() {
    ctx.clearRect(0, 0, 300, 200);
    // draw(objects);
    // move(m);
    // move(g);
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        objects[i].move();
        // console.log(objects[i]);
    }
    // let currentid = requestAnimationFrame(animate);
}

animate();