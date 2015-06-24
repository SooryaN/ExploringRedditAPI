<?php
########## MySql details (Replace with yours) #############
$username = "root"; //mysql username
$password = "password"; //mysql password
$hostname = "localhost"; //hostname
$databasename = 'RedditAPI'; //databasename

//connect to database
$mysqli = new mysqli($hostname, $username, $password, $databasename);
?>