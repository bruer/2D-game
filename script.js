let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let kl = new keyListener();
let gamestate = 'dead';
let mario = null;
let ground = null;
let objects = [];

function newGame() {
    gamestate = 'running';
    blocks = [];
    objects = [
        mario = new Mario(130, 120, 20, 20),
        ground = new Ground(140, 60),
        new Block(200, 90, 100, 20),
        new Block(500, 50, 100, 20),
        new Block(850, 90, 100, 20),
        new Block(400, 90, 40, 50),
        new Block(660, 90, 40, 50),
        new Block(1100, 90, 40, 50),
        new Goomba(350, 120),
        new Goomba(550, 120),
        new Goomba(970, 120),
        new Beer(890, 70),
    ];
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === 'block') {
            blocks.push(objects[i]);
        }
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, 200);
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        objects[i].move();
    }
    checkGamestate();
}

function checkGamestate() {
    switch (gamestate) {
        case 'running':
            currentid = requestAnimationFrame(animate);
            break;
        case 'drunk':
            currentid = requestAnimationFrame(animate);
            break;
        case 'dead':
            currentid = null;
            console.log(gamestate);
            alert('YOU DIED (press enter to continue)');
            break;
        case 'paused':
            currentid = null;
            break;
        default:
            break;
    }
}

function keyListener() {
    this.keyDown = function(e) {
        
        let k = (e.key).toUpperCase();

        if (gamestate === 'dead') {
            if (k === 'ENTER') {
                newGame();
            }
        }
        else if (gamestate === 'paused') {
            if (k === 'P') {
                gamestate = 'running';
                console.log(gamestate);
                alert('game unpaused');
                animate();
            }
        }
        else {
            switch (k) {
                case 'ARROWRIGHT':
                    mario.vx = mario.vmax;
                    break;
                case 'ARROWLEFT':
                    mario.vx = mario.vmax * -1;
                    break;
                case 'ARROWDOWN':
                    break;
                case 'ARROWUP':
                    break;
                case ' ':
                    if (mario.onGround()) {
                        mario.vy = -8;
                    }
                    break;
                case 'P':
                    gamestate = 'paused';
                    console.log(gamestate);
                    alert('game paused');
                    break;
                default:
                    console.log(k);
                    break;
            }
        }
    }
    this.keyUp = function() {
        if (gamestate === 'running' || gamestate === 'drunk') {
            mario.vx = 0;
        }
    }
}

function filterObject(os, s) {
    let fos = [];
    for (let i = 0; i < os.length; i ++) {
        if (os[i].name !== s) {
            fos.push(os[i]);
        }
    }
    return fos;
}

function findObject(os, s) {
    for (let i = 0; i < os.length; i++) {
        if (os[i].name === s) {
            return os[i];
        }
    }
}

function collision(o1, o2) {
    return o1.x <= o2.x + o2.width &&
           o1.x + o1.width >= o2.x &&
           o1.y <= o2.y + o2.height &&
           o1.y + o1.height >= o2.y;
}

function cameraX(x) {
    return x - mario.x + mario.cx;
}

function cameraY(y) {
    return y - mario.y + mario.cy;
}

function draw(c, cx, cy, w, h) {
    ctx.fillStyle = c;
    ctx.fillRect(cx, cy, w, h);
}

function Mario(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;

    this.vx = 0;
    this.vy = 0;
    this.vmax = 3;
    this.g = 0.4;
    
    this.color = 'blue';
    this.name = 'mario';

    this.cx = this.x;
    this.cy = this.y;

    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    this.move = function() {

        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.g; 

        this.levelEdgeCollision();
        this.groundCollision();
        this.blockCollision();
        this.otherCollision();
    }

    this.levelEdgeCollision = function() {
        if (this.x < 130) {
            this.x = 130;
        }
        if (this.x + this.width > 1140) {
            this.x = 1140 - this.width;
        }
    }

    this.groundCollision = function() {
        if (this.y + this.height > ground.y) {
            this.y = ground.y - this.height;
        }
    }

    this.collision = function() {
        let os = filterObject(objects, 'mario');
        let collisions = [];
        for (let i = 0; i < os.length; i++) {
            if (collision(this, os[i])) {
                collisions.push(os[i]);
            }
        }
        return collisions;
    }

    this.blockCollision = function() {
        let cs = this.collision();
        let b = null;
        for (let i = 0; i < cs.length; i++) {
            if (cs[i].name === 'block') {
                b = cs[i];
            }
        }
        if (b !== null) {
            if (this.x + this.width <= b.x + this.vmax) {
                this.x = b.x - this.width;
            }
            if (this.x >= b.x + b.width - this.vmax) {
                this.x = b.x + b.width;
            }
            if (this.x + this.width > b.x + this.vmax && 
            this.x < b.x + b.width - this.vmax) {
                if (this.y >= b.y) {
                    this.vy = 0;
                    this.y = b.y + b.height + 0.1;
                }
                else {
                    this.vy = 0;
                    this.y = b.y - this.height;
                }
            }
        }
    }

    this.otherCollision = function() {
        let cs = this.collision();
        for (let i = 0; i < cs.length; i ++) {
            switch (cs[i].name) {
                case 'goomba':
                    gamestate = 'dead';
                    break;
                case 'beer':
                    this.drunk();
                    gamestate = 'drunk';
                    break;
                default:
                    break;
            }
        }
    }

    this.onGround = function() {
        return this.collision().length > 0;  
    }

    this.drunk = function() {
        this.color = 'cyan';
        this.vmax = 10;
        objects = filterObject(objects, 'beer');
    }
}

function Ground(y, h) {
    this.x = 0;
    this.y = y;
    this.width = canvas.width;
    this.height = h;
    this.color = 'green';
    this.name = 'ground';

    this.cx;
    this.cy;

    this.draw = function() {
        draw(this.color, this.x, this.cy, this.width, this.height);
    }

    this.move = function() {
        this.cy = cameraY(this.y);
        this.width = canvas.width + mario.x;
    }
}

function Block(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.color = '#804848';
    this.name = 'block';

    this.cx;
    this.cy;

    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
    }
}

function Goomba(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.vx = -1;
    this.vy = 0;
    this.color = 'red';
    this.name = 'goomba';

    this.cx;
    this.cy;

    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
        
        this.x += this.vx;
        this.y += this.vy;
        this.collision();
    }
    
    this.collision = function() {
        for (let i = 0; i < blocks.length; i++) {
            if (collision(this, blocks[i])) {
                this.vx *= -1;
            }
        }
    }
}

function Beer(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = 'yellow';
    this.name = 'beer';

    this.cx;
    this.cy;

    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
    }
}