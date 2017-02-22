<?php

/*
 * Denna fil används för att bygga ett mailformulär som skickas till hemsidemailen.
 * Det är från kontaktsidan informationen kommer hit.
 */

//Använder 'PHPMailerAutoload.php'
require 'externalPHP/PHPMailerAutoload.php';
function SendEmail($array){
    $message = "Mail from: " . $array['name'] . PHP_EOL . $array['message']; 
    
    //Skapar ett PHPMailer objekt
    $mail = new PHPMailer;
    //Sätter den till att vara SMTP
    $mail->isSMTP();
    //Säger vilken host man använder
    $mail->Host = 'smtp.gmail.com';
    //Port den ska använda sig av
    $mail->Port = 465;
    //Vilket sätt den skickar på
    $mail->SMTPSecure = 'ssl';
    
    $mail->SMTPAuth = true;
    //Användarnamn till google
    $mail->Username = "";
    //Lösenord till google
    $mail->Password = "";
    //Sätter from addressen
    $mail->setFrom($array['email']);
    //Sätter mottagar addressen
    $mail->addAddress("webbserversidan@gmail.com");
    //Sätter svars addressen
    $mail->addReplyTo($array['email']);
    //Sätter ämnet till värdet
    $mail->Subject = $array['subject'];
    //Sätter meddelandet till värdet i $message
    $mail->Body = $message;
    //Sätter alternativ body (text/plain) med värdet i $message
    $mail->AltBody = $message;
    //Sätter SMTPOptions för att kunna skicka iväg mailet, taget från https://github.com/PHPMailer/PHPMailer/issues/368
    $mail->SMTPOptions = array(
        'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
        )
        );
    //Om mailet inte sänds iväg
    if(!$mail->send()) {
        echo 'Mailer Error: ' . $mail->ErrorInfo; //skriv ut error meddelande
        return false;
    }
    else {
        return true;
    }
}
