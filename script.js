let ctx = document.getElementById('canvas').getContext('2d');

let kl = new keyListener();
let gamestate = 'dead'; 
let mario = null;
let objects = [];

function newGame() {
    gamestate = 'running';
    blocks = [];
    goombas = [];
    objects = [
        mario = new Mario(),
        new Ground(),
        new Beer(0, 0),
        new Goomba(120, 100),
        new Goomba(280, 100),
        new Block(50, 70),
        new Block(200, 70)
    ];
    
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === 'block') {
            blocks.push(objects[i]);
        }
        if (objects[i].name === 'goomba') {
            goombas.push(objects[i]);
        }
    }
    console.log(goombas);
    animate();
}

function keyListener() {
    this.keyDown = function(e) {
        let k = (e.key).toUpperCase();
        switch (gamestate) {
            case 'dead':
                if (k === 'ENTER') {
                    newGame();
                }
                break;
            case 'paused':
                if (k === 'P') {
                    gamestate = 'running';
                    animate();
                }
                break;
            case 'running':
                switch (k) {
                    case 'ARROWRIGHT':
                        mario.vx = 1;
                        break;
                    case 'ARROWLEFT':
                        mario.vx = -1;
                        break;
                    case 'ARROWDOWN':
                        mario.vy = 1;
                        break;
                    case 'ARROWUP':
                        mario.vy = -1;
                        break;
                    case 'P':
                        gamestate = 'paused';
                        break;
                    default:
                        break;
            }
            default:
                console.log(k);
                break;
        }
        // console.log(e.key);
        // console.log(gamestate);
    }
    this.keyUp = function() {
        if (gamestate === 'running') {
            mario.vx = 0;
            mario.vy = 0;
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

function Mario() {
    this.x = 20;
    this.y = 100;
    this.width = 20;
    this.height = 20;
    this.vx = 0;
    this.vy = 0;
    this.color = 'blue';
    this.name = 'mario';

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
    }
    this.collision = function() {
        collision()
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

    this.draw = function() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.move = function() {
        this.x += this.vx;
        this.y += this.vy;
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

function marioCollision() {
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name !== 'mario' && collision(mario, objects[i])) {
            switch (objects[i].name) {
                case 'ground':
                    mario.y = objects[i].y - mario.height;
                    break;
                case 'block':
                    if (mario.x + mario.width <= objects[i].x + 1 &&
                        mario.y + mario.height > objects[i].y) {
                            mario.x = objects[i].x - mario.width;
                        }
                    else if (mario.y + mario.height >= objects[i].y &&
                        mario.x < objects[i].x + objects[i].width - 1) {
                            mario.y = objects[i].y - mario.height;
                        }
                    else {
                        mario.x = objects[i].x + objects[i].width;
                    }
                    break;
                case 'goomba':
                    gamestate = 'dead';
                    break;
                case 'beer':
                    gamestate = 'drunk';
                    break;
                default:
                    break;
            }
        }
    }
}

function goombaCollision() {
    for (let i = 0; i < goombas.length; i++) {
        for (let j = 0; j < blocks.length; j++) {
            if (collision(goombas[i], blocks[j])) {
                goombas[i].vx *= -1;
            }
        }
    }
}

function checkGamestate() {
    switch (gamestate) {
        case 'running':
            currentid = requestAnimationFrame(animate);
            break;
        case 'drunk':
            currentid = requestAnimationFrame(animate);
            mario.color = 'cyan';
            mario.x += mario.vx;
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

function animate() {
    ctx.clearRect(0, 0, 300, 200);
    for (let i = 0; i < objects.length; i++) {
        objects[i].move();
        objects[i].draw();
    }
    checkGamestate();
    marioCollision();
    goombaCollision();
}