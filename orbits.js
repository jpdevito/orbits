var sunImg;
var mercuryImg;
var venusImg;
var earthImg;
var marsImg;
var jupiterImg;
var saturnImg;
var uranusImg;
var neptuneImg;
var rocketImg;

var G; // gravitational constant (can adjust) in units of pixels^3 * pixelmass ^(-1) * updates^(-2)
// pixels = unit of length
// pixelmass = unit of mass (one square pixel before scaling, in this program volume = mass)
// updates = unit of time
var usePlanetGrav;
var useCollisions;
var innerWidth;
var innerHeight;
var spacing;
var planetScale;
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
    G = document.getElementById("gravConst").value;
    usePlanetGrav = document.getElementById("gravPlanets").checked;
    useCollisions = document.getElementById("collisions").checked;
    planetScale = document.getElementById("planetScale").value;
    launchVel = document.getElementById("launchVel").value;

    loadImages();
    area.start();  

    theSun = new sun(24, 24, sunImg);
    new planet("Mercury", 4, 4, mercuryImg, spacing*2, 0);
    new planet("Venus", 8, 8, venusImg, spacing*3, 0);
    earth = new planet("Earth", 8, 8, earthImg, spacing*4, 0);
    new planet("Mars", 6, 6, marsImg, spacing*5, 0);
    new planet("Jupiter", 20, 20, jupiterImg, spacing*7, 0);
    new planet("Saturn", 20, 20, saturnImg, spacing*9, 0);
    new planet("Uranus", 16, 16, uranusImg, spacing*11, 0);
    new planet("Neptune", 16, 16, neptuneImg, spacing*13, 0);

    this.interval = setInterval(update, 20);  

    // creates new rocket when spacebar pressed
    document.addEventListener("keydown", function(e) {
        if(e.which == 32) {
            new rocket(launchAngle);
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
function sun(widthFactor, heightFactor, img) {  
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
    this.width = this.widthFactor * planetScale;  
    this.height = this.heightFactor * planetScale;  
    this.mass = this.width * this.height;
    this.x = (innerWidth)/2;
    this.y = (innerHeight)/2;
    this.img = img;
    ctx = area.context;  
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);  

    this.update = function(){   
        // updates scale
        this.width = this.widthFactor * planetScale;  
        this.height = this.heightFactor * planetScale; 

        ctx = area.context;  
        ctx.drawImage(this.img, this.x - (this.width/2), this.y - (this.height/2), this.width, this.height);  
    }
}  

// object for drawing planets
function planet(name, widthFactor, heightFactor, img, radius, angle) { 
    planets.push(this); 
    this.name = name;
    this.widthFactor = widthFactor;
    this.heightFactor = heightFactor;
    this.width = this.widthFactor * planetScale;  
    this.height = this.heightFactor * planetScale;  
    this.radius = radius;
    this.mass = this.width * this.height;
    this.angle = angle; // angle counterclockwise from horizontal in radians
    this.angSpeed = getAngSpeed(radius); // angular speed of planet in rads / update
    this.x = (innerWidth/2) + Math.cos(this.angle) * this.radius;
    this.y = (innerHeight/2) - Math.sin(this.angle) * this.radius;
    this.img = img
    ctx = area.context;   
    ctx.drawImage(this.img, (innerWidth - this.width)/2 + this.radius, (innerHeight - this.height)/2, this.width, this.height);  

    this.update = function(){  
        // updates speed (from changes in G)
        this.angSpeed = getAngSpeed(this.radius);

        // updates scale
        this.width = this.widthFactor * planetScale;  
        this.height = this.heightFactor * planetScale;         

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
function rocket(launchAngle) {
    rocketCounter++;
    this.id = rocketCounter;
    rockets[this.id] = this;
    this.width = 16;
    this.height = 16;
    this.launchVel = launchVel;
    this.launchAngle = launchAngle;
    launchRadius = 32; // radius from Earth that the rockets start from
    this.x = earth.x + Math.cos(this.launchAngle) * launchRadius;
    this.y = earth.y + Math.sin(this.launchAngle) * launchRadius;
    this.img = rocketImg;
    earthVel = earth.angSpeed * earth.radius // magnitude of Earth's velocity in pixels / update
    this.xVel = (-1 * earthVel * Math.sin(earth.angle)) + (this.launchVel * Math.cos(this.launchAngle)); // velocity in x direction (right is positive)
    this.yVel = (-1 * earthVel * Math.cos(earth.angle)) + (this.launchVel * Math.sin(this.launchAngle)); // velocity in y direction (down is positive)
    
    ctx = area.context;    

    // changes ctx so rockets are drawn at an angle
    ctx = area.context;  
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.launchAngle + (Math.PI/2));
    ctx.drawImage(this.img, -(this.width/2), -(this.height/2), this.width, this.height);  
    ctx.restore();
    console.log(this.x)  

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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.launchAngle + (Math.PI/2));
        ctx.drawImage(this.img, -(this.width/2), -(this.height/2), this.width, this.height);  
        ctx.restore();
        console.log(this.x)
    }
}

// controls how the page updates each cycle
function update() {
    // update values from inputs
    G = document.getElementById("gravConst").value;
    usePlanetGrav = document.getElementById("gravPlanets").checked;
    useCollisions = document.getElementById("collisions").checked;
    planetScale = document.getElementById("planetScale").value;
    launchVel = document.getElementById("launchVel").value;

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

    rocketImg = document.createElement("img");
    rocketImg.src = "images/rocket.png";
}