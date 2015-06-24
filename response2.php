
<?php
	include("config.php");
	if($_GET['param']=='All')
	{	
		$query = ("SELECT Username,ID,Time_Added FROM Hope WHERE 1;");
		$q=mysqli_query($mysqli,$query);
		if ($q->num_rows==00)
		{echo 0;}
		else{
		 echo "<table>";
		 echo "<tr><td>".'ID'."</td><td>".'Username'."</td><td>".'Time_Added'."</td></tr>";
		 while ($row = mysqli_fetch_array($q, MYSQLI_ASSOC)) {
		 $ID   = $row['ID'];
		 $Username = $row['Username'];
		 $Time = $row['Time_Added'];
		 
		 echo "<tr><td>".$ID."</td><td>".$Username."</td><td>".$Time."</td></tr>";
		 }
		 echo "</table>";}
	}
	else if($_GET['param']=='Recent')
	{	
		$query = ("SELECT Username,ID,Time_Added FROM Hope WHERE `Time_Added` > timestampadd(hour, -1, now());");
		$q=mysqli_query($mysqli,$query);
		if ($q->num_rows==00)
		{echo 0;}
		else{
		 echo "<table>";
		 echo "<tr><td>".'ID'."</td><td>".'Username'."</td><td>".'Time_Added'."</td></tr>";
		 while ($row = mysqli_fetch_array($q, MYSQLI_ASSOC)) {
		 $ID   = $row['ID'];
		 $Username = $row['Username'];
		 $Time = $row['Time_Added'];
		 
		 echo "<tr><td>".$ID."</td><td>".$Username."</td><td>".$Time."</td></tr>";
		 }
		 echo "</table>";}
	}
	else if(isset($_GET['param']))
    {	$id=$_GET['param'];
    	$query = ("SELECT json from Hope where ID='$id';");
    	$json=mysqli_fetch_object(mysqli_query($mysqli,$query));
    	echo $json->json;
    }
