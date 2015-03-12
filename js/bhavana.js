// I'm i running in a mobile device?
var mobile = true;
var thisPage = window.URL;
var lastPage = "";

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
		console.log("I am showing the player");
		$("#myPlayer").show();
	}

}

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

function gotoLastPage(){

	// Where I'm I?
	var thisPage = document.URL;

	console.log("I am in page: " + thisPage);

	// Where was I?
	var lastValue = getKey("lastPage");

	// If there is a last location, I'll go there
	if(lastValue == null){
		console.log("Nothing set");
		//storeKey("lastPage", thisPage);
		//storeKey("lastPage", "s_s_backToTheBody.html");
		window.location = "s_s_backToTheBody.html";
	}
	else{
		console.log("Going to: " + lastValue);
		window.location = lastValue;
		//storeKey("lastPage", thisPage);
	}
}

// Keys
function storeKey(key, value){
	var value = document.URL;
	console.log("Storing key: " + key);
	window.localStorage.setItem(key, value);
	return true;
}

function getKey(key){
	var value = window.localStorage.getItem(key);
	console.log("Gotten Key: " + key + " with value: " + value);
	return value;
}

// keyname is now equal to "key"
// value is now equal to "value"
//window.localStorage.removeItem("key");
//window.localStorage.setItem("key2", "value2");
//window.localStorage.clear();
// localStorage is now empty

