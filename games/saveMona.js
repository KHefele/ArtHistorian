var leinwandwidth;
var leinwandheight;
const taktungszeit = 30;

var mouseOverBox = -1;
var mouseOverFly = false; 
var hearts = 2;


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
    }

    update(){
        this.lifetime += taktungszeit;

        if (this.lifetime <= this.movetime){
            
            this.position[0] += this.xSchrittlänge;
            this.position[1] += this.ySchrittlänge;   
        } else {
            this.position[0] = this.end[0];
            this.position[1] = this.end[1];
        }
        context.drawImage(this.flyimage,this.position[0],this.position[1],this.size,this.size); 
        
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
        }
        context.drawImage(this.smokerimage,this.positionX,300,150,150); 
        
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

    var smokerimg = new Image();
    smokerimg.src="../images/smoker.png";
    var smoker1 = new Smoker(0, 200, smokerimg);

    var photographerImg = new Image();
    photographerImg.src="../images/photographer.png";
    var photographer1 = new Photographer(800, 400, photographerImg);

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


    function zufallszahl(min, max){
        return (Math.random() * (max - min)) + min;
    }

    function imgWithOutline(img, posX, posY, size){
        context.beginPath();
        context.lineWidth = "6";
        context.strokeStyle = "#FFCE4B";
        context.rect(posX, posY, size, size);
        context.stroke();

        context.drawImage(img, posX+5, posY+5, size-10, size-10);
    }



    //DRAG & DROP

    function getMousePos(evt) {
        
        //Entfernung der canvas vom Rand muss noch abgezogen werden
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left-10, //10 wg. padding
            y: evt.clientY - rect.top-10,
          };

    };

    var mousePos; 
    canvas.addEventListener('mousemove', function(evt) {

        //check if mouse in Box
        mousePos = getMousePos(evt);
        // console.log(mousePos)
        if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 10-3 && mousePos.y <= 70+3){ //3 wg. Rahmendicke
            console.log("in der Box!");

            //CURSOR ÄNDERN
            mouseOverBox = 0;
        } else if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 80-3 && mousePos.y <= 140+3){
            console.log("in der Box 1!")
            mouseOverBox = 1;
        } else if (mousePos.x >= 530-3 && mousePos.x <= 590+3 && mousePos.y >= 150-3 && mousePos.y <= 210+3){
            console.log("in der Box 2!")
            mouseOverBox = 2;
        } else {
            mouseOverBox = -1;
        }
        
    }, false);


    var dragObject = null;
    
    document.onmousedown = function (event) {
        if (mouseOverBox == 0) {
            dragObject = netImg;
            console.log("auf Netz geklickt");
            //if (dragParent != null) { dragParent.style.transition = "none"; }
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
            }
        }
        dragObject = null;
        
        
    }

    var count = 0;
    //Taktung
    takt = window.setInterval(taktung, taktungszeit);
    function taktung() {
        count++;
        context.clearRect(0, 0, leinwandwidth, leinwandheight);
        context.drawImage(monaImg,200,100,200,200);
        context.drawImage(airConditioning,10,40,100,100); 

        context.fillText("20° 50%", 50, 84);

        var heartsx = 10;
        for (var i = 0; i<=hearts; i++){
            context.drawImage(heartImg,heartsx,10,20,20); 
            heartsx += 20;  
        }
        
        imgWithOutline(netImg, 530, 10, 60);
        imgWithOutline(watergunImg, 530, 80, 60);
        imgWithOutline(bucketImg, 530, 150, 60);
        imgWithOutline(toolsImg, 530, 220, 60);

        //Flies
        for (var x = 0; x < flyArray.length; x++){
            flyArray[x].update();
            if (flyArray[x].hoverWithNet(dragObject, netImg, mousePos.x, mousePos.y)){
                flyArray[x].flyimage = flyImgRed;
                // flyArray[x].size = 35;
                //flyArray[x].position[0] -= 20;
            } else {
                flyArray[x].flyimage = flyImg;
                // flyArray[x].size = 20;
            }
        }
        if (count%200==0){
            var fliege3 = new Fly([zufallszahl(0, leinwandwidth),zufallszahl(0, leinwandheight)], [zufallszahl(120,260), zufallszahl(120,260)], zufallszahl(1000,4000), flyImg, 35);
            flyArray.push(fliege3);  
        }

        smoker1.update();
        photographer1.update();

        if (dragObject != null){
            context.drawImage(dragObject, mousePos.x-25, mousePos.y-25, 50, 50);
        }
          
    }




});