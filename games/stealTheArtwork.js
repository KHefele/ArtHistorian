var leinwandwidth = 600;
var leinwandheight = 480;

//Koordinaten Biene/Blume
var x = 0;
var y = 0;
var zielx = Math.floor(Math.random()*28)*20+20;
var ziely = 460;
var bewegung = 10;

var siegpunkte = 0;

var spielzeit = 45;
var restzeit = 0;
var startzeit = new Date();

var gegnerpositionen = [1, 10, 60, 100, 150, 296]; 
var gegnerbewegung = [2, 3, -2, 4, 5, -3];

var arrowdown = false;
var arrowup = false;
var arrowleft = false;
var arrowright = false;

var play = true;



$(document).ready(function() {
    takt = window.setInterval(taktung, 100);

    //Spielbrett
    var spielbrett = document.getElementById('leinwand');
    spielfeld = spielbrett.getContext('2d');

    var grundriss = new Image();
    grundriss.src = "images/grundrissGrey.png";

    var leinwandX = $("#leinwand").offset().left;
    var leinwandY = $("#leinwand").offset().top;
    console.log("X: " + leinwandX + "Y: " + leinwandY);

    var unsichtbareLeinwand = document.createElement('canvas');
    unsichtbareLeinwand.style.position = "absolute";
    unsichtbareLeinwand.style.left = (leinwandX + 10) + "px"; //10 wg. Border
    unsichtbareLeinwand.style.top = (leinwandY) + "px";
    var unsichtbarerContext = unsichtbareLeinwand.getContext('2d');

    unsichtbarerContext.drawImage(grundriss, 0, 0);
    document.body.appendChild(unsichtbareLeinwand);
    //return unsichtbarerContext.getImageData(x, y, 1, 1).data;

    //Figuren
    var spielfigur = new Image();
    spielfigur.src ='images/dieb.png';

    var zielfeld = new Image();
    zielfeld.src='images/canvas.png';

    var police = new Image();
    police.src = 'images/police-hat.png';



    //Kollision von Figur und Ziel
    function zielfelderreicht() {
	
		if(x==zielx && y==ziely) {
			// Ziel erreicht!
			console.log("Ziel erreicht!");
            
            // neues Ziel erzeugen
			if (ziely==(leinwandheight-20)) {
				ziely = 0;
			}
			else {
				ziely=(leinwandheight-20);
			}
            zielx = Math.floor(Math.random()*28)*20+20;
            siegpunkte++;
            $("#punktestand").html("&nbsp; Punkte: " + siegpunkte)
		}
	}
    
    //Spielende
    function spielende() {
		clearInterval(takt);
        $('#endpunktestand').text('Punktestand: ' + siegpunkte);
        $('#spielendeanzeige:nth-child(0)').css( "background-color: green" );
        var sieg = (siegpunkte >= 5); 
        if (sieg){
            
            
        }
        $('#spielendeanzeige').show();
	}

    //Gegner
    function setzeGegner() {
        for (nr = 0; nr < gegnerpositionen.length; nr++) {
            gegnerpositionen[nr] += gegnerbewegung[nr] * 5;
            if (gegnerpositionen[nr] > 580 || gegnerpositionen[nr] < 0) {
                gegnerbewegung[nr] *= -1;
            }
            spielfeld.drawImage(police, gegnerpositionen[nr], 360-(nr*40), 20, 20);
        }
    }
    function kollisionspruefungGegner() {
        for (nr = 0; nr < gegnerpositionen.length; nr++) {
            var ygeg = 360-(nr*40);
            if (Math.abs(x - gegnerpositionen[nr]) < 20 && y == ygeg ) {
                // Zusammenstoß
                kollisionGegner();
            }
        }
    }
    function kollisionGegner() {
        clearInterval(takt);
        $('#gameover').show();
    }
    function kollisionspruefungWand() {
        console.log("x: " + x);
        console.log("y: " + y);
        var imgData = grundriss.getImageData(x, y, 20, 20);
        console.log(imgData);
        // if ( Math.abs(x - gegnerpositionen[nr]) < 20 && y == ygeg ) {
        //     // Zusammenstoß
        //     console.log("Zusammenstoß");
        //     console.log( Math.abs(x - gegnerpositionen[nr]) );
        //     console.log( " | y: "+ y );
        //     console.log( " | y: "+ ygeg  + " berechnet ");
        // }
    }

    //Taktung
    function taktung() {
        spielfeld.clearRect(0, 0, leinwandwidth, leinwandheight);
        spielfeld.drawImage(grundriss,0,0,leinwandwidth, leinwandheight)
        spielfeld.drawImage(spielfigur,x,y,20,20); 
        spielfeld.drawImage(zielfeld, zielx, ziely,20,20);
        zielfelderreicht();
        setzeGegner();
        kollisionspruefungGegner();

        var aktuellezeit = new Date();
        restzeit = spielzeit - Math.floor((aktuellezeit.getTime()-startzeit.getTime()) / 1000);
        $('#spielzeit').html('&nbsp; Spielzeit: ' + restzeit);
        if (restzeit <= 0) {
            spielende();
        }
    }

	$(document).bind('keydown', function (evt) {
		console.log(evt.keyCode);
		switch (evt.keyCode) {
			// Pfeiltaste nach unten
			case 40:
                y += bewegung;    
                if (y >= leinwandheight-20){
                    y = leinwandheight-20;
                } 
                kollisionspruefungWand();
				return false;
            // Pfeiltaste nach oben
            case 38:
                y -= bewegung;
                if (y <= 0){
                    y = 0;
                } 
                return false;
            // Pfeiltaste nach links
            case 37:
                x -= bewegung;
                if (x <= 0){
                    x = 0;
                } 
                return false;
            //Pfeiltaste nach rechts
            case 39:
                x += bewegung;
                if (x >= leinwandwidth-20){
                    x = leinwandwidth-20;
                }
                return false;
		}		
    });



    $("#stop").click(function() {
        if (play){
            clearInterval(takt);
            $("#stop").attr('src', "icons/wiedergabetaste.png");
            $("#stop").css("background-color", "var(--color1)");
            play = false;
        } else {
            takt = window.setInterval(taktung, 100);
            $("#stop").attr('src', "icons/pause-button.png");
            $("#stop").css("background-color", "");
            play = true;
        }
        
    });
    
});