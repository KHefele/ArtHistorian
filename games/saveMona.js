var leinwandwidth;
var leinwandheight;
const taktungszeit = 30;

var mouseOverBox = -1;
var mouseOverFly = false; 


class Fly {
    constructor(start, end, movetime, flyimage) {
        this.end = end;
        this.movetime = movetime;
        this.flyimage = flyimage;

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
        context.drawImage(this.flyimage,this.position[0],this.position[1],20,20); 
        
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

$(document).ready(function() {

    //Spielbrett
    var canvas = document.getElementById('leinwand');
    leinwandwidth = canvas.width;
    leinwandheight = canvas.height;

    context = canvas.getContext('2d');

    var mona = new Image();
    mona.src = "../images/canvas.png";

    var flyimg = new Image();
    flyimg.src = "../images/fly.png";
    var flyArray = [];

    var smokerimg = new Image();
    smokerimg.src="../images/smoker.png";
    var smoker1 = new Smoker(0, 200, smokerimg);


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
            console.log("in der Box!")
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
        dragObject = null;
        
    }

    var count = 0;
    //Taktung
    takt = window.setInterval(taktung, taktungszeit);
    function taktung() {
        count++;
        context.clearRect(0, 0, leinwandwidth, leinwandheight);
        context.drawImage(mona,100,100,200,200); 
        context.drawImage(heartImg,10,10,20,20); 
        context.drawImage(heartImg,30,10,20,20); 
        context.drawImage(heartImg,50,10,20,20); 

        imgWithOutline(netImg, 530, 10, 60);
        imgWithOutline(watergunImg, 530, 80, 60);
        imgWithOutline(bucketImg, 530, 150, 60);


        for (var x = 0; x < flyArray.length; x++){
            flyArray[x].update();
        }
        if (count%200==0){
            var fliege3 = new Fly([zufallszahl(0, leinwandwidth),zufallszahl(0, leinwandheight)], [zufallszahl(120,260), zufallszahl(120,260)], zufallszahl(1000,4000), flyimg);
            flyArray.push(fliege3);  
        }

        smoker1.update();

        if (dragObject != null){
            context.drawImage(dragObject, mousePos.x-25, mousePos.y-25, 50, 50);
        }
          
    }




});