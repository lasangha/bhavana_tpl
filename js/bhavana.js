//
// The user must be logged in in order to use the application
//

//checkLogin();
// I check if the user is logged in
function checkLogin(){
	console.log("Checking login");
    var url = window.location.pathname;
    var filename = url.substring(url.lastIndexOf('/')+1);
	if(filename != "preferences.html"){
	if(getKey("myEmail", "buddha@lasangha.org") == "buddha@lasangha.org"){
		console.log("User is not logged in");
		$(location).attr('href',"preferences.html");
	}
	}
}

//
// Some stuff that should be loaded if I am running from the app, this is not automatic, I change this if I am compiling for it
// 
// I'm I running from the app?
var onApp = false;

//
// I'm i running in a mobile device?
// Not really using it now
//
var mobile = false;
var os = navigator.appVersion;
os = os.toLowerCase();

if(runningOnMobile()){
	mobile = true;
}

function runningOnMobile(){

	console.log("I'm I running on mobile?");

	if(strpos(os, 'android', 0) > 0){
		return true;
	}
	if(strpos(os, 'iphone', 0) > 0){
		return true;
	}
	return false;

}

// Conection states
var thisPage = window.URL;
var lastPage = "";

var sessionId = 0;

var apiPath = "http://192.168.43.164/bhavana/api/api.php";

function getConnectionType(){

	console.log("Getting conexion type");

	if(mobile){
		console.log("I am running on mobile");
		// Which is the connectivity at the moment
		var networkState = navigator.connection.type;

		return networkState;
	}
	else{
		console.log("I will assume is a desktop");
		return "desktop";
	}

}

// I check for connectivity, you should ask for the type of connection you want to check for,
// If you want to see if there is NO connectivity you should say
// if(checkConnection(false) == true) and that will tell you if there is NO connectivity
function checkConnection() {

	console.log("Checking for connectivity");

	// Which is the connectivity at the moment
	var networkState = getConnectionType();

	if(!networkState == "desktop"){

		console.log("I am running on mobile");

		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';

		// Lets see if I have what you need
		if(states[networkState] == Connection.NONE){
			console.log("No connection");
			return false;
		}
		else{
			return true;
		}
	}
	else{
		console.log("I am on a desktop, I can't really tell");
		return true;
	}

	// Just in case
	return false;
}

function sendMail(){

	console.log("Sending an email");
	console.log($('#myName').val());

	if(!checkConnection()){
		console.log("No connectivity");
		alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
		return false;
	}

	$.ajax({
		type: 'POST',
		url: 'http://app.lasangha.org/mailer.php',
		dataType: "json",
		data: {
			from: $('#myName').val(),
		email: $('#myEmail').val(),
		msg: $('#text').val(),
		},
		success: function (data) {
			console.log(data)
		}
	});
	return false;

}

function whereAmI(){
	// are we running in native app or in a browser?
	window.isphone = false;
	if(document.URL.indexOf("http://") === -1 
			&& document.URL.indexOf("https://") === -1) {
				window.isphone = true;
				window.mobile = true;
			}

	if( window.isphone) {
		console.log("I am on a device");
		document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		console.log("I am on a computer");
		onDeviceReady();
	}
}

function onDeviceReady() {
	// do everything here.
}


function getSessionId(){

	console.log("Getting the session Id");

	sessionId = getKey("sessionId");

	if(sessionId == null || sessionId < 0){
		sessionId = '0';
		storeKey("sessionId", sessionId);
	}
}

// http://phpjs.org/functions/strpos/
function strpos(haystack, needle, offset) {
	//  discuss at: http://phpjs.org/functions/strpos/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Onno Marsman
	// improved by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Daniel Esteban
	//   example 1: strpos('Kevin van Zonneveld', 'e', 5);
	//   returns 1: 14

	var i = (haystack + '')
		.indexOf(needle, (offset || 0));
	return i === -1 ? false : i;
}

/**
  @ not in use?
 */
function showPlayer(){

	console.log("I am showing the player");
	$("#myPlayer").show();

}

function hidePlayer(){

	if($("#cause").val() == 0){
		console.log("I am hidding the player");
		$("#myPlayer").hide();
	}
	else{
		console.log("I am showing the player ?");
		$("#myPlayer").show();
		$('audio').each(function(){
			//this.currentTime = 0; // Reset time
			this.play(); // Stop playing
		});

		// For now I will count it as valid meditation time, I must improve this
		// Standard meditation sessions are 3 min, I will consider other times later on
		addToCause(3);
	}

}

// @deprecated?
function stopPlayer(){

	console.log("Stopping the audio");

	$('audio').each(function(){
		this.pause(); // Stop playing
		this.currentTime = 0; // Reset time
	});

	return true;
}

// Database
function runDb() {
	console.log("Running db");
	var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
	db.transaction(populateDB, errorCB, successCB);
	return false;
}

// Populate the database 
//
function populateDB(tx) {
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

// Transaction error callback
//
function errorCB(tx, err) {
	alert("Error processing SQL: "+err);
}

// Transaction success callback
function successCB() {
	alert("success!");
}

function storeThisPage(){

	// Re set this page
	thisPage = document.URL;

	console.log("Storing this page: >>>>> " + thisPage);

	// Is this an storable page?
	if(!strpos(thisPage, "s_")){
		console.log("I shall not store this page!");
		return false;
	}

	// Is it the front page?
	console.log("Front? " + strpos(thisPage, "index.html"));

	// Last page was
	console.log("Last Page: " + getKey("lastPage"));

	if(!strpos(thisPage, "index.html")){
		console.log("Storing this page");
		storeKey("lastPage", thisPage);
	}else{
		console.log("I am the front page");
	}
}

// Save user settings
function saveMySettings(){

	console.log("Saving settings");

	if($("#meditateWithThemAll").is(":checked") == true){
		console.log("I want to meditate with them all....");
		storeKey("meditateWithThemAll", true);
	}else{
		storeKey("meditateWithThemAll", false);
		console.log("I will not meditate with them all!");
	}

	// Name
	if($("#name").val() != ""){
		console.log("I have a name");
		storeKey("myName", $("#name").val());
	}else{
		removeKey("myName");
		console.log("I have no name");
	}

	// Country
	if($("#country").val() != ""){
		console.log("I live somewhere");
		storeKey("myCountry", $("#country").val());
	}else{
		removeKey("myCountry");
		console.log("I live nowhere");
	}

	// email
	if($("#email").val() != ""){
		console.log("I have an email");
		storeKey("myEmail", $("#email").val());
	}else{
		removeKey("myEmail");
		console.log("I have no email");
	}

	// pwd
	if($("#pwd").val() != ""){
		console.log("I have a password");
		storeKey("myPwd", $("#pwd").val());
	}else{
		removeKey("myPwd");
		console.log("I have no pwd");
	}

	var exists = logMeIn(registerMe);

	/*
	if(exists == false){
		registerMe();
	}
	*/

	return false;

}

function wrongPassword(){
	alert("Lo siento, pero esa contraseña no es correcta.");
}

// I log the account in
function logMeIn(callMe){

	console.log("Logging in the user");

	$.ajax({
		type: 'POST',
		url: apiPath,
		dataType: "json",
		data: {
			what: "logUserIn",
			email: getKey("myEmail", "buddha@lasangha.org"),
			pwd: getKey("myPwd", "1234567890!")
		},
		success: function (data) {
			console.log("Response is:" + data);
			if(data == "1"){
				console.log("User exists, I was able to login");
				alert("Muchas gracias :)");
				return true;
			}
			else if(data == "2"){
				console.log("User does not exist, I will try to create the user");
				callMe();
			}
			else if(data == "0"){
				console.log("Wrong password, but the user exists");
				wrongPassword();
			}

		}
	});

}

// I register users
function registerMe(){

	console.log("Registering new user");

	$.ajax({
		type: 'POST',
		url: apiPath,
		dataType: "json",
		data: {
			what: "addUser",
			name: getKey("myName", "Ananda"),
			email: getKey("myEmail", "buddha@lasangha.org"),
			pwd: getKey("myPwd", "1234567890!"),
			country: getKey("myCountry", "Nibbana")
		},
		success: function (data) {
			alert("Gracias, el usuario ha sido creado.");
			console.log(data)
		}
	});

}

// Load them in the settings form
function loadMySettings(){
	console.log("Loading settings");
	if(getKey("meditateWithThemAll", true) == 'true'){
		console.log("I will participate with the global meditations");
		$("#meditateWithThemAll").attr("checked", true);
	}else{
		console.log("Uncheking the meditation with them all");
		$("#meditateWithThemAll").attr("checked", false);
	}
	$("#name").val(getKey("myName", ""));
	$("#email").val(getKey("myEmail", ""));
	$("#country").val(getKey("myCountry", ""));

	return false;
}


// I will take you to the last visited page of the course
function gotoLastPage(){

	// Where I'm I?
	var thisPage = document.URL;

	console.log("I am in page: " + thisPage);

	// Where was I?
	var lastValue = getKey("lastPage");

	// If there is a last location, I'll go there
	if(lastValue == null){
		console.log("Nothing set");
		window.location = "s_s_backToTheBody.html";
	}
	else{
		console.log("Going to: " + lastValue);
		window.location = lastValue;
	}
}

// Keys
function storeKey(key, value){
	console.log("Storing key: " + key);
	window.localStorage.setItem(key, value);
	return true;
}

function getKey(key, defaultValue){

	var value = window.localStorage.getItem(key);

	if(value == null){
		console.log("No value found, I will use the default");
		value = defaultValue;
	}

	console.log("Gotten Key: " + key + " with value: " + value);
	return value;
}

// keyname is now equal to "key"
// value is now equal to "value"
function removeKey(theKey){
	console.log("Removing key: " + theKey);
	window.localStorage.removeItem(theKey);
}

//removeKey("sessionId");
//window.localStorage.setItem("key2", "value2");
//window.localStorage.clear();
// localStorage is now empty

// Show the intro parts one by one
function showIntroStuff(){
	$(".review").each(function(index, value) { 
		$(this).hide();
		//    console.log('div' + index + ':' + $(this).attr('id')); 
	});

}

// This are all the sessions!!!!
// Samatha 1 - Tranquilidad
var tranquilidadBody = [];
tranquilidadBody.push({desc:"¿De quién es el cuerpo?", cat:"Volver al cuerpo"});
tranquilidadBody.push({desc:"¿Cómo se siente este cuerpo?", cat:"Volver al cuerpo"});
tranquilidadBody.push({desc:"¿Dónde está el cuerpo?", cat:"Volver al cuerpo"});
tranquilidadBodyDets = {next: "s_s_backToTheMoment.html",
	prev: "index.html",
	thisIs: "s_s_backToTheBody.html",
	audios:"backToTheBody",
	cat: "Tranquilidad",
	subCat: "Volver al cuerpo"};

// Samatha 2 - Momento
var tranquilidadMomento = [];
tranquilidadMomento.push({desc:"¿Cómo se siente este momento?", cat:"Volver al momento"});
tranquilidadMomento.push({desc:"¿Hacia dónde se dirige el presente?", cat:"Volver al momento"});
tranquilidadMomento.push({desc:"¿Cuánto tiempo dura este instante?", cat:"Volver al momento"});
tranquilidadMomentoDets = {next: "s_s_backToTheMind.html", 
	prev: "s_s_backToTheBody.html",
	thisIs: "s_s_backToTheMoment.html",
	audios:"backToTheMoment",
	cat: "Tranquilidad",
	subCat: "Volver al momento"};

// Samatha 3 - Mente
var tranquilidadMente = [];
tranquilidadMente.push({desc:"¿Quién piensa?"});
tranquilidadMente.push({desc:"¿Dónde está el pensamiento?"});
tranquilidadMente.push({desc:"¿Cómo se siente la mente?"});
tranquilidadMenteDets = {next: "end.html", 
	prev: "s_s_backToTheMoment.html",
	thisIs: "s_s_backToTheMind.html",
	audios:"backToTheMind",
	cat: "Tranquilidad",
	subCat: "Volver a la mente"};

// Set sessions details
function setSessionDetails(subjects, subjectsDets){

	getSessionId();

	console.log("Setting subjects with sessionId: " + sessionId);

	// Did I go too far?
	if(sessionId > (Object.keys(subjects).length - 1)){
		console.log("The person is requesting a page beyond the scope of this session, I will reach my end");
		sessionId = (Object.keys(subjects).length - 1);
	}

	console.log("Setting subjects width sessionId: " + sessionId);

	$("#sessionId").text(parseInt(sessionId) + 1);
	$("#sessionDesc").text(subjects[sessionId].desc);
	$("#meditationSource").attr("src", "audio/meditations/" + subjectsDets.audios + "_" + sessionId + ".mp3").detach().appendTo("#meditationPlayer");;

	// Next and back
	// If this is the end, I will use the next section
	if(sessionId == (Object.keys(subjects).length - 1)){
		console.log("I am at my limit, I will link to the next section");
		$("#nextSession").attr("href", subjectsDets.next);
		$("#nextSession").attr("onClick", "setId(0);");
	}
	else{
		console.log("I still have things to do here");
		$("#nextSession").attr("href", subjectsDets.thisIs + "?id=" + (1 + parseInt(sessionId)));
		$("#nextSession").attr("onClick", "setId(" + (1 + parseInt(sessionId)) + ");");
	}
	// If this is the first id I will link to the previews section
	if(sessionId == 0){
		console.log("I am at the beggining, I will ink to the previews section");
		$("#prevSession").attr("href", subjectsDets.prev);
		$("#prevSession").attr("onClick", "setId(-1);");
	}
	else{
		console.log("I am somewhere in the middle of this section");
		$("#prevSession").attr("href", subjectsDets.thisIs + "?id=" + (sessionId - 1));
		$("#prevSession").attr("onClick", "setId(" + (sessionId - 1) + ");");
	}

}

// Set the id of the new section that is comming
function setId(newSessionId){
	console.log("Setting the sessionId: " + newSessionId);
	storeKey("sessionId", newSessionId);
}

// Add meditation times to the causes
function addToCause(time){

	console.log("I will try to submit this to the repository");

	if(checkConnection(false) == false){
		console.log("No connectivity");
		alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
		return false;
	}

	console.log("There is connexion, lets send the details");

	$.ajax({
		type: 'POST',
		url: apiPath,
		dataType: "json",
		data: {
			what: "addToCause",
		causeCode: $('#cause').val(),
		totalTime: time,
		where: getKey("myCountry", "Nibbana"),
		email: getKey("myEmail", "buddha@lasangha.org")
		},
		success: function (data) {
			console.log(data)
		}
	});
}

function createChart(chartTitle, canvasId, chartLabels, chartData, type){

	console.log("Creating chart");

	var lineChartData = {
		labels : chartLabels,
		datasets : [
		{
			label: chartTitle,
			fillColor : "rgba(220,220,220,0.2)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			pointHighlightFill : "#fff",
			pointHighlightStroke : "rgba(220,220,220,1)",
			data : chartData
		}
		]
	}
	var ctx = document.getElementById(canvasId).getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {responsive: true});

}

// Get all meditation times per day
function getAllMeditationTimesPerDay(){

	if(checkConnection(false) == false){
		console.log("No connectivity");
		alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
		return false;
	}

	console.log("There is connexion, lets get the times");

	$.ajax({
		type: 'GET',
		url: apiPath,
		dataType: "json",
		data: {
			what: "getAllMeditationTimesPerDay",
			ini: 7, //Start 7 days ago
		},
		success: function (details) {
			createChart("Meditaciones grupales por día", "myChart", details.labels, details.times, 'lines');
		}
	});

}

// Get my meditation times per day
function getMyMeditationTimesPerDay(){

	if(checkConnection(false) == false){
		console.log("No connectivity");
		alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
		return false;
	}

	console.log("There is connexion, lets get the times");

	$.ajax({
		type: 'GET',
		url: apiPath,
		dataType: "json",
		data: {
			what: "getMyMeditationTimes",
			ini: 7, //Start 7 days ago
			email: getKey("myEmail", "buddha@lasangha.org")
		},
		success: function (details) {
			createChart("Meditación por día", "myChart", details.labels, details.times, 'lines');
			console.log("Esta es la data" + details.times);
		}
	});

}

// I should be able to get a file path
// Not really working
function getFile(file){
	console.log("Loading a file?");
	var reader = new FileReader();
	reader.onloadend = function (evt) {
		console.log("read success");
		console.log(evt.target.result);
	};
	reader.readAsDataURL(file);
}

function playAudio(id) {
	var audioElement = document.getElementById(id);
	var url = audioElement.getAttribute('src');
	console.log("Playing this: " + url);

	// The path must be updated in case of mobile cases
	url = adjustPaths(url);

	console.log(">>>>>" + cordova.file.applicationDirectory + '/www/audio/bell_2.mp3');
	var my_media = new Media(url,
			// success callback
			function () { console.log("playAudio():Audio Success"); },
			// error callback
			function (err) { console.log("playAudio():Audio Error: " + JSON.stringify(err)); }
			);
	// Play audio
	my_media.play();
}

function adjustPaths(url){

	// I need to test this on other platforms
	if(device.platform.toLowerCase() === "android"){
		console.log("Running on android");
		url = cordova.file.applicationDirectory + url;
	}

	return url;

}

// I retrieve the medatitation with most meditated time
function getMeditationMaxCauseTime(){

	console.log("I will get the cause with more minutes meditated");

	if(checkConnection() == true){
		console.log("Getting times");

		//Lets make the connection
		$.ajax({
			type: 'GET',
			url: apiPath,
			dataType: "json",
			data: {
				what: "getCausesTimesMax",
			},
			success: function (data) {
				$("#causesTotalMinutes").html(data.totalTime);
				$("#causesCause").html(data.name);
				console.log("Got:" + JSON.stringify(data));
				console.log(data.totalTime)
			},
			fail: function(){
				console.log("Something wrong?");
			}
		});
	}
	else{
		console.log("Unable to get meditation causes");
		return false;

	}

}
// I retrieve the medatitation times for each cause
function getMeditationCausesTimes(){

	console.log("I will get the meditation times");

	if(checkConnection() == true){
		console.log("Getting times");

		//Lets make the connection
		$.ajax({
			type: 'GET',
			url: apiPath,
			dataType: "json",
			data: {
				what: "getCausesTimes",
			},
			success: function (data) {
				console.log(data)
			},
			fail: function(){
				console.log("Something wrong?");
			}
		});
	}
	else{
		console.log("Unable to get meditation causes");
		return false;

	}
	console.log("Done macarron");
}

