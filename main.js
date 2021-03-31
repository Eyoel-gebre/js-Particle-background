var canvas = document.getElementById('canvasElement');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//mouse object
var mouse = {
    x: null,
    y: null,
    radius: (canvas.width/100)*(canvas.height/100)
}

window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
    }
)

window.addEventListener('resize',
    function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = (canvas.width/100)*(canvas.height/100);
    }
)

window.addEventListener('mouseout', 
    function(event){
        mouse.x = undefined;
        mouse.y = undefined;
    }
)


var particles = [];

//Class for particles
class Particle{
    constructor(x, y, vx, vy){
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy
    }
    //updates movement/mouse/collision/draws
    update(){
          //checks for collision with mouse and walls
         if(this.x < 0 || this.x > canvas.width){
             this.vx = -this.vx;
         }
         if(this.y < 0 || this.y > canvas.height){
             this.vy = -this.vy;
         }
       
         var distance = Math.sqrt((this.x - mouse.x)**2+(this.y - mouse.y)**2);
        
         if(distance < mouse.radius){
            if(mouse.x < this.x && this.x < canvas.width){
                this.x += 3;
            }
            if(mouse.y < this.y && this.y < canvas.height){
                this.y += 3;
            }
            if(mouse.x > this.x && this.x > 0){
                this.x -= 3;
            }
            if(mouse.y > this.y && this.y > 0){
                this.y -= 3;
            }
         }
         this.x += this.vx;
         this.y += this.vy;
         
         //draws particle
         ctx.strokeStyle = 'rgb(0,0,0,1)';
         ctx.beginPath();
         ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
         ctx.stroke();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//creates all the initial particles
function initializeParticles(){
    var numOfParticles = Math.round(canvas.width/150 * canvas.height/150 * 2);
    for(var i = 0; i<numOfParticles; i++){
        var x = getRandomInt(0, canvas.width);
        var y = getRandomInt(0, canvas.height);
        var vx = getRandomInt(-1, 1);
        var vy = getRandomInt(-1, 1);
        while(vx == 0 || vy == 0){
            var vx = getRandomInt(-1, 1);
            var vy = getRandomInt(-1, 1);
        }
        particles.push(new Particle(x,y,vx,vy))
    }
}

//animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < particles.length; i++){
        particles[i].update();
    }
    connect();
} 
//connects particles with line based off of distance
function connect(){
    var opacity = 1;
    for(var i = 0; i<particles.length; i++){
        for(var j = i + 1; j<particles.length; j++){
            var distance = Math.sqrt((particles[i].x-particles[j].x)**2+(particles[i].y-particles[j].y)**2);
            if(distance < 300){
                opacity = 1 - (distance/275);
                ctx.strokeStyle = 'rgb(0,0,0,'+opacity+')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}


initializeParticles();
animate();
