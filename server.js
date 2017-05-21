(function() {
  "use strict";

	let express = require('express'), fs = require("fs"), path = require("path"),
	app = express(), port = process.env.PORT || 3000, mongo = null,
	cors = require('cors'),
	mongodb = require('mongodb'), MongoClient = mongodb.MongoClient, 
	methodOverride = require('method-override'), 
	bodyParser = require('body-parser'),
	Redis = require("./libs/RedisCache").RedisCache,
	routesPath = path.join(__dirname, "routes"), 
	develop = process.env.DEVELOP === "true", 
	STRING_CONNECTION = "mongodb://localhost/trindade",
	redisProperties = null;

	// if(develop) {
	// 	STRING_CONNECTION = "mongodb://localhost/trindade";
	// }

	// Connect to the DB
	MongoClient.connect(STRING_CONNECTION, (err, db) => {
		if(!err) {
			global.mongo = db;
			global.mongodb = mongodb;
			
			console.log("We are connected in mongodb :)");
		}
	});

	// Connection to Redis
	// if(!develop) {
	// 	redisProperties = {
	// 		port: 7429,
	// 		host: "ec2-54-163-233-146.compute-1.amazonaws.com",
	// 		password: "pbgmpbp29sm94n3r9h8mk47vmg5"
	// 	};
	// }

	Redis(redisProperties);

	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride('X-HTTP-Method-Override'));
	app.use(cors());

	// Comming up routes
	fs.readdirSync(routesPath).forEach((file) => {
	  require(__dirname + "/routes/" + file)(app);
		
		console.log("Comming up %s routes...", file);
	});

	let server = app.listen(port, () => {
		let host = server.address().address, port = server.address().port;

		console.log("Server started!");
	});
})();
