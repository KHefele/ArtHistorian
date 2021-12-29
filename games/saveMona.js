var leinwandwidth;
var leinwandheight;
const taktungszeit = 30;

var mouseOverBox = -1;
var mouseOverFly = false; 
var hearts = 2;
var temperature = 20;
var humidity = 50;

function zufallszahl(min, max){
    return (Math.random() * (max - min)) + min;
}

function clamp(number, min, max){
    if (number < min){
        number = min;
    } else if (number > max) {
        number = max;
    }
    return number;
}
class Fly {
    constructor(start, end, movetime, flyimage, size) {
        this.end = end;
        this.movetime = movetime;
        this.flyimage = flyimage;
        this.size = size;

        var percent = taktungszeit/this.movetime;
        this.xSchrittlänge = (end[0]-start[0])*percent;
        this.ySchrittlänge = (end[1]-start[1])*percent;

        this.position = start;
        this.lifetime = 0;

        this.angle = 0;
    }

    update(){
        this.lifetime += taktungszeit;

        if (this.lifetime <= this.movetime){
            
            this.position[0] += this.xSchrittlänge;
            this.position[1] += this.ySchrittlänge;   
        } else {
            this.position[0] = this.end[0];
            this.position[1] = this.end[1];

            this.lifetime = 0;
            this.movetime = 10000;

            this.end[0] = clamp(zufallszahl(-40,40)+this.position[0],220,360);
            this.end[1] = clamp(zufallszahl(-40,40)+this.position[1],120,260);
            this.xSchrittlänge = (this.end[0]-this.position[0])*(taktungszeit/this.movetime);
            this.ySchrittlänge = (this.end[1]-this.position[1])*(taktungszeit/this.movetime);

            this.position[0] += this.xSchrittlänge;
            this.position[1] += this.ySchrittlänge;  
        }
        this.angle = Math.atan2(this.ySchrittlänge, this.xSchrittlänge);
        drawRotatedImage(this.flyimage, this.position[0], this.position[1],this.size,this.size, this.angle+Math.PI/2);
        
    }

    hoverWithNet(currentDragObj, wantedDragObj, mouseX, mouseY){
        if (currentDragObj == wantedDragObj && mouseX >= this.position[0] && mouseX <= this.position[0]+this.size && mouseY >= this.position[1] && mouseY <= this.position[1]+this.size){
            return true;
        } else {
            return false;
        }
    }
}

class Smoker {
    constructor(startX, endX, smokerimage) {
        this.endX = endX;
        this.smokerimage = smokerimage;

        this.movetime = 3000;

        var percent = taktungszeit/this.movetime;
        this.xSchrittlänge = (endX-startX)*percent;

        this.positionX = startX;
        this.lifetime = 0;

    }

    update(){
        this.lifetime += taktungszeit;

        if (this.lifetime <= this.movetime){
            this.positionX += this.xSchrittlänge;   
        } else {
            this.positionX = this.endX;

            this.lifetime = 0;
            this.movetime = 5000;

            this.endX = clamp(zufallszahl(-100,100)+this.positionX,150,280);
            this.xSchrittlänge = (this.endX-this.positionX)*(taktungszeit/this.movetime);

            this.positionX += this.xSchrittlänge;
        }
        context.drawImage(this.smokerimage,this.positionX,300,150,175); 
        
    }

    hoverWithWatergun(currentDragObj, wantedDragObj, mouseX, mouseY){
        // console.log(currentDragObj);
        // console.log(wantedDragObj)
        if (currentDragObj == wantedDragObj && mouseX >= this.positionX && mouseX <= this.positionX+150){
            return true;
        } else {
            return false;
        }
    }
}

class Photographer {
    constructor(startX, endX, photographerimage) {
        this.endX = endX;
        this.photographerimage = photographerimage;

        this.movetime = 5000;

        var percent = taktungszeit/this.movetime;
        this.xSchrittlänge = (endX-startX)*percent;

        this.positionX = startX;
        this.lifetime = 0;

    }

    update(){
        this.lifetime += taktungszeit;

        if (this.lifetime <= this.movetime){
            this.positionX += this.xSchrittlänge;   
        } else {
            this.positionX = this.endX;
        }
        context.drawImage(this.photographerimage,this.positionX,300,150,150); 
        
    }
}

function imgWithOutline(img, posX, posY, size){
    context.beginPath();
    context.lineWidth = "6";
    context.strokeStyle = "#FFCE4B";
    context.rect(posX, posY, size, size);
    context.stroke();

    context.drawImage(img, posX+5, posY+5, size-10, size-10);
}
function drawLine(xStart, xEnd, yStart, yEnd, width, color){
    context.beginPath();
    context.moveTo(xStart, yStart);
    context.lineTo(xEnd, yEnd);
    context.strokeStyle = color;
    context.lineWidth = width;
    context.stroke();
}
function drawRotatedImage(image, x, y, xWidth, yWidth, angle){
    context.translate(x+xWidth/2, y+yWidth/2);
    context.rotate(angle);
    context.translate(-x-xWidth/2,-y-yWidth/2);
    context.drawImage(image,x,y,xWidth,yWidth);
    context.setTransform(1,0,0,1,0,0);
}


$(document).ready(function() {

    //Spielbrett
    var canvas = document.getElementById('leinwand');
    leinwandwidth = canvas.width;
    leinwandheight = canvas.height;

    context = canvas.getContext('2d');

    //Bilder
    var monaImg = new Image();
    monaImg.src = "../images/canvas.png";

    var flyImg = new Image();
    flyImg.src = "../images/fly.png";
    var flyImgRed = new Image();
    flyImgRed.src = "../images/flyRed.png";
    var flyArray = [];

    var smokerImg = new Image();
    smokerImg.src="../images/smoker.png";
    var smokerImgRed = new Image();
    smokerImgRed.src="../images/smokerRed.png";
    var noSmokerImg = new Image();
    noSmokerImg.src="../images/noSmoker.png";
    var smoker1 = new Smoker(0, 200, smokerImg);

    var photographerImg = new Image();
    photographerImg.src="../images/photographer.png";
    var photographer1 = new Photographer(800, 400, photographerImg);

    var carpetImg = new Image();
    carpetImg.src="../images/carpet.png";
    var barrierImg = new Image();
    barrierImg.src = "../images/barriere.png";

    var netImg = new Image();
    netImg.src="../images/net.png";
    var watergunImg = new Image();
    watergunImg.src="../images/wasserpistole.png";
    var crossHairImg = new Image();
    crossHairImg.src="../images/fadenkreuz.png";
    var bucketImg = new Image();
    bucketImg.src="../images/bucket.png";

    var heartImg = new Image();
    heartImg.src="../images/herz.png";

    var airConditioning = new Image();
    airConditioning.src="../images/klimaanlage.png";
    var toolsImg = new Image();
    toolsImg.src="../images/werkzeug.png";








    //DRAG & DROP

    function getMousePos(evt) {
        
        //Entfernung der canvas vom Rand muss noch abgezogen werden
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left-10, //10 wg. padding
            y: evt.clientY - rect.top-10,
          };

    };

    var mousePos = { x:0, y:0 }; 
    canvas.addEventListener('mousemove', function(evt) {

        //check if mouse in Box
        mousePos = getMousePos(evt);
        // console.log(mousePos)
        if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 10-3 && mousePos.y <= 70+3){ //3 wg. Rahmendicke
            //console.log("in der Box!");

            //CURSOR ÄNDERN
            mouseOverBox = 0;
        } else if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 80-3 && mousePos.y <= 140+3){
            //console.log("in der Box 1!")
            mouseOverBox = 1;
        } else if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 150-3 && mousePos.y <= 210+3){
            //  console.log("in der Box 2!")
            mouseOverBox = 2;
        } else {
            mouseOverBox = -1;
        }
        
    }, false);


    var dragObject = null;
    
    document.onmousedown = function (event) {
        if (mouseOverBox == 0) {
            dragObject = netImg;
            //console.log("auf Netz geklickt");
        } else if (mouseOverBox == 1) {
            dragObject = crossHairImg;
        } else if (mouseOverBox == 2) {
            dragObject = bucketImg;
        }
    }

    document.onmouseup = function (event) {
        //evt.stopImmediatePropagation();
        //if (dragParent != null) { dragParent.style.transition = null;}
        for (var x = 0; x < flyArray.length; x++){
            
            if (flyArray[x].hoverWithNet(dragObject, netImg, mousePos.x, mousePos.y)){
                flyArray.splice(x, 1);
                $("#swich").trigger("play");
            }
        }
        if (smoker1.hoverWithWatergun(dragObject, crossHairImg, mousePos.x, mousePos.y)){
            smoker1.smokerimage = noSmokerImg;
            $("#waterdrop").trigger("play");
            smoker1.positionX = -1000;
        }
        dragObject = null;
        
        
    }

    $("#coughing").trigger("play");
    var count = 0;
    //Taktung
    takt = window.setInterval(taktung, taktungszeit);
    function taktung() {
        count++;
        context.clearRect(0, 0, leinwandwidth, leinwandheight);

        
        drawLine(0, 600, 460, 460, "150","#e4e4e4"); //Boden
        


        
        context.drawImage(monaImg,200,100,200,200);
        context.drawImage(airConditioning,10,40,100,100); 
        context.drawImage(carpetImg,100,380,400, 122); 
        context.drawImage(barrierImg,140,270,160, 160); 
        context.drawImage(barrierImg,300,270,160, 160); 

        if (temperature == 20){
            drawLine(40, 95, 80, 80, "10", "#56A6E888"); //Air conditioning
        } else {
            drawLine(40, 95, 80, 80, "10", "#ff5448af");
        }
        
        

        
        context.fillStyle = "white";
        context.fillText(temperature + "° " + humidity + "%", 50, 84);
        

        var heartsx = 10;
        for (var i = 0; i<=hearts; i++){
            context.drawImage(heartImg,heartsx,10,20,20); 
            heartsx += 20;  
        }
        
        imgWithOutline(netImg, 530, 10, 60);
        imgWithOutline(watergunImg, 530, 80, 60);
        imgWithOutline(bucketImg, 530, 150, 60);
        imgWithOutline(toolsImg, 530, 220, 60);

        if (smoker1.hoverWithWatergun(dragObject, crossHairImg, mousePos.x, mousePos.y)){
            smoker1.smokerimage = smokerImgRed;
        }

        //Flies
        for (var f = 0; f < flyArray.length; f++){
            flyArray[f].update();
            if (flyArray[f].hoverWithNet(dragObject, netImg, mousePos.x, mousePos.y)){
                flyArray[f].flyimage = flyImgRed;
            } else {
                flyArray[f].flyimage = flyImg;
            }
        }
        if (count%200==0){
            var fliege3 = new Fly([zufallszahl(0, leinwandwidth),zufallszahl(0, leinwandheight)], [zufallszahl(220,360), zufallszahl(120,260)], zufallszahl(1000,4000), flyImg, 35);
            flyArray.push(fliege3);  
            $("#flyingFly").trigger("play");
        }

        console.log(flyArray[0].angleDegrees)

        smoker1.update();
        photographer1.update();

        if (dragObject != null){
            context.drawImage(dragObject, mousePos.x-25, mousePos.y-25, 50, 50);
        }
          
    }

    $('audio:first').prop("volume", 0.1);



});