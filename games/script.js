
var musikMuted = false;



$(document).ready(function () {

    
    $("#audio").click(function () {
        if (!musikMuted) {
            $("#audio").attr("src", "../icons/mute.png");
            $("#audio").css("background-color", "var(--color1)");
            $("audio:first").trigger("pause");
            musikMuted = true;
        } else {
            $("#audio").attr("src", "../icons/lautsprechergefulltes-audio-tool.png");
            $("#audio").css("background-color", "");
            $("audio:first").trigger("play");
            musikMuted = false;
        }

    })

})