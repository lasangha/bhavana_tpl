// Needed variables
var onApp = false;

// If you want me to run stuff, let me know

// Path to the api
var apiPath = "http://app.lasangha.org/api/api.php";
var soundsPath = "http://app.lasangha.org/www/audio/meditations/";

// The current audio file to be played
var audioFilePath = "";

/*****************************************************************************/
// Init sequence
//////////////////////////////////////////////////////////////////////////////
// If you want me to run stuff, let me know
var runMe = [storeThisPage, checkLogin, stopPlayer];

// This is where it should all begin
function initMe(){

	console.log("Booting up bhavana!!");

	if(onApp){
		console.log("Running on an app...");
	}
	else{
		console.log("Running on a stand alone...");
	}

	// Run things that people want me to run
	for(i = 0; i < runMe.length; i++){
		console.log("running...");
		justRunThis(runMe[i]);
	}

}

function justRunThis(what){
	what();
}

// End of init sequence
/*****************************************************************************/

/*****************************************************************************/
// Users and sessions
//////////////////////////////////////////////////////////////////////////////

// I'm I logged in?
function isLoggedIn(){
	if(getKey("myEmail", "buddha@lasangha.org") == "buddha@lasangha.org"){
		console.log("not logged in");
		return false;
	}else{
		console.log("logged in");
		return true;
	}
}

// Save user settings
function saveMySettings(settings, goTo, sayThanks){

	console.log("Saving settings");

	for (var key in settings) {
		if (settings.hasOwnProperty(key)) {
			storeKey(key, settings[key]);
		}
	}
	if(sayThanks){
		alert(sayThanks);
	}
	iGoTo(goTo);
}

// Save user settings
function saveMySettingsForm(){

	console.log("Saving settings");

	// If this is a new account, I will first try to register the user
	if(getKey("registering", "false")){
		registerMe();
	}
	else{
		_saveMySettings();
	}

	return false;
}

// Helper function to save settings located in the form
function _saveMySettings(goTo, sayThanks){
	saveMySettings({"myName": $("#name").val(), "myEmail": $("#email").val(), "myPwd": $("#pwd").val(), "myCountry": $("#country").val()}, goTo, sayThanks);
}

// I check if the user is logged in
function checkLogin(){

	var url = window.location.pathname;
	var filename = url.substring(url.lastIndexOf('/')+1);

	console.log("Checking login: " + filename);

	if(filename != "login.html" && filename != "preferences.html"){
		console.log("I must be logged in to see this page");
		if(isLoggedIn() == false){
			iGoTo("login.html");
		}
	}
}

function logOut(){

	var keys = ['myName', 'myPwd', 'myCountry', 'myPwd', 'myEmail', 'var_coordinatesLatitude', 'var_coordinatesLongitude'];

	for(i = 0; i < 7; i++){
		console.log("removing" + keys[i]);
		removeKey(keys[i]);
	}

	alert("Hasta luego :)");
	iGoTo("index.html");
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
		name: $("#name").val(),
		email: $("#email").val(),
		pwd: $("#pwd").val(),
		country: $("#countr").val(),
		},
		success: function (data) {
			console.log("Response is: " + data);
			if(data == 1){
				//alert("Gracias, el usuario ha sido creado.");
				_saveMySettings("index.html", "Gracias, el usuario ha sido creado.");
				removeKey("registering");
				//iGoTo("index.html");
				return true;
			}
			else if(data == 0){
				alert("Ya existe alguien registrado con ese correo electrónico");
				return false;
			}
		}
	});

	return false;

}

// Load them in the settings form
function loadMySettings(){
	console.log("Loading settings");

	// Is this a new user?
	if(getKey("myName", "buddha") == "buddha"){
		storeKey("registering", "true");
	}

	$("#name").val(getKey("myName", ""));
	$("#email").val(getKey("myEmail", ""));
	$("#country").val(getKey("myCountry", ""));

	return false;
}

function wrongPassword(){
	alert("Lo siento, pero esa contraseña no es correcta.");
}

// I log the account in
function logMeIn(callMe){

	console.log("Logging in the user" + apiPath);

	$.ajax({
		type: 'POST',
		url: apiPath,
		dataType: "json",
		data: {
			what: "logUserIn",
		email: $("#email").val(),
		pwd: $("#pwd").val()
		},
		success: function (data) {
			console.log("Response is:" + data);
			if(data.idUser > 0){
				console.log("User exists, I was able to login");
				var settings = {
					"myName": data.name,
		"myEmail": data.email,
		"myPwd": $("#pwd").val(),
		"myCountry": data.country
				};
				saveMySettings(settings, "index.html", "Bienvenido");
				//iGoTo("index.html");
				return true;
			}
			else if(data == "2"){
				alert("No existe un usuario registrado con ese correo electrónico");
			}
			else if(data == "0"){
				console.log("Wrong password, but the user exists");
				wrongPassword();
			}

		}
	});
	return false;
}


// End of users and sessions
/*****************************************************************************/

/*****************************************************************************/
// Tools
//////////////////////////////////////////////////////////////////////////////

// Alert stuff
function alertStuff(what){
	alert(what);
}

// I will redirect somewhere
function iGoTo(goTo){
	console.log("Going to: " + goTo);
	window.location.href = goTo;
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

function addPlayer(time){

	console.log("I am showing the player: " + audioFilePath + " time " + time);

	$('#theAudioPlayer').html('<audio src="' + audioFilePath + '" autoload="true" autoplay="true" id="audioFile" controls/>');

	if(time > 0){
		console.log("Add time to the causes");
		addToCause(time);
	}
}

// The timer stays in the page because of jquerymobile way of generating new pages, it is best to stop if it exists
function stopPlayer(){
	console.log("Stopping the player");
	$('#theAudioPlayer').html('<audio src=""></audio>');
}


function loadPlayer(){

	if($("#cause").val() == 0){
		stopPlayer();
	}
	else{
		addPlayer(10);
	}

}

// Load the details for the contact email
function loadMailDets(){
	$('#myName').val(getKey("myName"));
	$('#myEmail').val(getKey("myEmail"));
}

// Send a contact email
function sendMail(){

	console.log("Sending an email");
	console.log($('#myName').val());

	/*if(!checkConnection()){
	  console.log("No connectivity");
	  alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
	  return false;
	  }*/

	$.ajax({
		type: 'POST',
		url: 'http://app.lasangha.org/api/mailer.php',
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


// End of tools
/*****************************************************************************/


/*****************************************************************************/
// Navigation
//////////////////////////////////////////////////////////////////////////////

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

// End of navigation
/*****************************************************************************/

/*****************************************************************************/
// Storage
//////////////////////////////////////////////////////////////////////////////

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

function removeKey(theKey){
	console.log("Removing key: " + theKey);
	window.localStorage.removeItem(theKey);
}

// End of storage
/*****************************************************************************/

// I retrieve the medatitation with most meditated time
function getMeditationMaxCauseTime(){

	console.log("I will get the cause with more minutes meditated...");

	//if(checkConnection() == true){

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
		error: function(){
			console.log("Something wrong?");
		}
	});
	/*}
	  else{
	  console.log("Unable to get meditation causes");
	  return false;

	  }*/
}

/*****************************************************************************/
// Sessions
//////////////////////////////////////////////////////////////////////////////

// I will take you to the last visited page of the course
function gotoLastSessionPage(){

	// Where I'm I?
	var thisPage = document.URL;

	console.log("I am in page: " + thisPage);

	// Where was I?
	var lastValue = getKey("lastPage");

	// If there is a last location, I'll go there
	if(lastValue == null){
		console.log("Nothing set");
		iGoTo("s_i_intro.html");
	}
	else{
		console.log("Going to: " + lastValue);
		iGoTo(lastValue);
	}

	return false;

}

function getSessionId(){

	console.log("Getting the session Id");

	sessionId = getKey("sessionId");

	if(sessionId == null || sessionId < 0){
		sessionId = '0';
		storeKey("sessionId", sessionId);
	}
}
// Set the id of the new section that is comming
function setId(newSessionId){
	console.log("Setting the sessionId: " + newSessionId);
	storeKey("sessionId", newSessionId);
}

// Set sessions details
function setSessionDetails(subjects, subjectsDets){

	getSessionId();

	console.log("Setting subjects with sessionId: " + sessionId);

	// Did I go too far?
	if(sessionId > (Object.keys(subjects).length - 1)){
		console.log("The person is requesting a page beyond the scope of this session, I will reach my end");
		sessionId = (Object.keys(subjects).length - 1);
	}
	// Path to the audio
	audioFilePath = soundsPath + subjectsDets.audios + "_" + sessionId + ".mp3";

	console.log("Setting subjects width sessionId: " + sessionId);
	console.log("Audio file: " + audioFilePath);

	$("#sessionId").text(parseInt(sessionId) + 1);
	$("#sessionDesc").text(subjects[sessionId].desc);
	$("#meditationSource").attr("src", audioFilePath).detach().appendTo("#meditationPlayer");;

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
		console.log("I am at the beggining, I will link to the previews section");
		$("#prevSession").attr("href", subjectsDets.prev);
		$("#prevSession").attr("onClick", "setId(-1);");
	}
	else{
		console.log("I am somewhere in the middle of this section");
		$("#prevSession").attr("href", subjectsDets.thisIs + "?id=" + (sessionId - 1));
		$("#prevSession").attr("onClick", "setId(" + (sessionId - 1) + ");");
	}

}

// Add meditation times to the causes
function addToCause(time){

	console.log("I will submit this time to the causes");

	/*
	   if(checkConnection(false) == false){
	   console.log("No connectivity");
	   alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
	   return false;
	   }
	 */

	console.log("There is connexion, lets send the details");

	$.ajax({
		type: 'POST',
		url: apiPath,
		dataType: "json",
		data: {
			what: "addToCause",
			causeCode: $('#cause').val(),
			totalTime: time,
			email: getKey("myEmail", "buddha@lasangha.org"),
		},
		success: function (data) {
			console.log(data)
		}
	});
}

// End of sessions
/*****************************************************************************/


/*****************************************************************************/
// Reports/Charts
//////////////////////////////////////////////////////////////////////////////

function createChart(chartTitle, canvasId, chartLabels, chartData, type){

	console.log("Creating chart");

	console.log("hello >>>> " + chartLabels.length);

	if(chartLabels.length == 0){
		$("#myCharts").html("No hay datos en este momento");
	}else{

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
}

// Get all meditation times per day
function getAllMeditationTimesPerDay(){

	/*
	   if(checkConnection(false) == false){
	   console.log("No connectivity");
	   alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
	   return false;
	   }
	 */
	console.log("There is connexion, lets get the times");

	$.ajax({
		type: 'GET',
		url: apiPath,
		dataType: "json",
		data: {
			what: "getAllMeditationTimesPerDay",
		ini: 7, //Start 7 days ago
		},
		success: function (allDetails) {

			var newData = {
				labels: allDetails.dates,
		datasets: [
	{
		label: "Paz",
		fillColor: "rgba(220,220,220,0.2)",
		strokeColor: "rgba(255,255,153,1)",
		pointColor: "rgba(255,255,153,1)",
		pointStrokeColor: "#fff",
		pointHighlightFill: "#fff",
		pointHighlightStroke: "rgba(255,255,153,1)",
		data: allDetails.details['Paz']
	},
	{
		label: "Humildad",
		fillColor: "rgba(51,255,153,0.2)",
		strokeColor: "rgba(51,255,153,1)",
		pointColor: "rgba(51,255,153,1)",
		pointStrokeColor: "#fff",
		pointHighlightFill: "#fff",
		pointHighlightStroke: "rgba(51,255,153,1)",
		data: allDetails.details['Humildad']
	},
	{
		label: "Compasión",
		fillColor: "rgba(76,153,0,0.2)",
		strokeColor: "rgba(76,153,0,1)",
		pointColor: "rgba(76,153,0,1)",
		pointStrokeColor: "#fff",
		pointHighlightFill: "#fff",
		pointHighlightStroke: "rgba(76,153,0,1)",
		data: allDetails.details['Compasi\u00f3n']
	}
	]
			};
			//createChart("Meditaciones grupales por día", "myChart", details.labels, details.times, 'lines');
			var ctx = document.getElementById("myChart").getContext("2d");
			var options = {
				responsive: true,
				multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
				legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
			}
			window.myLine = new Chart(ctx).Line(newData, options);

		}
	});

}

// Get my meditation times per day
function getMyMeditationTimesPerDay(){
	/*
	   if(checkConnection(false) == false){
	   console.log("No connectivity");
	   alert("Lo sentimos, pero se requiere de una conexión a internet para llevar a cabo esta función.");
	   return false;
	   }
	 */
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
			//console.log("Esta es la data" + details.times);
		}
	});

}

function createMap(){

	console.log("creating the map");

	var styleFunction = function(feature, resolution) {
		style = [new ol.style.Style({
			image: new ol.style.Circle({
				radius: 25,
			fill: new ol.style.Fill({
				color: 'rgba(255, 153, 0, 0.4)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(255, 204, 0, 0.2)',
			width: 1
			})
			})
		})];
		return style;
	};

	var map = new ol.Map({
		target: 'myMap',
		layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM()
		}),
			new ol.layer.Vector({
				source: new ol.source.GeoJSON({
					projection: 'EPSG:3857',
					url: apiPath + '?what=getMeditationLocations'
				})
			})
	],
		view: new ol.View({
			center: [0, 0],
			zoom: 1
		}),
	});
}

// End of reports/charts
/*****************************************************************************/

function whereAmI(){

	if(onApp == true){
		console.log("I am on an app");

		$.getScript( "cordova.js", function( data, textStatus, jqxhr ) {
			document.addEventListener("deviceready", initMe, false);
			console.log(data); // Data returned
			console.log(textStatus); // Success
			console.log(jqxhr.status); // 200
			console.log("Load was performed.");
		});

	}else{
		console.log("I am on a computer");
		$(document).bind("pageinit", function() {
			initMe();
		});
	}
	/*
	   console.log("Where Am I? " + document.URL);

	   if(strpos(document.URL, "http://") !== false && strpos(document.URL, "https://") !== false){
	   onApp = true;
	   console.log("I am on an app");
	   document.addEventListener("deviceready", initMe, false);
	   }else{
	   console.log("I am on a computer");
	   $(document).ready(function($){
	   initMe();
	   });
	   }*/
}


