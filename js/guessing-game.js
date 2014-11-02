var myNumber = Math.floor((Math.random() * 100) +1);
var myGuessArray = [];
var $guessInput = $("#guess-input");
var count = 5; // Need to do count-- somewhere for count > 
var $displayResultContainer = $("<p></p>");
var $successOverlay = $('<div id="overlay"><div id="overlay-container"><h1>Good job!</h1><h2>You got the right answer.</h2><button type="button" id="play-again"><a href="index.html">Play again</a></button></div></div>');
var $failureOverlay = $('<div id="overlay"><div id="overlay-container"><h1>Oh no!</h1><h2>You ran out of guesses. The correct answer was ' + myNumber + '.</h2><button type="button" id="play-again"><a href="index.html">Play again</a></button></div></div>');
var $giveUpOverlay = $('<div id="overlay"><div id="overlay-container"><h1>Seriously?</h1><h2>You still had ' + count + ' guesses left! The correct answer was ' + myNumber + '.</h2><button type="button" id="play-again">Play again</button></div></div>');

//window.location = document.location.href

function guessIsANumber() {
	return $.isNumeric($guessInput.val());
}

function guessIsValid() {
	if ($guessInput.val() >= 1) {
		return $guessInput.val() <= 100;
	}
}

function guessIsDecimal() {
	var isDecimal = false;

	for (var count = 0; count < $guessInput.val().length; count++) {
		if ($guessInput.val().charAt(count) == ".") {
			isDecimal = true;
		}
	}

	return isDecimal;
}

function guessIsDuplicate() {
	var isDuplicate = false;

	for (var count = 0; count < myGuessArray.length; count++) {
		if ($guessInput.val() == myGuessArray[count]) {
			isDuplicate = true;
		}
	}

	return isDuplicate;
}

function guessIsCorrect() {
	return $guessInput.val() == myNumber;
}

function guessIsWithin5() {
	if ($guessInput.val() >= myNumber - 5) { 
		return $guessInput.val() <= myNumber + 5;
	}
}

function guessIsWithin10() {
	if ($guessInput.val() >= myNumber - 10) { 
		return $guessInput.val() <= myNumber + 10;
	}
}

function guessIsWithin20() {
	if ($guessInput.val() >= myNumber - 20) { 
		return $guessInput.val() <= myNumber + 20;
	}
}

function guessIsWithin40() {
	if ($guessInput.val() >= myNumber - 40) { 
		return $guessInput.val() <= myNumber + 40;
	}
}

function guessIsHigher() {
	return $guessInput.val() > myNumber; //If true, "Guess lower". If false, "Guess higher"
}


//--------------------------------------------------------------------------------------------------------------

function guessIsWithinX() { // Returns a string that is that says how hot/cold 
	if (guessIsWithin5()) {
		$("#countdown-hint").css( "background-color", "#F2C809" );
		return "Plasma state! ";
	}
	else if (guessIsWithin10()) {
		$("#countdown-hint").css( "background-color", "#F29909" );
		return "Hot! ";
	}
	else if (guessIsWithin20()) {
		$("#countdown-hint").css( "background-color", "#F27609" );
		return "Warm(ish). ";
	}
	else if (guessIsWithin40()) {
		$("#countdown-hint").css( "background-color", "#627EDA" );
		return "Cold. ";
	}
	else {
		$("#countdown-hint").css( "background-color", "#2D3C6D" );
		return "Freezing! "
	}
}

function displayResult() { // Returns a string that helps guesser with next guess
	if (guessIsANumber()) {
		if (guessIsValid()) {
			if (guessIsHigher()) {
				return guessIsWithinX() + "Guess lower.";
			}
			else {
				return guessIsWithinX() + "Guess higher.";
			}
		}
		else { //if guess is not within 1-100
			$("#countdown-hint").css( "background-color", "#D52323" );
			return "Oops! That's not a number from 1-100."
		}
	}
	else { //if guess is not a number
		$("#countdown-hint").css( "background-color", "#D52323" );
		return "Oops! That's not a number from 1-100."
	}
}

$("#guess-submit").click(function() {

	var $newRow = $('<ul><li class="col-1"><h2>' + $guessInput.val() + '</h2></li><li class="col-2"><h2>' + displayResult() + '</h2></li></ul><hr>');

	if (guessIsCorrect()) { //Did you get the right answer?
		$successOverlay.hide();
		$("input").attr("disabled", true);
		$("body").append($successOverlay);
		$successOverlay.fadeIn();
	}
	else if (guessIsDuplicate()) {
		$("#countdown-hint").css( "background-color", "#D52323" );
		$("#countdown-hint p").replaceWith("<p>Oops! You've already guessed that number.</p>");
		$guessInput.val(''); //Reset input box;
	}
	else if (guessIsANumber()) { //Is guess a number?
		if (guessIsValid()) { //Is guess a *VALID* number?
			if (guessIsDecimal()) {
				$("#countdown-hint").css( "background-color", "#D52323" );
				$("#countdown-hint p").replaceWith("<p>Hey now, whole numbers only.</p>");
				$guessInput.val(''); //Reset input box;
			}
			else {	
				count--; //If guess is valid, do these things:
				$("#countdown-number h1").replaceWith("<h1>" + count + "</h1>"); //Update count
				$newRow.hide();
				$("#countdown-hint p").replaceWith("<p>" + displayResult() + "</p>"); //Show hint
				$("#guess-history").append($newRow); //Add guess to guess history
				$newRow.slideDown(300);
				myGuessArray.push($guessInput.val());
				$guessInput.val(''); //Reset input box;

				if (count === 0) { //Are you out of turns?
					$failureOverlay.hide();
					$("input").attr("disabled", true);
					$("body").append($failureOverlay);
					$failureOverlay.fadeIn();
				}
			}	
		}
		else { //Oops! not a number from 1-100
			$("#countdown-hint p").replaceWith("<p>" + displayResult() + "</p>");
			$guessInput.val(''); //Reset input box;
		}	
	}
	else { //Oops! not a number
		$("#countdown-hint p").replaceWith("<p>" + displayResult() + "</p>");
		$guessInput.val(''); //Reset input box;
	}
});

$guessInput.keydown(function(defaultEvent){
    if(defaultEvent.keyCode == 13) {
    	defaultEvent.preventDefault();
        $("#guess-submit").click();
    }
});

$("#guess-answer").click(function() {
    $giveUpOverlay.hide();
	$("input").attr("disabled", true);
	$("body").append($giveUpOverlay);
	$giveUpOverlay.fadeIn();
});

$("body").on('click', "#play-again", function() { //use parent element like body and do .on('click')
	window.location = document.location.href;
	console.log("yay");
});

// $("#play-again").click(function() { //use parent element like body and do .on('click')
// 	// window.location = document.location.href;
// 	console.log("yay");
// });



// //Give Up Button: 
// On click, create overlay with the answer and a 'new game' Button
// **DO NOT LET USER CLICK OFF OF OVERLAY**









