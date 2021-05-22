var sunImg = document.createElement("img");
sunImg.src = "sun.png";

var G = 0.1; // gravitational constant (can adjust) in units of pixels^3 * pixelmass ^(-1) * updates^(-2)
// pixels = unit of length
// pixelmass = unit of mass (one square pixel, in this program volume = mass)
// updates = unit of time

var innerWidth;
var innerHeight;
var spacing;
var planets;
var rockets;
var rocketCounter;
var launchAngle;

function start() {  
    innerWidth = window.innerWidth
    innerHeight = window.innerHeight
    spacing = innerHeight / 15 // spacing between planets
    planets = []; // array to keep track of planets
    rockets = {}; // dictionary to keep track of rockets
    rocketCounter = 0;
    launchAngle = 0;

    area.start();  

    theSun = new sun(80, 80, sunImg);
    new planet("Mercury", 10, 10, "Gray", spacing*2, 0);
    new planet("Venus", 20, 20, "Beige", spacing*3, 0);
    earth = new planet("Earth", 20, 20, "DodgerBlue", spacing*4, 0);
    new planet("Mars", 15, 15, "Tomato", spacing*5, 0);
    new planet("Jupiter", 40, 40, "Orange", spacing*7, 0);
    new planet("Saturn", 40, 40, "Beige", spacing*8, 0);
    new planet("Uranus", 30, 30, "LightBlue", spacing*9, 0);
    new planet("Neptune", 30, 30, "CornflowerBlue", spacing*10, 0);

    this.interval = setInterval(update, 20);  

    // creates new rocket when spacebar pressed
    document.addEventListener('keydown', function(e) {
        if(e.which == 32) {
            new rocket(1, launchAngle);
        }
    })      
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
function sun(width, height, img) {  
    this.width = width;  
    this.height = height;  
    this.mass = width * height;
    this.x = (innerWidth - this.width)/2;
    this.y = (innerHeight - this.height)/2;
    this.img = img;
    ctx = area.context;  
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  

    this.update = function(){   
        ctx = area.context;  
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  
    }
}  

// object for drawing planets
function planet(name, width, height, color, radius, angle) { 
    planets.push(this); 
    this.name = name
    this.width = width;  
    this.height = height;  
    this.radius = radius;
    this.mass = width * height;
    this.angle = angle; // angle counterclockwise from horizontal in radians
    this.angSpeed = getAngSpeed(radius); // angular speed of planet in rads / update
    ctx = area.context;  
    ctx.fillStyle = color;  
    ctx.fillRect((innerWidth - this.width)/2 + this.radius, (innerHeight - this.height)/2, this.width, this.height);  

    this.update = function(){  
        this.angle += this.angSpeed; 
        x = (innerWidth - this.width)/2 + Math.cos(this.angle) * this.radius;
        y = (innerHeight - this.height)/2 - Math.sin(this.angle) * this.radius;

        ctx = area.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(x, y, this.width, this.height);  
    }
}  

// gets angular speed from radius
function getAngSpeed(r) {
    mu = G * theSun.mass; // standard gravitational parameter
    return Math.sqrt(mu) * (Math.pow(r, -1.5)); // derived angular velocity formula for circular orbit
}

// object for drawing rockets
function rocket(launchVel, launchAngle) {
    rocketCounter++;
    this.id = rocketCounter;
    rockets[this.id] = this;
    this.width = 10;
    this.height = 10;
    this.launchVel = launchVel;
    this.launchAngle = launchAngle;
    this.x = (innerWidth - this.width)/2 + Math.cos(earth.angle) * earth.radius;
    this.y = (innerHeight - this.height)/2 - Math.sin(earth.angle) * earth.radius;
    earthVel = earth.angSpeed * earth.radius // magnitude of Earth's velocity in pixels / update
    this.xVel = (-1 * earthVel * Math.sin(earth.angle)) + (this.launchVel * Math.cos(this.launchAngle)); // velocity in x direction (right is positive)
    this.yVel = (-1 * earthVel * Math.cos(earth.angle)) + (this.launchVel * Math.sin(this.launchAngle)); // velocity in y direction (down is positive)
    
    ctx = area.context;  
    ctx.fillStyle = "White";  
    ctx.fillRect(this.x, this.y, this.width, this.height);  

    this.update = function() {

        // distance to the sun
        xDist = theSun.x - this.x + (theSun.width/2) - (this.width/2)
        yDist = theSun.y - this.y + (theSun.height/2) - (this.height/2)

        // accelerations, derived from Newton's formula for gravitational force
        xAccel = G * theSun.mass * xDist * Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), -1.5)
        yAccel = G * theSun.mass * yDist * Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), -1.5)

        console.log(xAccel)
        console.log(yAccel)

        // updates velcities from accelerations
        this.xVel += xAccel
        this.yVel += yAccel

        // updates position from velocities
        this.x += this.xVel;
        this.y += this.yVel;

        // if off canvas, remove from dictionary
        if(this.x < 0 || this.x > innerWidth || this.y < 0 || this.y > innerHeight) {
            delete rockets[this.id];
        }
        
        ctx = area.context;  
        ctx.fillStyle = "White";  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}

// controls how the page updates each cycle
function update() {
    area.clear();
    theSun.update()
    for (p of planets) {
        p.update();
    }
    for (k in rockets) {
        rockets[k].update();
    }

    launchAngle += 0.02; // increases launch angle (units are rad / update
    drawArrow();
}

function drawArrow(){
    radius = 10; // radius from Earth of arrow
    width = 5;
    height = 5;

    xEarth = (innerWidth - this.width)/2 + Math.cos(earth.angle) * earth.radius;
    yEarth = (innerHeight - this.height)/2 - Math.sin(earth.angle) * earth.radius;
    x = xEarth + Math.cos(launchAngle) * radius;
    y = yEarth + Math.sin(launchAngle) * radius;

    ctx = area.context;  
    ctx.fillStyle = "White";  
    ctx.fillRect(x, y, width, height);  
}