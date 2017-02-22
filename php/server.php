<?php

include 'dbConnector.php';
include 'dbQueries.php';
include 'writeToFile.php';
include 'userAgentParser.php';
include 'mailer.php';

/*
 * Detta är serven som klienten kontaktar när den vill göra en operation
 * Alla request går via denna filen (Förutom information som sänds 
 * direkt till klienten i informationSender.php).
 */

//Startar en session för att spara användar namn och lösen
session_start();

//Skapar en connection till databasen
$conn = ConnectToDB();

/*
 * Beroende på vilken request meddelande som kommer behandlas det olika
 */

if(isset($_POST['insert'])){
    //Sätter in quiz i databasen
    InsertValues();
}
if(isset($_POST['getNames'])){
    //Hämtar quiz names
    GetQuizNames();
    //skickar in användar info till databasen
    InsertUserInfo(GetUserInformation());
}
if(isset($_POST['getQuiz'])){
    GetQuizQuestions();
}
if(isset($_POST['quizPlayed'])){
    CreateFile();
    IncrementFile();
}
if(isset($_POST['contact'])){
    $values = $_POST['contact'];
    //decode och sätt få strängen till array
    $json = get_object_vars(json_decode($values));
    //Skicka iväg mailet
    $result = SendEmail($json);
    //Skicka tillbaka resultatet
    echo json_encode(array("success"=>$result));
}
if(isset($_POST['getUser'])){
    CheckIfUser();
}
if(isset($_POST['createUser'])){
    InsertUser($_POST['createUser']);
}
if(isset($_POST['isLoggedIn'])){
    //Kollar om användarnamnet redan är satt i sassion
    if(isset($_SESSION['username'])){
        //skicka tillbaka true och användarnamnet
        echo json_encode(array("isLoggedIn"=>true, "username"=>$_SESSION['username']));
    }
    else {
        //skicka tillbaka false
        echo json_encode(array("isLoggedIn"=>false));
    }
}
if(isset($_POST['logout'])){
    //Om man vill logga ut så ta bort session
    unset($_SESSION['username']);
    unset($_SESSION['password']);
}
//Function som kollar om användaren finns i databasen
function CheckIfUser(){
    global $conn;
    $user = $_POST['getUser'];
    //Bygg query med användarnamnet
    $query = GetUserQuery($user['username']);
    $array = Array();
    //Hämta resultat från databasen
    $result = GetFromDB($conn, $query);
    //Om det fanns något resultat
    if ($result->num_rows > 0) {
    //För varje rad det finns data sätt det i $row
	while($row = $result->fetch_assoc()) {
            foreach($row as $key=>$value){
                //sätt key/value pair för varje rad
                $array[$key] = $value;
            }
	}
        //Om lösenordet som skickades med stämmer med det i databasen så finns användaren
        if($array['Password'] === $user['password']){
            //Sätt session värden som sparas
            $_SESSION['username'] = $user['username'];
            $_SESSION['password'] = $user['password'];
            //skicka tillbaka resultat
            echo json_encode(Array("isUser"=>true, "username"=>$user['username']));
        }
        //lösen ordet var fel
        else {
            echo json_encode(Array("isUser"=>false));
        }
    }
    //användaren fanns inte
    else{
        echo json_encode(Array("isUser"=>false));
    }
}
//Sätter in användare till databasen
function InsertUser($user){
    global $conn;
    //bygger query
    $query = InsertUserQuery($user['username'], $user['password']);
    //om queryn fungerade
    if($conn->query($query) === TRUE){
        //skicka tillbaka svar
        echo json_encode(Array("success"=>true));
    }
    //om inte
    else {
        //skicka tillbaka svar
        echo json_encode(Array("success"=>false));
    }
}
//Skickar in användar data till databasen
function InsertUserInfo($array){
    global $conn; 
    $userInfo = $array;
    //Bygg query
    $query = InsertUserInformation($userInfo['ip'], $userInfo['browser'], $userInfo['os']);
    //skicka in det
    if($conn->query($query) === TRUE){
    }
    
}
//hämtar quiz frågorna från databasen
function GetQuizQuestions(){
    global $conn;
    $array = Array();
    //hämtar frågorna och säter resultatet i $result
    $result = GetFromDB($conn, GetQuizQuery($_POST['getQuiz']));
    //om något resultat
    if ($result->num_rows > 0) {
        $i = 0; //för att hålla koll på vilken nr frågan är
    //För varje rad det finns data sätt det i $row
	while($row = $result->fetch_assoc()) {
            foreach($row as $key=>$value){
                //bygg den nya array'n att varje index har en associerande array
                $array[$i][$key] = $value;
            }
            $i++;
	}
        //skicka tillbaka resultatet som jsonstring
        echo json_encode($array);
    }
}
//hämtar alla quiznames från db
function GetQuizNames(){
    global $conn;
    $array = Array();
    if(CheckConnection($conn)){
        //hämtar alla quiznames från db
       $result = GetFromDB($conn, GetQuizNameQuery());
       //om något resultat
       if ($result->num_rows > 0) { 
           $index = 0;
            //För varje rad det finns data sätt det i $row
            while($row = $result->fetch_assoc()) {
                foreach($row as $key=>$value){
                    $array[$index] = $value;
                    $index++;
                }
            }
	}
        //skicka tillbaka resultat
        echo json_encode($array);
    }
}
//function som sätter in varje fråga till databasen
function InsertValues(){
    global $conn;
    $values = $_POST['insert'];
    //Hämtar alla frågorna
    $json = get_object_vars(json_decode($values));   
    
    if(CheckConnection($conn)){
        $i = 1;
        //så länge frågan med id $i finns
        while(isset($json['question[' . $i . ']'])){
            //skicka in query till databasen
            if ($conn->query(InsertQuizQuery(
                $json['question[' . $i . ']'],
                $json['correctAnswer[' . $i . ']'],
                $json['answer1[' . $i . ']'],
                $json['answer2[' . $i . ']'],
                $json['answer3[' . $i . ']'],
                $json['quizName'],
                $_SESSION['username'])) === TRUE) {
            }  
            //Annars skriv ut vad som var fel
            else {
                echo "Error: " . $query . "<br>" . $conn2->error;
            }
            $i++; // till nästa fråga id
        }
    }
    else {
        echo "connection failed";
    }
}
