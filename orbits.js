var sunImg;
var mercuryImg;
var venusImg;
var earthImg;
var marsImg;
var jupiterImg;
var saturnImg;
var uranusImg;
var neptuneImg;

var G; // gravitational constant (can adjust) in units of pixels^3 * pixelmass ^(-1) * updates^(-2)
// pixels = unit of length
// pixelmass = unit of mass (one square pixel, in this program volume = mass)
// updates = unit of time
var usePlanetGrav;
var useCollisions;
var innerWidth;
var innerHeight;
var spacing;
var planets;
var rockets;
var rocketCounter;
var launchVel;
var launchAngle;

function start() {  
    innerWidth = window.innerWidth
    innerHeight = window.innerHeight
    spacing = innerWidth / 30 // spacing between planets
    planets = []; // array to keep track of planets
    rockets = {}; // dictionary to keep track of rockets
    rocketCounter = 0; // to give each rocket unique ID
    launchAngle = 0; // gets incremeneted in update function

    // can be changed
    G = 0.02;
    usePlanetGrav = true;
    useCollisions = true;
    planetScale = 4;
    launchVel = 1;

    loadImages();
    area.start();  

    theSun = new sun(24*planetScale, 24*planetScale, sunImg);
    new planet("Mercury", 4*planetScale, 4*planetScale, mercuryImg, spacing*2, 0);
    new planet("Venus", 8*planetScale, 8*planetScale, venusImg, spacing*3, 0);
    earth = new planet("Earth", 8*planetScale, 8*planetScale, earthImg, spacing*4, 0);
    new planet("Mars", 6*planetScale, 6*planetScale, marsImg, spacing*5, 0);
    new planet("Jupiter", 20*planetScale, 20*planetScale, jupiterImg, spacing*7, 0);
    new planet("Saturn", 20*planetScale, 20*planetScale, saturnImg, spacing*9, 0);
    new planet("Uranus", 16*planetScale, 16*planetScale, uranusImg, spacing*11, 0);
    new planet("Neptune", 16*planetScale, 16*planetScale, neptuneImg, spacing*13, 0);

    this.interval = setInterval(update, 20);  

    // creates new rocket when spacebar pressed
    document.addEventListener('keydown', function(e) {
        if(e.which == 32) {
            new rocket(launchVel, launchAngle);
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
    this.x = (innerWidth/2) + Math.cos(this.angle) * this.radius;
    this.y = (innerHeight/2) - Math.sin(this.angle) * this.radius;
    this.img = img
    ctx = area.context;   
    ctx.drawImage(this.img, (innerWidth - this.width)/2 + this.radius, (innerHeight - this.height)/2, this.width, this.height);  

    this.update = function(){  
        this.angle += this.angSpeed; 
        this.x = (innerWidth/2) + Math.cos(this.angle) * this.radius;
        this.y = (innerHeight/2) - Math.sin(this.angle) * this.radius;

        ctx = area.context;   
        ctx.drawImage(this.img, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);  
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
    launchRadius = 8*planetScale; // radius from Earth that the rockets start from
    this.x = earth.x + Math.cos(launchAngle) * launchRadius;
    this.y = earth.y + Math.sin(launchAngle) * launchRadius;
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
        xDist = theSun.x - this.x;
        yDist = theSun.y - this.y;

        // accelerations from the sun, derived from Newton's formula for gravitational force
        mult = G * theSun.mass * Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), -1.5); // multiplier in formula used to find both accelerations
        xAccel += mult * xDist;
        yAccel += mult * yDist;
        
        if(usePlanetGrav) {
            for (p of planets) {
                // distance to each planet
                xDist = p.x - this.x;
                yDist = p.y - this.y;
                
                // accelerations from each planet
                mult = G * p.mass * Math.pow(Math.pow(xDist, 2) + Math.pow(yDist, 2), -1.5); // multiplier in formula used to find both accelerations
                xAccel += mult * xDist;
                yAccel += mult * yDist;
            }
        }

        // updates velocities from accelerations
        this.xVel += xAccel;
        this.yVel += yAccel;

        // updates position from velocities
        this.x += this.xVel;
        this.y += this.yVel;

        // if off canvas, remove from dictionary
        if(this.x < 0 || this.x > innerWidth || this.y < 0 || this.y > innerHeight) {
            delete rockets[this.id];
        }

        if(useCollisions) {
            //if colliding with the sun, remove from dictionary
            if(Math.abs(theSun.x - this.x) < theSun.width/2 && Math.abs(theSun.y - this.y) < theSun.height/2) {
                delete rockets[this.id];
            }

            // if colliding with a planet, remove from dictionary
            for (p of planets) {
                if(Math.abs(p.x - this.x) < p.width/2 && Math.abs(p.y - this.y) < p.height/2) {
                    delete rockets[this.id];
                }
            }
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
    radius = 8*planetScale; // radius from Earth of arrow
    width = 5;
    height = 5;

    xToDraw = earth.x - (this.width/2) + Math.cos(launchAngle) * radius;
    yToDraw = earth.y - (this.height/2) + Math.sin(launchAngle) * radius;

    ctx = area.context;  
    ctx.fillStyle = "Red";  
    ctx.fillRect(xToDraw, yToDraw, width, height);  
}

function loadImages() {
    sunImg = document.createElement("img");
    sunImg.src = "images/sun.png";

    mercuryImg = document.createElement("img");
    mercuryImg.src = "images/mercury.png";

    venusImg = document.createElement("img");
    venusImg.src = "images/venus.png";

    earthImg = document.createElement("img");
    earthImg.src = "images/earth.png";

    marsImg = document.createElement("img");
    marsImg.src = "images/mars.png";

    jupiterImg = document.createElement("img");
    jupiterImg.src = "images/jupiter.png";

    saturnImg = document.createElement("img");
    saturnImg.src = "images/saturn.png";

    uranusImg = document.createElement("img");
    uranusImg.src = "images/uranus.png";

    neptuneImg = document.createElement("img");
    neptuneImg.src = "images/neptune.png";
}