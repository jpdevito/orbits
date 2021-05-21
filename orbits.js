var innerWidth = window.innerWidth
var innerHeight = window.innerHeight


var spacing = innerHeight / 15 // spacing between planets

var sunImg = document.createElement("img");
sunImg.src = "sun.png";

function start() {  
    area.start();  
    theSun = new sun(50, 50, "orange", innerWidth/2, innerHeight/2);
    mercury = new planet(20, 20, "gray", innerWidth/2, innerHeight/2 - spacing);
    venus = new planet(20, 20, "beige", innerWidth/2, innerHeight/2 - spacing*2);

    this.interval = setInterval(update, 20);  
}  
  
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

function sun(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    ctx = area.context;  
    ctx.fillStyle = color;  
    ctx.drawImage(sunImg, this.x, this.y, this.width, this.height);  

    this.update = function(){   
        ctx = area.context;  
        ctx.drawImage(sunImg, this.x, this.y, this.width, this.height);  
    }
}  
  
function planet(width, height, color, x, y) {  
    this.width = width;  
    this.height = height;  
    this.x = x;  
    this.y = y;
    this.movingLeft = true;
    ctx = area.context;  
    ctx.fillStyle = color;  
    ctx.fillRect(this.x, this.y, this.width, this.height);  

    this.update = function(){   
        if(this.x < innerWidth / 3) {
            this.movingLeft = false
        }
        if(this.x > 2 * innerWidth / 3) {
            this.movingLeft = true
        }

        if (this.movingLeft == true) {
            this.x = this.x - 1;
        }
        else {
            this.x = this.x + 1
        }

        ctx = area.context;  
        ctx.fillStyle = color;  
        ctx.fillRect(this.x, this.y, this.width, this.height);  
    }
}  

function update() {
    area.clear()
    theSun.update()
    mercury.update()
    venus.update()
}