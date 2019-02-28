let ctx = document.getElementById('canvas').getContext('2d');

// ctx.fillStyle = 'green';
// ctx.fillRect(0, 120, 300, 30);

function draw(color, x, y, w, h) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function Ground() {
    this.x = 0;
    this.y = 120;
    this.w = 300;
    this.h = 30;
    this.color = 'green';
    
    this.draw = function() {
        draw(this.color, this.x, this.y, this.w, this.h);
    }
}

function Mario(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = 'blue';

    this.vx = 0;

    this.draw = function() {
        draw(this.color, this.x, this.y, this.w, this.h);
    }
    this.move = function() {
        this.x += this.vx;
    }
}

function Goomba(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = 'red';

    this.draw = function() {
        draw(this.color, this.x, this.y, this.w, this.h);
    }
}

function Beer(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 20;
    this.color = 'yellow';

    this.draw = function() {
        draw(this.color, this.x, this.y, this.w, this.h);
    }
}

function Block(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 50;
    this.color = '#804848';

    this.draw = function() {
        draw(this.color, this.x, this.y, this.w, this.h);
    }
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

function animate() {
    ctx.clearRect(0, 0, 300, 200);
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        // console.log(objects[i]);
        m.move();
    }
    // let currentid = requestAnimationFrame(animate);
}

animate();