$(document).ready(function(){
    $("form").submit(function(e){
        var reqInputLeft = 0; //counter
        //Loop som går igenom alla element med classen .required
        $(".required").each(function(){
            //om elementet är tomt
            if($(this).val().length === 0){
                $(this).addClass('wrongInput') //lägg ill class wrongInput på elementet
                reqInputLeft++; //increment reqInputLeft
            }
        });
        
        var correctEmail = validateEmail($("input[type^=email]"));
        //Om alla required är ifyllda eller om inte acceptForm är false (acceptBox är ej ifylld)
        if(reqInputLeft !== 0){
            e.preventDefault(); //stoppa normalt beteende
            alert("Please fill the required fields");
        }
        else if(!correctEmail){
            e.preventDefault(); //stoppa normalt beteende
            alert("Please enter a valid E-mail address");
            }
        
        //Annars är formuläret accepterat
        else {
            e.preventDefault(); //stoppa normalt beteende
            var input = BuildArray();
            //skicka ett post request till serven
            $.post("../php/server.php", {contact: JSON.stringify(input)}, function(response){
                var answer = JSON.parse(response);
                if(answer.success){
                    alert("Thank you for your message");
                    resetFields();
                }
                else {
                    alert("Message couldn't be sent");
                }
            });
        }
    });
    //Tömmer fälten i form
    function resetFields(){
        $("input[type^=text], input[type^=email], textarea").val('');
    }
   //Kollar så att det är en korrekt formaterad email
   function validateEmail(element){
        //använder en regExp
        var validEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/;
        //returnerar resultatet av test på elementets value
        return validEmail.test(element.val());
    }
    //Bygger en assosierande array från inputfieldsen
    function BuildArray(){
        var dataArray = $("form").serializeArray(),
        len = dataArray.length,
        dataObj = {};
        for (i=0, y = 0; i<len; i++) {
            //Sätter samman fältets namn med värde
            dataObj[dataArray[i].name] = dataArray[i].value;
        }
        return dataObj;
    }
});


