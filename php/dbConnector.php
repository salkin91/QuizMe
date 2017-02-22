<?php

$servername = "localhost"; //Server url
$username = "root"; //användar namn
$password = ""; //lösenord
$db = "quiz"; //databas namn

//Connection till enbart mysql för att skapa databas om den inte redan finns
function ConnectNoDB(){
    global $servername, $username, $password;
    return new mysqli($servername, $username, $password);
}
//Connection till Databas
function ConnectToDB() {
    global $servername, $username, $password, $db;
    return new mysqli($servername, $username, $password, $db);
}

function CheckConnection($conn) {
    // Kollar connection
    if ($conn->connect_error) {
        //Om det inte finns någon connection skriv ut varför
        die("Connection failed: " . $conn->connect_error);
        return false;
    }
 else {
        return true;
    }
}
//Skapar databasen om den inte redan finns
function CreateDB($conn) {
    $ok = false;
    if(CheckConnection($conn)){
        if(DBExist($conn)){
            $ok = true;
        }
    }
    return $ok;
}
//Kollar om databasen finns eller skapar den om den inte finns
function DBExist($conn) {
    global $db;
    $ok = false;
    //sql query
    $dbExist = 'CREATE DATABASE IF NOT EXISTS ' . $db;
    //om databasen inte finns
    if(!$conn->query($dbExist)) {
        //skapa databas
        if($conn->query("CREATE DATABASE " . $db) !== TRUE) {
            echo "Error creating database: " . $conn->error;
        }
        else{
            $ok = true;
        }
    }
    else {
        $ok = true;
    }
    return $ok;
}
//Insert data till databasen
function InsertToDB($conn, $query) {
    //Svarar med true/false om det gick eller inte
    if($conn->query($query)){
        return true;
    }
    else { 
        return false;
    }
}
//Hämtar data från databasen
function GetFromDB($conn, $query) {
    return $conn->query($query);
}
