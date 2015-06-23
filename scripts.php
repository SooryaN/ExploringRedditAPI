<?php
$hour_arr=['12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm'];
echo "hi";
$username="1wheel";
start($username);
function start($username){
	global $user,$time_day_arr,$subreddits,$posts,$self_posts,$comments;
	$user = array();
	$time_day_arr =  array();
	$GLOBALS['time_day_arr']['list'] = array(); 
	$GLOBALS['subreddits'] =  array();
	$GLOBALS['subreddits']['list'] = array();
	$GLOBALS['posts'] =  array();
	$GLOBALS['self_posts'] =  array();
	$GLOBALS['comments'] =  array();
	getAbout($username);
	getAllSub($username);
}
function getAbout($username) {
	$json="http://www.reddit.com/user/".$username."/about.json";
	$obj = json_decode(file_get_contents($json),true);
	if($obj){
	        
	        $GLOBALS['user']['comment_karma'] = $obj['data']['comment_karma'];
	        $GLOBALS['user']['link_karma'] = $obj['data']['link_karma'];
	        $GLOBALS['user']['created'] = $obj['data']['created'];
	        $GLOBALS['user']['name'] = $obj['data']['name'];
	       // populate("usr_details");
	    }
	else{echo $obj;}
}
function getAllSub($username,$after=''){
	//$("#posts")']['html("Retrieving more posts'][' Please wait']['");
	echo ("fn start: ".$after);
	$json="http://www.reddit.com/user/".$username."/overview.json?count=25&after=".$after;
	$obj = json_decode(file_get_contents($json),true);
	if($obj){
    	echo ("sucess callback started: ".$after);
        for ($i = count($obj['data']['children'])- 1; $i >= 0; $i--) {
        	$thing = array();
			$thing['id'] = $obj['data']['children'][$i]['data']['id'];
    		$thing['ups'] = $obj['data']['children'][$i]['data']['ups'];
    		$thing['downs'] = $obj['data']['children'][$i]['data']['downs'];
    		$thing['subreddit'] = $obj['data']['children'][$i]['data']['subreddit'];
    		$thing['created'] = $obj['data']['children'][$i]['data']['created_utc'];
        	if($obj['data']['children'][$i]['kind'] == "t1"){//comment
        		$GLOBALS['comments'][]=$thing;
        	}else if($obj['data']['children'][$i]['kind'] == "t3"){//submission
        		$thing['score'] = $obj['data']['children'][$i]['data']['score'];
        		if($obj['data']['children'][$i]['data']['is_self']){
	        		$GLOBALS['self_posts'][]=$thing;
        		}else{
	        		$GLOBALS['posts'][]=$thing;
				    
        		}
        	}
        }
	        if($obj['data']['after'] || $obj['data']['before']){
	        	echo ("More Posts");
	        	processSubs();
				processSubreddit();
        		processTime_Day();
		        getAllSub($username,$obj['data']['after']);
	        }else if(!$obj['data']['after']){
	        	echo ("No More Entries");
	        	
	        	
	        }
	    }
	else{echo $obj;}
	    	
	    }
function processSubs(){
	if ( ((count($GLOBALS['posts'])==0) && (count($GLOBALS['self_posts'])==0)) || (count($GLOBALS['comments'])==0) ){
		populate("no_listing");
	}
	else{
		$user['num_posts'] = count($GLOBALS['posts']);
		$user['num_self_posts'] = count($GLOBALS['self_posts']);
		$user['num_comments'] = count($GLOBALS['comments']);
		populate("stats");
	}
}
function processTime_Day(){
	for ($i =count($GLOBALS['posts']) - 1; $i >= 0; $i--) {$GLOBALS['time_day_arr']['list'][]=$GLOBALS['posts'][$i]['created'];}
	for ($i = count($GLOBALS['self_posts']) - 1; $i >= 0; $i--) {$GLOBALS['time_day_arr']['list'][]=$GLOBALS['self_posts'][$i]['created'];}
	for ($i = count($GLOBALS['comments']) - 1; $i >= 0; $i--) {$GLOBALS['time_day_arr']['list'][]=$GLOBALS['comments'][$i]['created'];}
	$GLOBALS['time_day_arr']['repeats_hour'] = array();
	$GLOBALS['time_day_arr']['repeats_week_day'] = array();
	for ($i = count($GLOBALS['time_day_arr']['list']) - 1; $i >= 0; $i--) {
		$date=$GLOBALS['time_day_arr']['list'][$i]*1000;
		$hour = strval(date( "G", $date));
		$day = date( "j", $date);
		$week_day = date( "l", $date);
		$month = date( "F", $date);
		$year = date( "Y", $date);
		if(isset($GLOBALS['time_day_arr']['repeats_hour'][$hour])){ //already in 
			$GLOBALS['time_day_arr']['repeats_hour'][$hour]++;
			//echo ($GLOBALS['time_day_arr']['list[i])
		}else{
			$GLOBALS['time_day_arr']['repeats_hour'][$hour]=1;
		}
		if(isset($GLOBALS['time_day_arr']['repeats_week_day'][$week_day])) { //already in 
			$GLOBALS['time_day_arr']['repeats_week_day'][$week_day]++;
		}else{
			$GLOBALS['time_day_arr']['repeats_week_day'][$week_day]=1;
		}
	};
	
	populate("time_day");
}
function processSubreddit(){
	for ($i =count($GLOBALS['posts']) - 1; $i >= 0; $i--) {$GLOBALS['subreddits']['list'][]=$GLOBALS['posts'][$i]['subreddit'];}
	for ($i = count($GLOBALS['self_posts']) - 1; $i >= 0; $i--) {$GLOBALS['subreddits']['list'][]=$GLOBALS['self_posts'][$i]['subreddit'];}
	for ($i = count($GLOBALS['comments']) - 1; $i >= 0; $i--) {$GLOBALS['subreddits']['list'][]=$GLOBALS['comments'][$i]['subreddit'];}
	
	$GLOBALS['subreddits']['repeats'] = array();
	for ($i = count($GLOBALS['subreddits']['list']) - 1; $i >= 0; $i--) {
		if(isset($GLOBALS['subreddits']['repeats'][$GLOBALS['subreddits']['list'][$i]])){ //already in 
			$GLOBALS['subreddits']['repeats'][$GLOBALS['subreddits']['list'][$i]]++;
		}else{
			$GLOBALS['subreddits']['repeats'][$GLOBALS['subreddits']['list'][$i]]=1;
		}
	};
	
	populate("subreddit");
}
function populate($type)
{
	echo "populated"."<br>";
}