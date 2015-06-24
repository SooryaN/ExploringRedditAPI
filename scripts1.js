var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var w_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var hour_arr = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'];
$(document).ready(function() {
  history.pushState(null, null, window.location.href.split('#')[0]);
});
$("#send_user_name").click(function() {
  var usr = $("#user_input").val();
  if (usr == "") {
    alert("Please Enter a Valid Username");
  } else {

    start(usr);
  }
});
$("#pls_work").click(function() {
  $.get("response2.php", {
    param: 'All'
  }, function(data) {
    $("#special").css("display", "block");
    $("#Select").html('Just a second');
    $(".data_box").css("display", "block");
    console.log(typeof(data));
    console.log(data.length);
    if (data.length == 3) {
      $("#get_user_name").css("display", "none");
      $("#get_all").css("display", "none");
      alert("No requests yet. Feel free to make the first!");
    } else {
      $("#special").css("display", "block");
      $("#Select").html('<div>' + data + '</div>');

      $("#select_id").css("display", "block");
      $("#send_id").css("display", "block");
      $("#exit").css("display", "block");
    }
  });
});
$("#get_user_name").click(function() {
  $.get("response2.php", {
    param: 'Recent'
  }, function(data) {
    $("#special").css("display", "block");
    $("#Select").html('Just a second');
    $(".data_box").css("display", "block");
    $(".data_box").css("display", "block");
    console.log(typeof(data));
    console.log(data.length);
    if (data.length == 3) {
      $("#get_user_name").css("display", "none");
      alert("No requests made in the last hour.");
    } else {
      $("#Select").html('<div>' + data + '</div>');
      $("#special").css("display", "block");
      $("#select_id").css("display", "block");
      $("#send_id").css("display", "block");
      $("#exit").css("display", "block");

    }
  });
});
$("#exit").click(function() {
  $("#special").css("display", "none");
});
$("#send_id").click(function() {
  var id = $("#select_id").val();
  $("#special").css("display", "none");
  $.get("response2.php", {
    param: id
  }, function(data) {
    window.response = JSON.parse(data);
    console.log(window.response);
    window.user = window.response.user;
    window.time_day_arr = window.response.time_day_arr;
    window.time_day_arr.list = window.response.time_day_arr.list;
    window.subreddits = window.response.subreddits;
    window.posts = window.response.posts;
    window.self_posts = window.response.self_posts;
    window.comments = window.response.comments;
    window.location.hash = window.user.name + "(Retrieved)";
    $(".data_box").css("display", "block");
    populate("usr_details");
    populate("stats");
    populate("time_day");
    populate("subreddit");

  });

});

function addToDB(arr) {

  //build a post data structure
  $.ajax({
    type: "POST",
    url: "response1.php",
    //async: false,
    data: {
      details: JSON.stringify(arr),
      username: window.user.name
    },
    success: function(data) {

      console.log(data);
      return true;

    },
    complete: function() {},
    error: function(xhr, textStatus, errorThrown) {
      window.alert("No");
      console.log('ajax loading error...');
      return false;
    }
  });
}

function start(username) {
  $(".data_box").css("display", "block");
  $(".data_box").html("<img src='loading.gif' alt='Loading Gif' class='loading_gif'/>");
  window.location.hash = username;
  window.user = new Object();

  window.time_day_arr = new Object();
  window.time_day_arr.list = []
  window.subreddits = new Object();
  window.subreddits.list = []
  window.posts = []
  window.self_posts = []
  window.comments = []
  getAbout(username);
  getAllSub(username);
}

function getAbout(username) {
  $.ajax({
    url: "http://www.reddit.com/user/" + username + "/about.json?jsonp=?",
    dataType: "jsonp",
    statusCode: {
      404: function() {
        alert("page not found");
      }
    },
    success: function(response) {

      console.log(response);
      window.user.comment_karma = response.data.comment_karma
      window.user.link_karma = response.data.link_karma
      window.user.created = response.data.created
      window.user.name = response.data.name
      populate("usr_details");
    },
    error: function(xhr, ajaxOptions, thrownError) {
      if (xhr.status == 404) {
        alert(thrownError);
      }
    },
    complete: function() {
      clearTimeout(reqTimeout);
    }
  });
}
var reqTimeout = setTimeout(function() {
  alert("Request timed out.");
}, 10);

function getAllSub(username, after) {
  $("#posts").html("Retrieving more posts. Please wait.");
  if (typeof after === "undefined") {
    after = "";
  }
  console.log("fn start: " + after);
  $.ajax({
    url: "http://www.reddit.com/user/" + username + "/overview.json?jsonp=?",
    data: {
      limit: '100',
      after: after
    },
    dataType: "jsonp",
    statusCode: {
      404: function() {
        alert("page not found");
      }
    },
    success: function(response) {

      console.log("sucess callback started: " + after);
      console.log(response);
      for (var i = response.data.children.length - 1; i >= 0; i--) {
        thing = new Object();
        thing.id = response.data.children[i].data.id;
        thing.ups = response.data.children[i].data.ups;
        thing.downs = response.data.children[i].data.downs;
        thing.subreddit = response.data.children[i].data.subreddit;
        thing.created = response.data.children[i].data.created_utc;
        if (response.data.children[i].kind == "t1") { //comment
          window.comments.push(thing);
        } else if (response.data.children[i].kind == "t3") { //submission
          thing.score = response.data.children[i].data.score;
          if (response.data.children[i].data.is_self) {
            window.self_posts.push(thing);
          } else {
            window.posts.push(thing);

          }
        }
      }
      if (response.data.after || response.data.before) {
        console.log("More Posts");
        $("#posts").html("");
        processSubs();
        processSubreddit();
        processTime_Day();

        getAllSub(username, response.data.after);
      } else if (!response.data.after && !response.data.before) {
        console.log("No More Entries");
        $("#posts").html("Finished Retrieving posts. No More Entries");
        //console.log("posts: ");console.log(window.posts);console.log("self: ");console.log(window.self_posts);console.log("comments: ");console.log(window.comments);
        window.Arr = {
          user: window.user,
          time_day_arr: window.time_day_arr,
          subreddits: window.subreddits,
          posts: window.posts,
          self_posts: window.self_posts,
          comments: window.comments
        };
        addToDB(window.Arr);
      }
    },
    error: function(xhr, ajaxOptions, thrownError) {
      if (xhr.status == 404) {
        alert(thrownError);
      }
    },
    complete: function() {
      clearTimeout(reqTimeout);
    }

  });
}

function processSubs() {
  if (((window.posts.length == 0) && (window.self_posts.length == 0)) && (window.comments.length == 0)) {
    return populate("no_listing");
  } else if ((window.posts.length == 0) && (window.self_posts.length == 0)) {
    return populate("no_listing");
  } else if (window.comments.length == 0) {
    return populate("no_listing");
  } else {
    window.user.num_posts = window.posts.length;
    window.user.num_self_posts = window.self_posts.length;
    window.user.num_comments = window.comments.length;
    window.user.post_up_total = 0;
    window.user.post_down_total = 0;
    for (key in window.posts) {
      window.user.post_up_total = window.user.post_up_total + window.posts[key].ups;
      window.user.post_down_total = window.user.post_down_total + window.posts[key].downs;
    }

    return populate("stats");
  }
}

function processTime_Day() {
  for (var i = window.posts.length - 1; i >= 0; i--) {
    window.time_day_arr.list.push(window.posts[i].created);
  };
  for (var i = window.self_posts.length - 1; i >= 0; i--) {
    window.time_day_arr.list.push(window.self_posts[i].created);
  };
  for (var i = window.comments.length - 1; i >= 0; i--) {
    window.time_day_arr.list.push(window.comments[i].created);
  };
  window.time_day_arr.repeats_hour = {};
  window.time_day_arr.repeats_week_day = {};
  for (var i = window.time_day_arr.list.length - 1; i >= 0; i--) {
    var date = new Date(window.time_day_arr.list[i] * 1000);
    var hour = date.getHours();
    var day = date.getDate();
    var week_day = date.getDay();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    if (window.time_day_arr.repeats_hour.hasOwnProperty(hour)) { //already in 
      window.time_day_arr.repeats_hour[hour]++;
      //console.log(window.time_day_arr.list[i])
    } else {
      window.time_day_arr.repeats_hour[hour] = 1;
    }
    if (window.time_day_arr.repeats_week_day.hasOwnProperty(week_day)) { //already in 
      window.time_day_arr.repeats_week_day[week_day]++;
    } else {
      window.time_day_arr.repeats_week_day[week_day] = 1;
    }
  };
  console.log(window.time_day_arr);
  populate("time_day");
}

function processSubreddit() {
  for (var i = window.posts.length - 1; i >= 0; i--) {
    window.subreddits.list.push(window.posts[i].subreddit);
  };
  for (var i = window.self_posts.length - 1; i >= 0; i--) {
    window.subreddits.list.push(window.self_posts[i].subreddit);
  };
  for (var i = window.comments.length - 1; i >= 0; i--) {
    window.subreddits.list.push(window.comments[i].subreddit);
  };
  console.log(window.subreddits.list)
  window.subreddits.repeats = {};
  for (var i = window.subreddits.list.length - 1; i >= 0; i--) {
    if (window.subreddits.repeats.hasOwnProperty(window.subreddits.list[i])) { //already in 
      window.subreddits.repeats[window.subreddits.list[i]]++;
    } else {
      window.subreddits.repeats[window.subreddits.list[i]] = 1;
    }
  };
  console.log(window.subreddits.repeats);
  return populate("subreddit");
}

function populate(type) {
  if (type == "usr_details") {
    $("#user_info").html("");
    var date = new Date(window.user.created * 1000);
    var day = date.getDate()
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    $("#user_info").html("<table id='user_info_table'>\
			<tr><td>Username</td><td>" + window.user.name + "</td></tr>\
			<tr><td>Link Karma</td><td>" + window.user.link_karma + "</td></tr>\
			<tr><td>Comment Karma</td><td>" + window.user.comment_karma + "</td></tr>\
			<tr><td>Cake Day</td><td>" + month + ", " + day + " " + year + "</td></tr>");
  } else if (type == "stats") {
    $("#stats").html("");
    $("#stats").html("<table>\
			<tr><td># of Links</td><td>" + window.user.num_posts + "</td></tr>\
			<tr><td># of Self Posts</td><td>" + window.user.num_self_posts + "</td></tr>\
			<tr><td># of Comments</td><td>" + window.user.num_comments + "</tr>\
			<tr><td>Total Link Ups</td><td>" + window.user.post_up_total + "</td></tr>\
			<tr><td>Total Link Downs</td><td>" + window.user.post_down_total + "</td></tr>\
			</table>");

  } else if (type == "time_day") {
    $("#time_day").html("");
    $("#time_day").html("<div>The following graphs take in to account all of your past posts and comments. Because of reddit's api limitations, often only your last 1000 posts will show up. Posts that have been deleted will not be accounted for.</div><h3># of Posts per Week Day</h3><canvas width='600' height='300' class='graph' id='time_day-days'></canvas>\
				<script>\
				var graph_1 = new graph('time_day-days');\
		        var data_1 =  [ \
		        { x: 'Sunday', y: window.time_day_arr.repeats_week_day[0] },\
		        { x: 'Monday', y: window.time_day_arr.repeats_week_day[1] },\
		        { x: 'Tuesday', y: window.time_day_arr.repeats_week_day[2] }, \
		        { x: 'Wednesday', y: window.time_day_arr.repeats_week_day[3] }, \
		        { x: 'Thursday', y: window.time_day_arr.repeats_week_day[4] },\
		        { x: 'Friday', y: window.time_day_arr.repeats_week_day[5] }, \
		        { x: 'Saturday', y: window.time_day_arr.repeats_week_day[6] } \
		        ];\
		        graph_1.setData(data_1);\
		        graph_1.setConfig(14,'#336699');\
		        graph_1.render();\
		        </script>");
    $("#time_day").append("<h3># of Posts per Hour</h3><canvas width='800' height='320' class='graph' id='time_day-hours'></canvas>\
				<script>\
				var graph_2 = new graph('time_day-hours');\
		        var data_2 =  [];\
				for(key in hour_arr){\
					if(window.time_day_arr.repeats_hour[key]===undefined){\
						window.time_day_arr.repeats_hour[key]=0;\
					}\
					data_2.push({x:hour_arr[key],y:window.time_day_arr.repeats_hour[key]});\
				}\
		        graph_2.setData(data_2);\
		        graph_2.setConfig(6,'#336699');\
		        graph_2.render();\
		        </script>");
  } else if (type == "subreddit") {
    $("#subreddit").html("");
    $("#subreddit").append("<h3># of Posts per Subreddit</h3><canvas width='800' height='310' class='graph' id='subreddit-graph'></canvas>\
				<script>\
				var graph_3 = new graph('subreddit-graph');\
				var data_3=[];\
				var data_3_temp=[];\
				var nums_only=[];\
				for(key in window.subreddits.repeats){\
					nums_only.push(window.subreddits.repeats[key]);\
				}\
				nums_only.sort(function(a,b){return b-a});\
				if(nums_only.length>8){\
					nums_only.splice(8,nums_only.length-8);\
				}\
				var count=0;\
				while(count<8){\
					for(key in window.subreddits.repeats){\
						if (window.subreddits.repeats[key]==nums_only[count]) {\
							data_3.push({x:key,y:window.subreddits.repeats[key]});\
							delete window.subreddits.repeats[key];\
						}\
					}\
					count++;\
				}\
				console.log('--------');\
				console.log(nums_only);\
		        graph_3.setData(data_3);\
		        graph_3.setConfig(22,'#336699');\
		        graph_3.render();\
		        </script>");
  } else if (type == "no_listing") {
    $("#stats").html("");
    $("#time_day").html("");
    $("#subreddit").html("");
    $("#stats").html("There has been an error. It is likely you either have no posts or no comments.");
  } else if (type == "error") {
    $("#user_info").html("");
    $("#stats").html("");
    $("#time_day").html("");
    $("#subreddit").html("");
    $("#user_info").html("There has been an error. Either the account you typed doesn't exist or reddit is down.");
  }
}

function dump(obj) {
  var out = '';
  for (var i in obj) {
    out += i + ": " + obj[i] + "\n";
  }

  alert(out);

  // or, if you wanted to avoid alerts...

  var pre = document.createElement('pre');
  pre.innerHTML = out;
  document.body.appendChild(pre)
}