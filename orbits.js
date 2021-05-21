var innerWidth = window.innerWidth
var innerHeight = window.innerHeight

var spacing = innerHeight / 10 // spacing between planets

var sunImg = document.createElement("img");
sunImg.src = "sun.png";

function start() {  
    area.start();  
    theSun = new sun(50, 50, "orange");
    mercury = new planet(20, 20, "gray", spacing);
    venus = new planet(20, 20, "beige", spacing*2);

    this.interval = setInterval(update, 20);  
}  

// canvas element
var area = {  
    canvas : document.createElement("canvas"),  
    start : function() {  
        this.canvas.width = innerWidth;  
        this.canvas.height = innerHeight;  
        this.context = this.canvas.getContext("2d");  
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);  
    },
    clear : function() {  
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  
    }  
} 

// object for drawing sun
function sun(width, height, color) {  
    this.width = width;  
    this.height = height;  
    this.x = (innerWidth - this.width)/2;
    this.y = (innerHeight - this.height)/2;
    ctx = area.context;  
    ctx.fillStyle = color;  
    ctx.drawImage(sunImg, this.x, this.y, this.width, this.height);  

    this.update = function(){   
        ctx = area.context;  
        ctx.drawImage(sunImg, this.x, this.y, this.width, this.height);  
    }
}  

// object for drawing planets
function planet(width, height, color, radius) {  
    this.width = width;  
    this.height = height;  
    this.radius = radius;
    this.angle = 0; // angle counterclockwise from horizontal in radians
    this.speed = getSpeed(radius); // angular speed of planet in rads / update
    ctx = area.context;  
    ctx.fillStyle = color;  
    ctx.fillRect((innerWidth - this.width)/2 + this.radius, (innerHeight - this.height)/2, this.width, this.height);  

    this.update = function(){  
        this.angle += this.speed; 
        x = (innerWidth - this.width)/2 + Math.cos(this.angle) * this.radius
        y = (innerHeight - this.height)/2 - Math.sin(this.angle) * this.radius

        ctx = area.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(x, y, this.width, this.height);  
    }
}  

// gets angular speed from radius
function getSpeed(r) {
    c = 150 // constant for adjusting speeds
    return c * 1/(r*r) // angular velocity obeys inverse square law
}

// controlles how the page updates each cycle
function update() {
    area.clear()
    theSun.update()
    mercury.update()
    venus.update()
}