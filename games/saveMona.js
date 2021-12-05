var leinwandwidth;
var leinwandheight;
const taktungszeit = 110;


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
    var watergun = new Image();
    watergun.src="../images/wasserpistole.png";
    var bucket = new Image();
    bucket.src="../images/bucket.png";


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

    canvas.onmousemove=function( event ) {
        var msg = "Handler for .mousemove() called at ";
        msg += event.pageX + ", " + event.pageY;
        console.log( msg );
      };

    var count = 0;
    //Taktung
    takt = window.setInterval(taktung, taktungszeit);
    function taktung() {
        count++;
        context.clearRect(0, 0, leinwandwidth, leinwandheight);
        context.drawImage(mona,100,100,200,200); 

        imgWithOutline(netImg, 530, 10, 60);
        imgWithOutline(watergun, 530, 80, 60);
        imgWithOutline(bucket, 530, 150, 60);


        for (var x = 0; x < flyArray.length; x++){
            flyArray[x].update();
        }
        if (count%40==0){
            var fliege3 = new Fly([zufallszahl(0, leinwandwidth),zufallszahl(0, leinwandheight)], [zufallszahl(120,260), zufallszahl(120,260)], zufallszahl(1000,4000), flyimg);
            flyArray.push(fliege3);  
        }

        smoker1.update();

        
    }




});