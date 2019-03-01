let ctx = document.getElementById('canvas').getContext('2d');

let grd = new Ground(), 
m = new Mario(30, 100), 
g = new Goomba(80, 100), 
b = new Beer(130, 100), 
blk = new Block(180, 70),
objects = [grd, m, g, b, blk],
kl = new keyListener(),
gamestate = 'dead';

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
    this.vx = 0;
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
    this.vy = 0;
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

function keyListener() {
    this.keyDown = function(e) {
        let k = e.key;
        switch (k) {
            case 'ArrowRight':
                m.vx = 1;
                break;
            case 'ArrowLeft':
                m.vx = -1;
                break;
            case 'ArrowDown':
                m.vy = 1;
                break;
            case 'ArrowUp':
                m.vy = -1;
                break;
            default:
                break;
        }
    }
    this.keyUp = function() {
        m.vx = 0;
        m.vy = 0;
    }
}

function animate() {
    ctx.clearRect(0, 0, 300, 200);
    for (let i = 0; i < objects.length; i++) {
        objects[i].move();
        objects[i].draw();
        // console.log(objects[i]);
    }
    switch (gamestate) {
        case 'running':
            currentid = requestAnimationFrame(animate);
            break;
        case 'dead':
            currentid = null;
            break;
        default:
            break;
    }
    console.log(gamestate);
}