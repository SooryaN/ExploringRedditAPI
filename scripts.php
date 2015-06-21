<?php
$months = array('January','February','March','April','May','June','July','August','September','October','November','December'); 
$w_days = array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday');
$hour_arr=array('12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm');
$username = $_POST['username'];

if ($username=""){
	header("Location: index2.html");
	die();
}
else{
	start($_POST['username']);
}
$user = array();
	$ratios =  array();
	$time_day_arr =array();
	$time_day_arr['list'] = array();
	$subreddits =  array();
	$subreddits['list']= array();
	$posts = array();
	$self_posts = array();
	$comments = array();
function start($username){
	
<<<<<<< HEAD
	//SET URL!!!$location.hash = username;
=======
	//SET URL!!!
>>>>>>> d72ee7d25fa4ee6e0d3078ba0fed5ffa41e9f76f
	
	getAbout($username);
	getAllSub($username);
}

function getAbout($username) {
	$json="http://www.reddit.com/user/".$username."/about.json";
	$obj = json_decode(file_get_contents($json),true);
	if ($obj)
	{
	    $user['comment_karma'] = $obj['data']['comment_karma'];
	    $user['link_karma'] = $obj['data']['link_karma'];
	    $user['created'] = $obj['data']['created'];
	    $user['name'] = $obj['data']['name'];
	}
	else{print_r(file_get_contents($json));}
}

function getAllSub($username,$after=''){
	$url="http://www.reddit.com/user/".$username."/overview.json?jcount=25&after=".$after;
	$data=array();
	$data['after']=$after;
	$obj = json_decode(file_get_contents($url),true);
	if($obj) {
<<<<<<< HEAD
    	//echo ("sucess callback started: ".$after);
=======
    	
>>>>>>> d72ee7d25fa4ee6e0d3078ba0fed5ffa41e9f76f
        for ($i = count($obj['data']['children'])- 1; $i >= 0; $i--) {
        	$thing = array();
			$thing['id'] = $obj['data']['children'][$i]['data']['id'];
    		$thing['ups'] = $obj['data']['children'][$i]['data']['ups'];
    		$thing['downs'] = $obj['data']['children'][$i]['data']['downs'];
    		$thing['subreddit'] = $obj['data']['children'][$i]['data']['subreddit'];
    		$thing['created'] = $obj['data']['children'][$i]['data']['created_utc'];
<<<<<<< HEAD
    		//echo $obj['data']['children'][$i]['kind'];
=======
>>>>>>> d72ee7d25fa4ee6e0d3078ba0fed5ffa41e9f76f
        	if($obj['data']['children'][$i]['kind'] == "t1"){//comment
        		$comments[]=$thing;
        	}else if($obj['data']['children'][$i]['kind'] == "t3"){//submission
        		$thing['score'] = $obj['data']['children'][$i]['data']['score'];
        		echo $obj['data']['children'][$i]['data']['is_self'];
        		if($obj['data']['children'][$i]['data']['is_self']){
	        		$self_posts[]=$thing;
        		}else{
	        		$posts[]=$thing;
				    if($obj['data']['children'][$i]['data']['ups']== 0){
	    				$ratio = 0;
	        		}else if ($obj['data']['children'][$i]['data']['downs']==0){
	        			$ratio = $obj['data']['children'][$i]['data']['ups'];
	        		}else{
	        			$ratio = $obj['data']['children'][$i]['data']['ups']/$obj['data']['children'][$i]['data']['downs'];
	        		}
		        	$ratios[]=$ratio;
        		}
        	}
        }
        if($obj['data']['after'] || $obj['data']['before']){
<<<<<<< HEAD
        	//echo("More Posts");
	        getAllSub($username,$obj['data']['after']);
        }else if(!$obj['data']['after'] && !$obj['data']['before']){
        	//echo("No More Entries");
        	$self_posts = isset($self_posts) ? $self_posts : '';
=======
  	        getAllSub($username,$obj['data']['after']);
        }else if(!$obj['data']['after'] && !$obj['data']['before']){
          	$self_posts = isset($self_posts) ? $self_posts : '';
>>>>>>> d72ee7d25fa4ee6e0d3078ba0fed5ffa41e9f76f
	        echo("posts: ");var_dump($posts);echo("self: ");var_dump($self_posts);echo("comments: ");var_dump($comments);
        	/*processSubs();
			processSubreddit();
    		processTime_Day();*/
        }
    }
    else{
	    	echo("error");
	    }
	}
?>

<html> 
    <head> 
        <link rel="shortcut icon" href="favicon.png" type="image/x-icon">
        <title>reddit User Stats</title>
        <link rel="stylesheet" href="main.css">
        <!--[if IE]><script type="text/javascript" src="js/vendor/excanvas.min.js"></script><![endif]-->
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    </head>
    <body>
<form id="form" method="post" action="scripts.php" accept-charset='UTF-8'>
                <input type="text" style="width:200px;" name="username" placeholder="reddit Username" value="" required autofocus/>
                <input type="submit" value="Go" class="button" name="submit">
            </form>
    </body>
<<<<<<< HEAD
</html>
=======
</html>
>>>>>>> d72ee7d25fa4ee6e0d3078ba0fed5ffa41e9f76f
