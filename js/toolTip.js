$(document).ready(function(){
    
    /*
     * Den här tooltipen är inspirerad av:
     * http://www.alessioatzeni.com/blog/simple-tooltip-with-jquery-only-text/
     * 
     */
    //Variable för att spara titel
    var title;
    //hover event på class toolTip
    $(".toolTip").hover(function(){
        //sätter element attributet title i title variable
        title = $(this).attr("title");
        //tar bort title från elementet då den kan skapa konflikt med tooltip
        $(this).removeAttr("title");
        //Lägger till en paragraf med class tp och appendar title och gör .tp synlig
        $("<p class=\"tp\"></p>").text(title).appendTo("body").fadeIn(3000);
    }, function(){
        //sätter tillbaka title till attributet
        $(this).attr("title", title);
        //tar bort paragrafen med .tp classen
        $(".tp").remove();
        //event mousemove för att uppdatera tooltipens position sätt till att musen rör sig
    }).mousemove(function(e){
        var mouseY = e.pageY; //hämtar antal pixlar från browserfönstret från top till musen
        var mouseX = e.pageX; //hämtar antal pixlar från browserfönstret från vänster till musen
        //uppdaterar .tp css egenskaper med de nya kordinaterna
        $(".tp").css({left: mouseX, top: mouseY});
    });
});


