let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// ctx.clearRect(0, 0, 300, 150);

ctx.fillStyle = 'blue';
ctx.fillRect(20, 90, 30, 30);

ctx.fillStyle = 'red';
ctx.fillRect(135, 90, 30, 30);

ctx.fillStyle = 'yellow';
ctx.fillRect(250, 90, 30, 30);

ctx.fillStyle = 'green';
ctx.fillRect(0, 120, 300, 30);

