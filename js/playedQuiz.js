$(document).ready(function(){
    //Skapar ett EvenSource event med serverfilen som argument
    var source = new EventSource("../php/informationSender.php");
    //Lyssnar efter meddelanden från servern
    source.onmessage = function(e){
        //När ett meddelande kommit, sätt det meddelandet som text på #playedQuiz
        $("#playedQuiz").text("Total amount of played quizes: " + e.data);
    };
});


