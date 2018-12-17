const express = require("express");
const bodyParser = require("body-parser");
var fs = require('fs');
  
const app = express();
app.set('view engine', 'ejs'); 

app.use('/public', express.static('public'));

//////////// Database ////////////////////
var DB = [];
const GUEST = {
	email: ""
}
function User (email, pass) {
	this.email = email;
	this.pass = pass;
	this.sentMsgs = [];
	this.receivedMsgs = [];
	console.log('User ' + this.email + ', password: ' + this.pass + ' has been added.');
}

var currentUser = GUEST;
//////////////////////////////////////////
///////////// Message ////////////////////
function Message (email, text, subject = "(No subject)") {
	if (subject == undefined || subject == "")
		subject = "(No subject)";
	this.email = email;
	this.text = text;
	this.subject = subject;
	this.isChecked = false;
}
const MAX_MESSAGES_AT_PAGE = 51;
//////////////////////////////////////////
  
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.get("/", urlencodedParser, function (request, response) {
    response.render('main', {loggedEmail: currentUser.email});
});
 
app.get("/register", urlencodedParser, function (request, response) {
    response.render('register', {underEmailText: "", underPassText: ""});
});

app.post("/register", urlencodedParser, function (request, response) {
    var errors = verifyRegisterParams(request.body.email, request.body.pass);
    if (errors)
    	response.render('register', errors);

    // add a new user
    DB.push(new User(request.body.email, request.body.pass));
    DB[DB.length - 1].receivedMsgs.push(new Message("Team GMAIL", 
    											"Thanks for joining our service!",
    											"New user"));

    response.render('register', {underEmailText: "Succesfully registered!",
     							underPassText: "Succesfully registered!"});
});

app.get("/login", urlencodedParser, function (request, response) {
    response.render('login', {underEmailText: "", underPassText: ""});
});

app.post("/login", urlencodedParser, function (request, response) {
    var errors = verifyLoginParams(request.body.email, request.body.pass);
    if (errors)
    	response.render('login', errors);
    
    response.render('main', {loggedEmail: currentUser.email});
});

app.get("/passChange", function (request, response) {
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	response.render('passChange', {underEmailText: "", underPassText: "", underNewPassText: ""});
});

app.post("/passChange", urlencodedParser, function (request, response) {
	var errors = verifyPassChangeParams(request.body.pass,
										request.body.newPass);
    if (errors) 
    	response.render('login', errors);

    // Change a password
    console.log(currentUser.email + ' changed his pass from ' + 
    	currentUser.pass + ' to ' + request.body.newPass);
    currentUser.pass = request.body.newPass;

	response.render('main', {loggedEmail: currentUser.email});
});

app.post("/logout", function (request, response) {
	console.log(currentUser.email + " logged out");
	currentUser = GUEST;
	response.render('main', {loggedEmail: currentUser.email});
});

app.get("/received", function(request, response) {
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	response.render('messageList', {loggedEmail: currentUser.email,
									pageName: "received",
									messages: currentUser.receivedMsgs});
});

app.get("/received/:id", function(request, response){
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	if (!isFinite(+request.params.id) || request.params.id >= currentUser.receivedMsgs.length)
  		response.status(400).send("Error! Cannot get the page.");

  	currentUser.receivedMsgs[request.params.id].isChecked = true;
	//var NumOfPages = Math.trunc(currentUser.receivedMsgs.length / MAX_MESSAGES_AT_PAGE) + 1;
	
	response.render('showMessage', {loggedEmail: currentUser.email,
									message: currentUser.receivedMsgs[request.params.id]});
});

app.get("/sent", function(request, response) {
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	response.render('messageList', {loggedEmail: currentUser.email,
									pageName: "sent",
									messages: currentUser.sentMsgs});
});

app.get("/sent/:id", function(request, response){
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	if (!isFinite(+request.params.id) || request.params.id >= currentUser.sentMsgs.length)
  		response.status(400).send("Error! Cannot get the page.");

  	currentUser.sentMsgs[request.params.id].isChecked = true;
	
	response.render('showMessage', {loggedEmail: currentUser.email,
									message: currentUser.sentMsgs[request.params.id]});
});

app.get("/compose", function(request, response){
	if (currentUser == GUEST)
		response.render('login', {underEmailText: "", underPassText: ""});

	response.render('compose', {loggedEmail: currentUser.email, responseText: ""});
});

app.post("/compose", urlencodedParser, function(request, response){
	var resText = "There is no user with a specified email";
	for (var i = 0; i < DB.length; i++) {
		if (DB[i].email == request.body.to) { // Found a receiver
			DB[i].receivedMsgs.push(new Message(request.body.to,
												request.body.text,
												request.body.subject));
			currentUser.sentMsgs.push(new Message(request.body.to,
													request.body.text,
													request.body.subject));
			resText = "Message was sent";
		}
	}

	response.render('compose', {loggedEmail: currentUser.email, responseText: resText});
});

app.listen(3000);

function verifyRegisterParams(email, pass) {
	// Here we can add required tests for register parameters
	if (email == "" && pass == "")
		return {underEmailText: "Fill this line!",
				underPassText: "Fill this line!"};
	else if (email == "")
		return {underEmailText: "Fill this line!",
				underPassText: ""};
    else if (pass == "")
		return {underEmailText: "",
				underPassText: "Fill this line!"};

	var userExists = false;
	DB.forEach( function(user) {
   		if (user.email == email)
   			userExists = true;
   	});
   	if (userExists)
   		return {underEmailText: "This email had been registered",
					underPassText: ""};

   	// all is OK
   	return null;
}

function verifyLoginParams(email, pass) {
	// Here we can add required tests for login parameters
	if (email == "" && pass == "")
		return {underEmailText: "Fill this line!",
				underPassText: "Fill this line!"};
	else if (email == "")
		return {underEmailText: "Fill this line!",
				underPassText: ""};
    else if (pass == "")
		return {underEmailText: "",
				underPassText: "Fill this line!"};

	// Look for an enter user in a database 
	for (var i = 0; i < DB.length; i++) {
		if (DB[i].email === email && DB[i].pass !== pass)
			return {underEmailText: "",
					underPassText: "Wrong password. Try again!"};
   		else if (DB[i].email === email && DB[i].pass === pass) {
   			currentUser = DB[i]; // Select a user
   			return null;// all is OK
   		}
   	}

	return {underEmailText: "There is no user with a written email.",
			underPassText: ""};
}

function verifyPassChangeParams(pass, newPass) {
	// Here we can add required tests for login parameters
	if (pass == "" && newPass == "")
		return {underPassText: "Fill this line!",
				underNewPassText: "Fill this line!"};
	else if (pass == "")
		return {underPassText: "Fill this line!",
				underNewPassText: ""};
    else if (newPass == "")
		return {underPassText: "",
				underNewPassText: "Fill this line!"};

	return null;
}