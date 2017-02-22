<?php

$src = "numOfPlayedQuiz.txt";

function CreateFile(){
    global $src;
    if(!file_exists($src)){
        $file = fopen($src, 'w+'); //skapa filen
        fwrite($file, '0'); //börja filen från 0
        fclose($file); //stäng filen
    }
}
function IncrementFile(){
    global $src;
    $file = fopen($src, 'r+');
    //Sätt ett lock på filen
    if(flock($file, LOCK_EX)){
        $content = fread($file, 10000); //läs filen
        $number = (int)$content; //parse strängen av siffran till int
        $number++; //increment siffran
        file_put_contents($src, $number); //lägg in den nya siffran
        flock($file, LOCK_UN); //släpp locket på filen
    }
    fclose($file); //stäng filen
}
function ReadNumOfQuizPlayed(){
    global $src;
    $file = fopen($src, 'r'); //öppna en read fil
    $value = fread($file, 1010000); //läs och skriv ut siffran
    fclose($file); //stäng filen
    return $value;
}
