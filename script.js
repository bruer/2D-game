let ctx = document.getElementById('canvas').getContext('2d');

let kl = new keyListener();
let gamestate = 'dead';
let inAir = false;
let mario = null;
let objects = [];
let ground = null;
let numberOfObjects = 0;

newGame();

function newGame() {
    gamestate = 'running';
    blocks = [];
    objects = [
        mario = new Mario(),
        ground = new Ground(),
        new Goomba(140, 100),
        // new Goomba(280, 100),
        new Block(60, 70),
        new Block(200, 70),
        new Beer(260, 100)
    ];
    numberOfObjects = objects.length - 1;
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === 'block') {
            blocks.push(objects[i]);
        }
    }
    animate();
}

function animate() {
    ctx.clearRect(0, 0, 300, 200);
    for (let i = 0; i < objects.length; i++) {
        objects[i].move();
        objects[i].draw();
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
            objects = objects.slice(0, numberOfObjects);
            break;
        case 'dead':
            currentid = null;
            break;
        case 'paused':
            currentid = null;
            break;
        default:
            break;
    }
}

function collision(o1, o2) {
    if (o1.x <= o2.x + o2.width &&
        o1.x + o1.width >= o2.x &&
        o1.y <= o2.y + o2.height &&
        o1.y + o1.height >= o2.y) {
        return true;
    }
    else {
        return false;
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
                animate();
            }
        }
        else {
            switch (k) {
                case 'ARROWRIGHT':
                    if (mario.inAir()) {
                        mario.vmax = 3;
                    }
                    mario.vx = mario.vmax;
                    break;
                case 'ARROWLEFT':
                    if (mario.inAir()){
                        mario.vmax = 3;
                    }
                    mario.vx = mario.vmax * -1;
                    break;
                case 'ARROWDOWN':
                    // mario.vy = 1;
                    break;
                case 'ARROWUP':
                    // if (!mario.inAir()) {
                    //     mario.jump();
                    // }
                    break;
                case ' ':
                    if (!mario.inAir()) {
                        mario.jump();
                    }
                    break;
                case 'P':
                    gamestate = 'paused';
                    break;
                default:
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

function Ground() {
    this.x = 0;
    this.y = 120;
    this.width = 300;
    this.height = 30;
    this.color = 'green';
    this.name = 'ground';
    
    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {}
}

function Block(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 50;
    this.color = '#804848';
    this.name = 'block';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {}
}

function Beer(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = 'yellow';
    this.name = 'beer';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {}
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

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {
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

function Mario() {
    this.x = 20;
    this.y = 100;
    this.width = 20;
    this.height = 20;

    this.vx = 0;
    this.vy = 0;
    this.vmax = 2;
    this.g = 0;

    this.color = 'blue';
    this.name = 'mario';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {

        this.gforce();

        this.y += this.vy;

        if (this.x >= 0) {
            this.x += this.vx;
        }
        else {
            this.x = 0;
        }
        
        if (this.y + this.height < ground.y) {
            this.vy += this.g;
        }
        else {
            this.y = ground.y - this.height;
        }

        this.blockCollision();
        this.otherCollision();
    }

    this.gforce = function() {
        this.g = 0.5;
    }

    this.jump = function() {
        this.vy = -10;
    }

    this.feets = function() {
        return this.y + this.height;
    }

    this.widthRight = function() {
        return this.x + this.width;
    }

    this.widthLeft = function() {
        return this.x;
    }

    this.collision = function() {
        let os = objects.slice(1, objects.length);
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
            if (this.widthRight() <= b.x + this.vmax) {
                this.x = b.x - this.width;
            }
            if (this.widthLeft() >= b.x + b.width - this.vmax) {
                this.x = b.x + b.width;
            }
            if (this.widthRight() > b.x + this.vmax && 
            this.widthLeft() < b.x + b.width - this.vmax) {
                this.g = 0;
                this.vy = 0;
                this.y = b.y - this.height - this.vy;
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

    this.inAir = function() {
        if (this.collision().length > 0) { return false; }
        else { return true; }
    }

    this.onGround = function() {
        if (this.collision().length > 0) { return true; }
        else { return false; }
    }

    this.drunk = function() {
        this.color = 'cyan';
        this.vmax = 5;
    }
}