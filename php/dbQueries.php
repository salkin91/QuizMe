<?php
/*
 * Den här filen innehåller alla queries som används till databasen med
 * de olika operationerna som behövs.
 */

function InsertQuizQuery($question, $corrAnswer, $answer1, $answer2, $answer3, $quizName, $user){
    $query = "INSERT INTO `questions` VALUES ('', '" . $question . "','" 
	. $corrAnswer . "','" . $answer1 . "','" . $answer2 . "','" 
	. $answer3 . "','" . $quizName . "','" . $user . "')";
    return $query;
}
function InsertUserQuery($username, $password){
    $query = "INSERT INTO `user` VALUES('" . $username . "','" . $password . "')";
    return $query;
}
function GetUserQuery($username){
    $query = "SELECT * FROM `user` WHERE Username='" . $username . "'";
    return $query;
}

function GetQuizQuery($quizName) {
    $query = "SELECT * FROM questions WHERE QuizName='" . $quizName."'";
    return $query;
}
function GetQuizNameQuery() {
    $query = "SELECT QuizName From questions Group By QuizName";
    return $query;
}
function InsertUserInformation($ip, $browser, $os) {
    $query = "INSERT INTO `clientInformation` VALUES('" . $ip . "','" . $browser . "','" . $os . "')";
    return $query;
}

