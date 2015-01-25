var server_name="http://localhost:3000/";
var socket=io.connect(server_name);
var loveDisplay=document.getElementById('Love--display');
var hateDisplay=document.getElementById('Hate--display');
var twitterHandle=document.getElementById('Twitter-Handle--display');
var tweetDisplay=document.getElementById('Tweet--display')

var love_count=0;
var hate_count=0;

function updateValues(love_count,hate_count){
	$("#Love--display").find("#Love--datafield").text((love_count/(love_count+hate_count))*100);
	$("#Hate--display").find("#Hate--datafield").text((hate_count/(love_count+hate_count))*100);
	$("#Total_Tweets--display").find("#Total_Tweets--datafield").text(love_count+hate_count);
}

function updateTable(username,tweet){
	$("#tweet-table").find('tbody')
	  .prepend($('<tr>')
	  	.append($('<td>')
	  		.text(username))
	  	.append($('<td>')
	  		//.text(decodeURIComponent(escape(tweet))))
	  		.text(tweet))
	  	)
}

socket.on('new-tweet',function(data){

	console.log("new Tweet!")
	if(data.type=="love"){
		love_count++;
	}
	else{
		hate_count++;
	}
	updateValues(love_count,hate_count);
	updateTable(data.username,data.text);
});
