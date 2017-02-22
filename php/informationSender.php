<?php
include 'writeToFile.php';

/*
 * Den här filens ansvar är att sända information från databasen
 * till klienten om hur många quiz som har spelats 
 */

//Sätter headers
header("Content-Type: text/event-stream");
header('Cache-Control: no-cache');

  $count = 1;
  do {
    $count++;
    $value = ReadNumOfQuizPlayed(); //Hämtar siffran i filen
    //skickar data till klient
    echo "data: " . $value . PHP_EOL;
    echo PHP_EOL;
    ob_flush(); //skickar output buffer
    flush(); //skickar vidare till klient
    sleep(20); //sover 20 sec
  } while($count < 1000);
  

