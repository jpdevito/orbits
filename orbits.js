var sunImg = document.createElement("img");
sunImg.src = "images/sun.png";

var mercuryImg = document.createElement("img");
mercuryImg.src = "images/mercury.png";

var venusImg = document.createElement("img");
venusImg.src = "images/venus.png";

var earthImg = document.createElement("img");
earthImg.src = "images/earth.png";

var marsImg = document.createElement("img");
marsImg.src = "images/mars.png";

var jupiterImg = document.createElement("img");
jupiterImg.src = "images/jupiter.png";

var saturnImg = document.createElement("img");
saturnImg.src = "images/saturn.png";

var uranusImg = document.createElement("img");
uranusImg.src = "images/uranus.png";

var neptuneImg = document.createElement("img");
neptuneImg.src = "images/neptune.png";

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

    theSun = new sun(96, 96, sunImg);
    new planet("Mercury", 16, 16, mercuryImg, spacing*2, 0);
    new planet("Venus", 32, 32, venusImg, spacing*3, 0);
    earth = new planet("Earth", 32, 32, earthImg, spacing*4, 0);
    new planet("Mars", 24, 24, marsImg, spacing*5, 0);
    new planet("Jupiter", 80, 80, jupiterImg, spacing*7, 0);
    new planet("Saturn", 80, 80, saturnImg, spacing*9, 0);
    new planet("Uranus", 64, 64, uranusImg, spacing*11, 0);
    new planet("Neptune", 64, 64, neptuneImg, spacing*13, 0);

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
    this.x = (innerWidth)/2;
    this.y = (innerHeight)/2;
    this.img = img;
    ctx = area.context;  
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  

    this.update = function(){   
        ctx = area.context;  
        ctx.drawImage(this.img, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);  
    }
}  

// object for drawing planets
function planet(name, width, height, img, radius, angle) { 
    planets.push(this); 
    this.name = name
    this.width = width;  
    this.height = height;  
    this.radius = radius;
    this.mass = width * height;
    this.angle = angle; // angle counterclockwise from horizontal in radians
    this.angSpeed = getAngSpeed(radius); // angular speed of planet in rads / update
    this.img = img
    ctx = area.context;   
    ctx.drawImage(this.img, (innerWidth - this.width)/2 + this.radius, (innerHeight - this.height)/2, this.width, this.height);  

    this.update = function(){  
        this.angle += this.angSpeed; 
        xToDraw = (innerWidth - this.width)/2 + Math.cos(this.angle) * this.radius;
        yToDraw = (innerHeight - this.height)/2 - Math.sin(this.angle) * this.radius;

        ctx = area.context;   
        ctx.drawImage(this.img, xToDraw, yToDraw, this.width, this.height);  
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
    this.x = (innerWidth/2) + Math.cos(earth.angle) * earth.radius;
    this.y = (innerHeight/2) - Math.sin(earth.angle) * earth.radius;
    earthVel = earth.angSpeed * earth.radius // magnitude of Earth's velocity in pixels / update
    this.xVel = (-1 * earthVel * Math.sin(earth.angle)) + (this.launchVel * Math.cos(this.launchAngle)); // velocity in x direction (right is positive)
    this.yVel = (-1 * earthVel * Math.cos(earth.angle)) + (this.launchVel * Math.sin(this.launchAngle)); // velocity in y direction (down is positive)
    
    ctx = area.context;  
    ctx.fillStyle = "White";  
    ctx.fillRect(this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);  

    this.update = function() {
        xAccel = 0;
        yAccel = 0;

        // distance to the sun
        xDist = theSun.x - this.x
        yDist = theSun.y - this.y

        // accelerations from the sun, derived from Newton's formula for gravitational force
        mult = G * theSun.mass * Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), -1.5) // multiplier in formula used to find both accelerations
        xAccel += mult * xDist
        yAccel += mult * yDist

        // updates velocities from accelerations
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
        ctx.fillRect(this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);  
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
    radius = 30; // radius from Earth of arrow
    width = 5;
    height = 5;

    xEarth = (innerWidth - this.width)/2 + Math.cos(earth.angle) * earth.radius;
    yEarth = (innerHeight - this.height)/2 - Math.sin(earth.angle) * earth.radius;
    x = xEarth + Math.cos(launchAngle) * radius;
    y = yEarth + Math.sin(launchAngle) * radius;

    ctx = area.context;  
    ctx.fillStyle = "Red";  
    ctx.fillRect(x, y, width, height);  
}