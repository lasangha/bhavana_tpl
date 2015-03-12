// Todays day of the month
var dayOfTheMonth = new Date().getDate();
console.log("Day of the month: " + dayOfTheMonth);
dayOfTheMonth = (Math.floor((Math.random() * 31) + 1));

// Add a list of for todays
var todoForToday = [];
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');
todoForToday.push('Haga esto...');

/**
 * Creates a list of posible subjects
 */
function getSubjects(){

	var subjects = ['Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad'];

	return subjects;

}

function getMessage(){

	var forTodayMessage = ['Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad',
		'Generosidad', 'Moral', 'Renunciamiento','Sabiduría', 'Energía', 'Paciencia', 'Honestidad', 'Determinación', 'Amor Compasivo', 'Serenidad'];

	return forTodayMessage;

}

function createSubject(){
	console.log("Creating the subject");
	subjects = getSubjects();
	console.log(subjects[dayOfTheMonth]);
	$("#forTodaySubject").html(subjects[dayOfTheMonth]);
	//$("#todoForToday").html(todoForToday[dayOfTheMonth]);
	//console.log("Image is: " + "img/forToday/"+dayOfTheMonth+".jpg");
	//$("#todaysImage").attr("src", "img/forToday/"+dayOfTheMonth+".jpg");

}


