var Twitter = require('twitter');
var request = require('request');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

client.stream('statuses/filter', {follow: '5402612, 428333, 6017542'},  function(stream) {
  stream.on('data', function(tweet) {
    console.log(new Date() + tweet.user.screen_name + " ### " + tweet.text);
    if(!tweet.text.startsWith("RT @") && tweet.in_reply_to_user_id==null) {
      console.log(tweet);
      var options = {
        url:'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          'Authorization': 'key='+process.env.FIREBASE_SERVER_KEY
        },
        body: {
          "to": "/topics/news",
          "notification": {
            "title":tweet.user.name+"(@"+tweet.user.screen_name+")",
            "body": tweet.text,
            "color": "#1B95E0"
           }
        },
        json:true
      };
      request(options,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
      );
    }
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});