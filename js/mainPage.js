$(document).ready(function(){
    Initialize();
    var numCorrect;
    var clickedQuestions;
    var popUp;

    //När ett quiznamn är tryckt på i listan
    $("#quizes").on("click", "li", function(){
        var name = $(this).attr('value');
        InitializeValues();
        //ta bort gamla frågor om några
        $(".quizBox").remove();
        //Hämta quizet från servern och visa frågorna
        $.post("../php/server.php", {getQuiz: name}, function(response){
            ShowQuestions(JSON.parse(response));
        });
    });
    //Stänger popUpBox;
    $("#closeButton").click(function(){
        $("#popUpBox").css({display: "none"});
        Initialize();
    });
    //När ett svar trycks på
    $("#quizContainer").on("click", "li", function(){
        
        var quizBox = $(this).parent().parent();
        //om frågan inte blivit besvarad
        if(!quizBox.hasClass('clicked')){
            //Om frågan är det rätta svaret
            if($(this).attr("class") === "correctAnswer"){
                $(this).css({backgroundColor: "lightgreen"});
                numCorrect++;       
            }
            //annars sätt rött runt och visa det rätta svaret 
            else {
                $(this).css({backgroundColor: "red"});
                quizBox.find('.correctAnswer').css({background: "lightgreen"});               
            }
            //Sätt frågan som besvarad
            quizBox.addClass('clicked');
            clickedQuestions++;
        }
        else {
            console.log("doesn't have class");
        }
        //Kollar om alla frågor har besvarats
        if($(".quizBox").length === clickedQuestions){
            window.scroll(0,0);
            //Uppdatera hur många  quizPlayed på serven
            $.post("../php/server.php", {quizPlayed: 'true'});
            //Visa popUpBox om den inte redan syns
            if(!popUp){
                popUp = true;
                PopUpBox();
            }
        }
    });
    //Sätter upp sidan
    function Initialize(){
        InitializeValues();
        //tar bort frågorna om det finns några
        $(".quizBox").remove();
        //tar bort alla li i quizlistan
        $(".quizNames").remove();

        $("#quizName").text('');
        $("#quizCreaterName").text('');
        //Hämtar alla quizNamnen
        $.post("../php/server.php", {getNames: true}, function(response){
            //Placerar ut namnen i ul
            PopulateNames(JSON.parse(response));
           
        });
    }
    //Sätter upp default värden
    function InitializeValues(){
        numCorrect = 0;
        clickedQuestions = 0;
        popUp = false;
        $("#popUpBox").css({display: "none"});
        $("#popUpBox p").remove();
    }
    //Function som säger innehållet i PopUpbox och visar den
    function PopUpBox(){
        var str = "<p>You got: " + numCorrect + " correct answers out of " + $(".quizBox").length + "</p>";
        $("#popUpBox").append(str);
        $("#popUpBox").css({display: "inherit"});

        $("#popUpBox").animate({left: "20%"}, 5000);
        $("#popUpBox").animate({top: "20%"}, 5000);
        $("#popUpBox").animate({left: "70%"}, 5000);
        $("#popUpBox").animate({top: "70%"}, 5000);
        $("#popUpBox").animate({left: "50%"}, 5000);
        $("#popUpBox").animate({top: "50%"}, 5000);
        
    }
    //Placerar ut alla quiz namn i ul
    function PopulateNames(nameArray){
        //för varje index i nameArray
        for(var i = 0; i < nameArray.length; i++){
            var string = "<li class='quizNames' value='" + nameArray[i] +"'><a href='#'>" + nameArray[i] + "</a></li>";
            $("#quizList").append(string); //Lägg till string i ul
        } 
    }
    //Function som bygger upp och visar frågorna
    function ShowQuestions(questionArray) {
        //Skriver ut namnet på quizet
        $("#quizName").text(questionArray[0].QuizName);
        //Skriver ut skaparen av quizet
        $("#quizCreaterName").text("Created by: " + questionArray[0].User);
        //för varje fråga i quizet
        for(var i = 0; i < questionArray.length; i++){
            //skapa en html string av hela frågan
            var str = "<div class='quizBox'>"
                    +"<span class='questionNr'>"+ (i+1)+ "/" + questionArray.length +"</span>"
                    + "<p>" + questionArray[i].Question + "</p>"
                    + "<ul>";
            str += RandomizeAnswers(questionArray[i]);
            str += "</ul></div>";
            //Lägg till frågan i #quizContainer
            $("#quizContainer").append(str);
        }
    }
    //Bygger upp svaren slumpmässigt
    function RandomizeAnswers(array){
        //tar ett random nummer mellan 1-4
        var randomNum = Math.floor((Math.random() * 4) + 1);
        var str;
        
        //Beroende på vilken siffra som det blir hamnar det rätta svaret på olika positioner
        
        if(randomNum === 1){
            str = "<li class='correctAnswer'><p>" + array.CorrectAnswer + "</p></li>"
                    + "<li><p>" + array.Answer1 + "</p></li>"
                    + "<li><p>" + array.Answer2 + "</p></li>"
                    + "<li><p>" + array.Answer3 + "</p></li>";
        }
        else if(randomNum === 2){
            str = "<li><p>" + array.Answer1 + "</p></li>"
                    + "<li class='correctAnswer'><p>" + array.CorrectAnswer + "</p></li>"
                    + "<li><p>" + array.Answer2 + "</p></li>"
                    + "<li><p>" + array.Answer3 + "</p></li>";
        }
        else if(randomNum === 3){
            str = "<li><p>" + array.Answer2 + "</p></li>"
                    + "<li><p>" + array.Answer1 + "</p></li>"
                    + "<li class='correctAnswer'><p>" + array.CorrectAnswer + "</p></li>"
                    + "<li><p>" + array.Answer3 + "</p></li>";
        }
        else {
            str = "<li><p>" + array.Answer3 + "</p></li>"
                    + "<li><p>" + array.Answer1 + "</p></li>"
                    + "<li><p>" + array.Answer2 + "</p></li>"
                    + "<li class='correctAnswer'><p>" + array.CorrectAnswer + "</p></li>";
        }      
        return str;
    }
});

