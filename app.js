// reference the http module so we can create a webserver
var path = require('path')
  ,express = require("express")
  ,weatherbyID = require("./getWeather.js")
  ,formUtilities = require("./formUtilities.js")
  ,port_var = 1337
  ,ip_var = 'localhost'
  ,ip_portDB = '27017'
  ,MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  ,app = express();
//process.env.PORT
//process.env.IP
MongoClient.connect('mongodb://'+ip_var + ':' + ip_portDB + '/test', function(err, db) {
    //Throw and err if problem connecting
    if(err) throw err;
    
    //Utility for using the db connection to make process data
    var myForm = new formUtilities.formObject(db);

    // all environments
    app.set('port', port_var || 3000);
    app.set('views', path.join(__dirname, '/views'));
    app.set('view engine', 'jade'); 

    app.use(app.router); //Checks the route first before checking for static files
    app.use(express.static(__dirname + "/public")); //use public folder in current directory

    app.get("/", function(req, res) {
       res.render('table', {title:'Justin\'s Express App', subTitle: 'Express Grid App' , form_ID: 'Justin'});
       });
    app.get("/:form", function(req, res) {
       var formID = req.params.form;
       res.render(formID, { title: 'Form Details' , name: 'Justin'});
       });    
    app.get("/weather/:id", function(req, res) {
       var weatherID = req.params.id;
       weatherbyID.getWeatherbyID(weatherID, function(json) {
          if (json.cod === "404") {
             res.send("Sorry cannot that City ID ", 404);
          } else {
             res.send("<p>The weather in " + json.name + " is " + json.main.temp);
          }
       });
    });
    app.get("/form/get/:form", function(req, res) {
        var formID = req.params.form;
        myForm.getMyData(formID, function(statusMsg) {
                var sMsg = JSON.stringify(statusMsg);
                res.json(statusMsg)
                //res.send(sMsg);
            });
    });
    app.get("/form/:form", function(req,res) {
       var formID = req.params.form;
       res.render('table', {title:'Justin\'s Express App', subTitle: 'Express Grid App' , form_ID: formID})
    })
    app.post("/form/save", function(req, res) {
        var formJSON = '';
       req.on('data', function(data) {
        formJSON += data;
        //Some suggest added a check to make sure request is not to big
        });
        req.on('end', function() {
            myForm.saveMyData(formJSON, function(statusMsg) {
                res.send(statusMsg);
            });
        }); 
    });
    app.get("/finance/table", function(req,res) {
       res.render('financeTable', {title:'Sommer\'s Finance App'})
    });
    app.post("/form/update", function(req, res) {
       var formJSON = '';
       req.on('data', function(data) {
          formJSON += data;
       });
       req.on('end', function() {
          myForm.updateMyData(formJSON, function(statusMsg) {
                res.send(statusMsg);
            });
       });
    });
    app.post("/form/removeline", function(req, res) {
       var formJSON = '';
       req.on('data', function(data) {
          formJSON += data;
       });
       req.on('end', function() {
          myForm.removeMyData(formJSON, function(statusMsg) {
                res.send(statusMsg);
            });
       });
    });
    app.listen(port_var, ip_var);
    //mongoclient.open(function(err,mongoclient){app.listen(port_var, ip_var)})
    console.log('Listening on ' + port_var + ' and IP ' +  ip_var);

    // Note: when spawning a server on Cloud9 IDE, 
    // listen on the port_var and process.env.IP environment variables

    // Click the 'Run' button at the top to start your server,
    // then click the URL that is emitted to the Output tab of the console
});