let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let bgm = document.getElementById('music');

function playMusic() {
    bgm.play();
}

function pauseMusic() {
    bgm.pause();
}

let kl = new keyListener();
let gamestate = 'DEAD';
let mario = null;
let ground = null;
let objects = [];

// Ny spelrunda

function newGame() {

    gamestate = 'RUNNING';

    playMusic();

    // Initiera en array för block-objekt som används av Goomba-objekten för
    // upptäcka en kollision med ett block
    blocks = [];

    //Bygger upp en bana genom att skapa spel-objekt i en array
    objects = [

        // Objektet som spelaren har kontrollen över
        mario = new Mario(130, 120, 20, 20),

        // Marken som banan är uppbyggd på
        ground = new Ground(),
        
        // Block som "flyter" i luften
        new Block(200, 90, 100, 20), 
        new Block(500, 50, 100, 20),
        new Block(850, 90, 100, 20),

        // Block som är på marken
        new Block(400, 90, 40, 50),
        new Block(660, 90, 40, 50),
        new Block(1100, 90, 40, 50),

        // Fiender
        // new Goomba(350, 120),
        new Goomba(550, 120),
        new Goomba(970, 120),

        // Öl som gör spelaren full
        new Beer(890, 70)
    ];

    // Fyll listan för block med block-objekten
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === 'block') {
            blocks.push(objects[i]);
        }
    }
    animate();
}

// Metoden som anger vad som ska hända varje gång canvasen blir uppdaterad

function animate() {

    // Sudda ut bilden på canvasen för att kunna skapa en ny bild
    ctx.clearRect(0, 0, canvas.width, 200);

    // Rita upp och uppdatera varje objekts position
    for (let i = 0; i < objects.length; i++) {
        objects[i].draw();
        objects[i].move();
    }
    checkGamestate();
}

// Metod för att kontrollera om gamestate-variabeln har ändrats

function checkGamestate() {

    // Om spelet är igång målas en ny bild upp vid varje skärmuppdatering.
    // Detta sker med hjälp av requestAnimationFrame som hela tiden loopar
    // animate-metoden.
    let currentid = requestAnimationFrame(animate);

    switch (gamestate) {

        // Om spelaren är död stoppas animations-loopen
        case 'DEAD':
            cancelAnimationFrame(currentid);
            console.log(gamestate);
            alert('YOU DIED (press enter to continue)');
            break;

        // Om spelet är pausat stoppas animations-loopen
        case 'PAUSED':
            cancelAnimationFrame(currentid);
            break;
        
        // Om Mario är berusad anropas hans drunk-metod. För att inte flyga
        // utanför banan måste han befinna sig marken när metoden anropas.
        case 'DRUNK':
            if (mario.onGround()) {
                mario.drunk();
            }
            break;
        
        default:
            break;
    }
}

//-----------------------------------------------------------------------------
// INPUT FRÅN TANGENTBORD
//-----------------------------------------------------------------------------

// Objekt för att registrera tangentbords-input från spelaren
function keyListener() {

    this.keyDown = function(e) {
        
        // Gör identifieringssträngen som returneras vid en knappnedtryckning
        // till stora bokstäver (ifall exv. caps lock är aktiverat)
        let k = (e.key).toUpperCase();
        
        // Ifall spelaren är död och spelaren trycker på enter, så startas
        // en ny spelrunda
        if (gamestate === 'DEAD' && k === 'ENTER') {
            newGame();
        }

        // Ifall spelet är pausat och spelaren trycker på P-knappen,
        // så startas spel-loopen på nytt
        else if (gamestate === 'PAUSED' && k === 'P') {
            gamestate = 'RUNNING';
            animate();
            playMusic();
            console.log(gamestate);
            alert('game unpaused');
        }

        // Ifall spelet är igång,
        // eller ifall spelet är igång och Mario är full...
        else if (gamestate === 'RUNNING' || gamestate === 'DRUNK') {
            
            switch (k) {

                // Om spelaren trycker på högerpil-tangenten tilldelas 
                // mario-objektets hastighet i vågrät riktning ett 
                // positivt värde och rör sig i höger riktning.
                case 'ARROWRIGHT':
                    mario.vx = mario.vmax;
                    break;

                // Om spelaren trycker på vänsterpil-tangenten 
                // tilldelas hastigheten ett negativt värde och
                // mario-objektet rör sig i vänster riktning.
                case 'ARROWLEFT':
                    mario.vx = mario.vmax * -1;
                    break;

                // Om spelaren trycker på mellanslags-tangenten och om
                // mario-objektet inte redan befinner sig i luften, 
                // tilldelas Mario hastighet i lodrät riktning
                // ett negativt värde och Mario hoppar upp i luften.
                case ' ':
                    if (mario.onGround()) {
                        mario.vy = -8;
                    }
                    break;

                // Om spelaren trycker på P-tangenten pausas spelet
                case 'P':
                    gamestate = 'PAUSED';
                    pauseMusic();
                    console.log(gamestate);
                    alert('game paused');
                    break;
                
                default:
                    break;
            }
        }
        else {
            console.log(gamestate);
        }
    }
    // Om spelaren släpper piltangterna som gör att Mario rör sig framåt och 
    // bakåt tilldelas hastigheten i vågrät riktning värdet 0 och Mario stannar
    this.keyUp = function() {
        mario.vx = 0;
    }
}

//-----------------------------------------------------------------------------
// GEMENSAMMA/GLOBALA METODER
//-----------------------------------------------------------------------------

// Metod som tar en lista och en sträng och returnerar en ny lista utan dom
// objekt vars namn matchar angivet strängvärde
function filterObject(os, s) {
    let fos = [];
    for (let i = 0; i < os.length; i ++) {
        if (os[i].name !== s) {
            fos.push(os[i]);
        }
    }
    return fos;
}

// Metod som inte används för tillfället. Den tar en lista och en sträng och 
// returnerar det objekt vars namn matchar angivet strängvärde

// function findObject(os, s) {
//     for (let i = 0; i < os.length; i++) {
//         if (os[i].name === s) {
//             return os[i];
//         }
//     }
// }


// Metod för att upptäcka en kollision mellan två objekt
function collision(o1, o2) {
    return o1.x <= o2.x + o2.width &&
           o1.x + o1.width >= o2.x &&
           o1.y <= o2.y + o2.height &&
           o1.y + o1.height >= o2.y;
}

// Metoder för spelets "kamera" - mario-objektets kamera har fasta värden och 
// står därför hela tiden stilla medan resten av objektens kameravärden rör sig
// i en riktning anpassad efter Mario. Detta ger illusionen att Mario rör sig
// mot övriga objekt, när det egentligen är tvärtom.

// Metoderna tar ett objekts koordinater och returnerar ett nytt värde som är 
// baserat på mario-objektets aktuella position.

// Metod för spelets kamera i vågrät riktning
function cameraX(x) {
    return x - mario.x + mario.cx;
}

// Metod för spelets kamera i lodrät riktning
function cameraY(y) {
    return y - mario.y + mario.cy;
}

// Gemensam metod för att rita upp alla objekt. Den tar värden för färg, 
// koordinater för var objektet ska ritas ut samt värden för bredd och höjd.
function draw(c, cx, cy, w, h) {
    ctx.fillStyle = c;
    ctx.fillRect(cx, cy, w, h);
}

//-----------------------------------------------------------------------------
// SPEL-OBJEKT
//-----------------------------------------------------------------------------

function Mario(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    
    // Hastighetsvariabler
    this.vx = 0;
    this.vy = 0;
    this.vmax = 3;

    // Gravitation
    this.g = 0.4;
    
    this.color = 'blue';
    this.name = 'mario';

    // Kameravariabler som tilldelas koordinatvärderna för objektets
    // startposition. Dessa värden är hela tiden statiska och anger var på 
    // bilden Mario ska visas. 
    this.cx = this.x;
    this.cy = this.y;

    // Metod för att rita objektet på canvasen
    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    // Metod för att uppdatera objektets position på canvasen
    this.move = function() {

        // Varje gång move-metoden anropas uppdateras objektets koordinater
        // med nya värden beroende av aktuell hastighet i x- eller y-led
        this.x += this.vx;
        this.y += this.vy;

        // Om objektet befinner sig i luften kommer gravitionsvärdet adderas
        // till hastigheten i y-led vilket gör så att objektet rör sig nedåt
        // (canvasens y-axel går uppifrån och nedåt)
        this.vy += this.g;

        // Metoder för att upptäcka kollisoner
        this.levelEdgeCollision();
        this.groundCollision();
        this.blockCollision();
        this.otherCollision();
    }

    // Hindrar objektet att hamna utanför banans start- och slutområde
    this.levelEdgeCollision = function() {
        if (this.x < 130) {
            this.x = 130;
        }
        if (this.x + this.width > 1140) {
            this.x = 1140 - this.width;
        }
    }

    // Hindrar objektet från att sjunka genom marken
    this.groundCollision = function() {
        if (this.y + this.height > ground.y) {
            this.vy = 0;
            this.y = ground.y - this.height;
        }
    }

    // Metod för att upptäcka kollisoner mellan Mario och övriga spel-objekt.
    // Först filtreras mario-objektet ut från listan med samtliga objekt,
    // sedan anropas den globala metoden för kollisioner på varje objekt i den
    // uppdaterade listan och mario-objektet. Om en kollision upptäcks läggs 
    // det aktuella objektet till i en ny lista som returneras.
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

    // Separat metod för att upptäcka en kollision med Mario och block, 
    // eftersom det är spelets mest komplexa typ av kollision med flest olika 
    // fall.
    this.blockCollision = function() {

        // Lista med dom objekt som Mario kolliderar med i nuvarande frame
        let cs = this.collision();

        let b = null;

        // Om något objekt i listan är av typen Block, tilldela en variabel 
        // detta objekt
        for (let i = 0; i < cs.length; i++) {
            if (cs[i].name === 'block') {
                b = cs[i];
            }
        }

        // Ifall en kollision med ett block har upptäckts...
        if (b !== null) {

            // Om Mario kolliderar med ett blocks vänsterkant blir hans 
            // position på x-axeln lika med blockets vänsterkants position, 
            // minus Marios bredd (annars hamnar han in,uti blocket).
            if (this.x + this.width <= b.x + this.vmax) {
                this.x = b.x - this.width;
            }

            // Om Mario kolliderar med blockets högerkant blir hans position
            // lika med positionen för blockets högerkant (blockets 
            // startposition plus blockets bredd).
            if (this.x >= b.x + b.width - this.vmax) {
                this.x = b.x + b.width;
            }

            // Om Mario befinner sig mellan vänster- och högerkant ska han 
            // hamna antigen under eller ovanför blocket, beroende på om
            // blocket hänger i luften eller står på marken.
            if (this.x + this.width > b.x + this.vmax && 
            this.x < b.x + b.width - this.vmax) {

                // Om Mario hoppar in i ett svävande block avbryts hoppet och 
                // hans position blir lika med blockets position på y-axeln 
                // plus blockets höjd (blockets underkant).
                if (this.y >= b.y) {
                    this.vy = 0;
                    this.y = b.y + b.height + 0.1;
                }

                // Annars om Mario befinner sig ovanför blocket avstannar hans
                // hastighet och hans position blir lika med blockets överkant.
                else {
                    this.vy = 0;
                    this.y = b.y - this.height;
                }
            }
        }
    }

    // Metod för kollisioner med övriga objekt (Goomba och Beer)
    this.otherCollision = function() {

        // Lista med dom objekt som Mario kolliderar med i nuvarande frame
        let cs = this.collision();
        
        for (let i = 0; i < cs.length; i ++) {
            
            switch (cs[i].name) {

                // Om Mario kolliderar med en fiende är spelet över
                case 'goomba':
                    gamestate = 'DEAD';
                    break;

                // Om Mario kolliderar med öl-objektet får spelet ett berusat 
                // tillstånd. Sedan tas ölen bort från listan med övriga objekt
                // genom att anropa filterObject-metoden och ölen är inte 
                // längre synlig.
                case 'beer':
                    gamestate = 'DRUNK';
                    objects = filterObject(objects, 'beer');
                    break;
                
                default:
                    break;
            }
        }
    }

    // Metod som returnerar om Mario befinner sig i luften eller inte. 
    // Den anropar Marios kollisions-metod som returnerar en lista med 
    // kollisioner. Om listan inte är tom, är Mario i kontakt med ett objekt 
    // och därmed befinner han sig inte i luften.
    this.onGround = function() {
        return this.collision().length > 0;  
    }

    // Metod för vad som ska hända när Mario blir full; han får en ny färg,
    // rör sig snabbare och börjar hoppa okontrollerat. 
    this.drunk = function() {
        this.color = 'cyan';
        this.vmax = 10;
        this.vy = -5;
    }
}

function Goomba(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.vx = -1; // Objektet rör sig i vänster riktning med en fast hastighet
    this.color = 'red';
    this.name = 'goomba';

    // Kamera-koordinater
    this.cx;
    this.cy;

    // Metod för att rita objektet på canvasen
    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    // Metod för hur objektet ska ritas upp på bilden. Objektets 
    // kameravariabler uppdateras hela tiden efter den fasta kamerean. Dessutom
    // uppdateras objektets position på x-axeln och om en kollision har 
    // uppstått.
    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
        
        this.x += this.vx;

        this.collision();
    }
    
    // Goomba har en egen metod för att upptäcka kollisioner. Det enda fallet
    // då det ska hända något är vid en kollision med ett block. Därför 
    // använder metoden listan med block-objekt (som skapas vid varje ny 
    // spelrunda) och anropar den gemensamma metoden för kollisioner på varje
    // block-objekt. Om en kollision uppstår börjar Goomban röra sig i motsatt
    // riktning. 
    this.collision = function() {
        for (let i = 0; i < blocks.length; i++) {
            if (collision(this, blocks[i])) {
                this.vx *= -1;
            }
        }
    }
}

function Ground() {
    this.x = 0;
    this.y = 140;
    this.width = canvas.width; // Marken ska vara lika bred som canvasen
    this.height = 60;
    this.color = 'seagreen';
    this.name = 'ground';

    // Kamera-koordinater
    this.cx;
    this.cy;

    // Metod för att rita objektet på canvasen
    this.draw = function() {
        draw(this.color, this.x, this.cy, this.width, this.height);
    }

    // Metod för hur objektet ska ritas upp på bilden. Om Mario hoppar ska
    // markens kamera anpassa sig efter Marios fasta kamera. För att uppdatera
    // markens bredd adderas Marios aktuella position till bredden vid varje
    // bildfrekvens.
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
    this.color = 'black';
    this.name = 'block';

    // Kamera-koordinater
    this.cx;
    this.cy;

    // Metod för att rita objektet på canvasen
    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    // Metod för hur objektet ska ritas upp på bilden. Objektets 
    // kameravariabler uppdateras hela tiden efter den fasta kamerean.
    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
    }
}

function Beer(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.color = 'yellow';
    this.name = 'beer';

    // Kamera-koordinater
    this.cx;
    this.cy;

    // Metod för att rita objektet på canvasen
    this.draw = function() {
        draw(this.color, this.cx, this.cy, this.width, this.height);
    }

    // Metod för hur objektet ska ritas upp på bilden. Objektets 
    // kameravariabler uppdateras hela tiden efter den fasta kamerean.
    this.move = function() {
        this.cx = cameraX(this.x);
        this.cy = cameraY(this.y);
    }
}