var http = require("http");
function getWeatherbyID(cityID, callback) {
   var options = {
      //http:///data/2.5/weather?id=4487042&units=imperial
      host: "api.openweathermap.org",
      //path: "/data/2.5/weather?id=" + cityID + "&units=imperial",
      path: "/data/2.5/weather?q=" + cityID + "&units=imperial",
      method: "GET",
      headers: {
         "user-agent": "Node.js"
      }
   };
   var request = http.request(options, function(res) {
      //If large data sometimes API will send in chunks
      var body = "";
      //Each time data is sent which could be a couple times
      //this event is caught with the data event
      res.on("data", function(chunk) {
         body += chunk.toString("utf8");
      });
      //After all the responses have been sent
      //an end event will emit
      res.on('end', function() {
         var json = JSON.parse(body);
         callback(json); //Calls the callback function provided
      });
   });
   request.end();
}
module.exports.getWeatherbyID = getWeatherbyID;  
