//Skickar ett request till serven för att se om personen är inloggad.
$.post("../php/server.php", {isLoggedIn: true}, function(response){
        var array = JSON.parse(response);
        //Om inte inloggad skickas man till startsidan
        if(!array.isLoggedIn){
            window.location.href = "index.html";
        }
    });

$(document).ready(function(){
    
    var questionCount = 2; //används för att sätta ett id på frågan
    
    $("#addQ").click(function(event){
        event.preventDefault();
        //Bygger en html string som blir en ny fråga och sätter namnen på input med ett id 
        var newQuestion = "<div class='questionBox extraQ'>"
                + "<span class='label'>Question "+ questionCount + "</span>"
                + "<textarea name='question["+questionCount +"]'></textarea>"
                + "<span class='label'>Correct Answer</span>"
                + "<input type='text' name='correctAnswer["+ questionCount +"]'>"
                + "<span class='label'>Wrong Answer</span>"
                + "<input type='text' name='answer1[" + questionCount +"]'>"
                + "<span class='label'>Wrong Answer</span>"
                + "<input type='text' name='answer2["+ questionCount +"]'>"
                + "<span class='label'>Wrong Answer</span>"
                + "<input type='text' name='answer3["+ questionCount +"]'>"
                + "</div>"
        $("#questionContainer").append(newQuestion);
        questionCount++;
    });
    $("#createQuiz").click(function(event){
        event.preventDefault();
        if(CheckInput()){
            //Bygger en array med frågorna
            var values =  BuildArray();
            //Skickar quizet till serven
            $.post('../php/server.php', {insert: JSON.stringify(values)});
            ClearFields();
        }
        else{
            alert("Please enter every field");
        }
    });
    
    function ClearFields(){
        $(".extraQ").remove();
        $("input[type^=text], textarea").val('');
    }
    //Skapar en associerande array
    function BuildArray(){
        //skapa en serializeArray av alla fieldsen
        var dataArray = $("form").serializeArray(),
        len = dataArray.length,
        dataObj = {};
        for (i=0, y = 0; i<len; i++) {
            //associerar namnet med värdet
            dataObj[dataArray[i].name] = dataArray[i].value;
        }
        return dataObj;
    }
    //Kollar ifall alla fieldsen är ifyllda
    function CheckInput(){
        var correct = true;
        $("input, textarea").each(function(){
            if($(this).val().length === 0){
                correct = false;
            }
        });
        return correct;
    }
});


