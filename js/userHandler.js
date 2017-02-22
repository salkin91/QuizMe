$(document).ready(function() {
    
    /*
     * Denna filen tar hand on användare med inloggning och så vidare
     */
    
    var loggedIn = false;
    //Skickar ett request till serven för att kolla om användaren har en session
    $.post("../php/server.php", {isLoggedIn: true}, function(response){
        var array = JSON.parse(response);
        if(array.isLoggedIn){
            loggedIn = true;
            //visar information som bara inloggade kan se
            $("#quizMaker").css({display: "inherit"}); 
            $("#user").text(array.username);
        }
    });
    
    $("#user").click(function(){
        if(!loggedIn){
            $("#login").css({display: "inherit"}); //Visa loggin formuläret
        }
    });
    
    $("#btnLogOut").click(function(){
        //Skicka ett request till serven om att användaren loggar ut
        $.post('../php/server.php', {logout: true}, function(){
            //tar bort all information och så som en icke användare
            $("#quizMaker").css({display: 'none'});
            loggedIn = false;
            $("#user").text("Login");
            $("#user").removeClass('show');
            $("#userDropDown").css({display: 'none'});
            window.location.href = "index.html";
        });
    });
      
    //När man hovrar dropdownBtn
    $("#user").hover(function(){
        if(loggedIn){
            $("#userDropDown").css('display', 'block'); //gör #dropDown synlig
        }   
    }, function(){
        $("#userDropDown").css('display', 'none'); //gör #drioDown hidden
    });
        
    //När man hovrar ner på #dropDown
    $("#userDropDown").hover(function(){
        console.log("helloworld");
        $("#userDropDown").css('display', 'block'); //gör #dropDown synlig
    }, function(){
        $("#userDropDown").css('display', 'none'); //gör #dropDown hidden
    });
    
    $("#loginForm").submit(function(event){
        event.preventDefault();
        var isEmpty = false;
        //Kollar så att båda inputfieldsen är ifyllda
        $("#loginForm input[type^=text], #loginForm input[type^=password]").each(function(){
            if($(this).val().length === 0){
                isEmpty = true;
            }
        });
        //Om båda är ifyllda
        if(!isEmpty){
            //Hämta lösenordet och sedan gör en hash av det
            var password = $("#loginPassword").val();
            var hash = password.hashCode();
            
            var array = {};
            //Sätter användar uppgifterna i en associerande array
            array['username'] = $("#loginForm input[type^=text]").val();
            array['password'] = hash;
            //skicka arrayn till serven
            $.post('../php/server.php', {getUser: array}, function(response){
                var array = JSON.parse(response);
                //Om användaren finns i databasen
                if(array.isUser){
                    $("#user").text(array.username);
                    loggedIn = true;
                    $("#loginForm").css({display: 'none'});
                    $("#quizMaker").css({display: "inherit"});
                }
                else {
                    alert("Username or password is wrong");
                }
            });
        }   
    });
    //skapar ett konto
    $("#accountForm").submit(function(){
        event.preventDefault();
        var isEmpty = false;
        //Kollar så att allt är ifyllt
        $("#createForm input[type^=text], #createForm input[type^=password]").each(function(){
            if($(this).val().length === 0){
                isEmpty = true;
            }
        });
        //om allt är ifyllt
        if(!isEmpty){
            var array = {};
            var password = $("#createPassword").val();
            //skapa en hash av de ifyllda lösenordet
            var hash = password.hashCode();
            //sätter användar uppgifterna i en associerande array
            array['username'] = $("#accountForm input[type^=text]").val();
            array['password'] = hash;
            //skickar array till server
            $.post('../php/server.php', {createUser: array}, function(response){
                var array = JSON.parse(response);
                //Om användarnamnet inte var upptaget så skapades kontot
                if(array.success){
                    $("#createAccount").css({display: 'none'});
                    $("#login").css({display: 'none'});
                    alert("Account created!");
                }
                else {
                    alert("Username is already taken");
                }
                
            });
        }
    });
    //öppnar så man kan skapa konto
    $("#btnCreate").click(function(event){
        event.preventDefault();  
        $("#createAccount").css({display: "inherit"});
    });
    //Stänger ner login formuläret
    $("#cancelLogin").click(function(event){
        event.preventDefault();
        $("#login").css({display: "none"});
        ClearFields();
    });
    //Stänger ner skapandet av konto
    $("#cancelAccount").click(function(event){
        event.preventDefault();
        $("#createAccount").css({display: "none"});
        ClearFields();
    });
    //Tar bort alla input från alla formulär
    function ClearFields(){
        $("form input[type^=text], form input[type^=password]").each(function(){
            $(this).val(''); 
        });
    }
    
    //Hash function taget från http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function() {
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    
    
});

