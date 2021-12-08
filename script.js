$(document).ready(function() {


  $("#iconEmailFormular").click(function(){
    $("#emailFormular").css("display", "block");
  })

  $("#iconQuellenangabe").click(function(){
    $("#quellenangabe").css("display", "block");
  })

  $(window).click(function(event){
    if (event.target == document.getElementById("quellenangabe")){
      $("#quellenangabe").css("display", "none");
    }
    if (event.target == document.getElementById("emailFormular")){
      $("#emailFormular").css("display", "none");
    }
  })



  $("video").on("mouseover", function(event) {
    this.play();
  }).on('mouseout', function(event) {
    this.pause();
  });



})