<?php
include("config.php");
 var_dump($_POST['username']);
 $sql = "INSERT INTO Hope (json,Username) VALUES(?,?)";
	if ($stmt = $mysqli->prepare($sql)) {
	$stmt->bind_param("s", $_POST['details'],$_POST['username']);
	$stmt->execute();
	}
/*$date = date('Y-m-d H:i:s');
mysqli_query("INSERT INTO Hope (Time_Added) VALUES ('$date')");*/