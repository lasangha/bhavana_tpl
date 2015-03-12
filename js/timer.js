var timerRunning = false;
var secondsToGo = 0;
var runningAs = 'desktop';

function meditate(seconds){
	console.log("Starting the timer!");
	var liftoffTime = new Date();
	liftoffTime.setSeconds(liftoffTime.getSeconds() + Math.floor(seconds));
	$('#countDown').countdown({until: liftoffTime, onExpiry: finishMeditation, format: 'HMS'});
}

function finishMeditation(finished){
	secondsToGo = 0;
	// This is upside-down if finished is false it means that the timer did finish
	// I did not know how to send the parameter from the countdown function, so, this is the result
	if(!finished){
		// Sounds don't work the same on desktop and on mobile
		if(runningAs == 'desktop'){
			console.log("Playing audio as desktop");
			document.getElementById('bellSounds').play();
		}
		console.log("Finished meditation");
		alert("Terminamos");
		location.reload();
	}
}

function startToMeditate(){
	console.log("Seconds to go: " + secondsToGo);
	if(secondsToGo == 0){
		console.log("Meditation time!");
		// Get the meditation time
		secondsToGo = ($('#timeHours').val()*3600) +  ($('#timeMins').val()*60) + $('#timeSecs').val();
		console.log("I will meditate for: " + secondsToGo);
		$("#startToMeditateButton").val("Detener");
		if(secondsToGo > 0){
			meditate(secondsToGo);
		}
	}
	else{
		console.log("Timer is running, I can't start at this moment");
		finishMeditation(true);
	}
	return false;
}

/**
 * I will set the timer controls based on a setting
 */
function setTimerWithPreset(){
	// Get the values from the preset
	var preset = $("#timePreset").val();
	console.log("Time is: " + preset);
	getPartOfTime(preset);
}

function getPartOfTime(seconds){

	var hours = seconds/3600;

	if(hours > 0){
		hours = Math.floor(hours);
		console.log("There are hours: " + hours);
		seconds = seconds % 3600;
		console.log("Remaning seconds: " + seconds);
		// Set the timer
		$('#timeHours').val(hours);
	}
	else{
		$('#timeHours').val(0);
	}
	var minutes = seconds / 60;
	if(minutes > 0){
		minutes = Math.floor(minutes);
		console.log("There are minutes: " + minutes);
		seconds = seconds % 60;
		console.log("Remaning seconds: " + seconds);
		$('#timeMins').val(minutes);
	}
	else{
		$('#timeMins').val(0);
	}
	if(seconds > 0){
		$('#timeSecs').val(seconds);
	}
	else{
		$('#timeSecs').val(0);
	}
}

