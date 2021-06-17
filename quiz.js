var score = 0;
var currentQuestion = 0;
var time = 0;
var timerInterval = null;
var quizEl = document.getElementById("quiz");
var linkEl = document.createElement("link");
var scriptEl = document.createElement("script");
var startBtnEl = document.createElement("button");
var questionEl = document.createElement("h2");
var answersEl = document.createElement("ol");
var counterEl = document.createElement("div");
var timeEl = document.createElement("div");
var scoreEl = document.createElement("div");
var nextBtnEl = document.createElement("button");
var verdictEl = document.createElement("p");
var questions = [];
var verdicts = [];

function init() {
    // Set start button text
    startBtnEl.textContent = "Aloita tietovisa";

    // Start button click event handler
    startBtnEl.onclick = function() {
        startQuiz();
    };
    
    // Remove loader
    quizEl.classList.remove("loading");

    // Append start button to DOM
    quizEl.appendChild(startBtnEl);
}

function startQuiz() {
    // Check that we have questions set
    if (! questions || questions.length == 0) {
        throw new Error("No questions set");
    }

    // Check that we have verdicts set
    if (! verdicts || verdicts.length == 0) {
        throw new Error("No verdicts set");
    }

    startBtnEl.classList.add("hidden");
    nextBtnEl.textContent = "Seuraava kysymys";

    quizEl.appendChild(counterEl);
    quizEl.appendChild(timeEl);
    quizEl.appendChild(scoreEl);
    quizEl.appendChild(questionEl);
    quizEl.appendChild(answersEl);
    quizEl.appendChild(verdictEl);
    quizEl.appendChild(nextBtnEl);

    updateScore();
    updateQuestion();
    updateTime();

    nextBtnEl.onclick = function() {
        currentQuestion++;
        updateQuestion();
    };

    // Start time counter
    timerInterval = setInterval(updateTime, 1000);
}

function updateTime() {
    //console.log("time: " + time);

    var hours = Math.floor(time / 60 / 60);
    var minutes = Math.floor(time / 60) - (hours * 60);
    var seconds = time % 60;

    timeEl.textContent = "Aika: " + padStartZero(hours) + ":" + padStartZero(minutes) + ":" + padStartZero(seconds);

    time++;
}

/**
 * Adds a leading zero if i is less than 10.
 * @param   {number}        i 
 * @returns {number|string}
 */
function padStartZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

/**
 * Updates current score to scoreEl in DOM.
 */
function updateScore() {
    scoreEl.textContent = "Pisteet: " + score;
}

/**
 * Updates question and answers to DOM based on currentQuestion value.
 */
function updateQuestion() {
    // Hide next question button
    nextBtnEl.classList.add("hidden");

    // Check if we've answered all questions already
    if (currentQuestion == questions.length) {
        console.log("Se oli viimeinen kysymys!");
        finalVerdict();
        return;
    }

    // Clear verdictEl text
    verdictEl.textContent = "";

    // Clear answersEl
    answersEl.innerHTML = "";
    answersEl.classList.remove("disabled");

    // Set current question to counterEl text
    counterEl.textContent = "Kysymys " + (currentQuestion + 1) + " / " + questions.length;

    // Set current question question text to questionEl textContent
    questionEl.textContent = questions[currentQuestion].question;

    // Loop through answers and create answer li elements
    for (var i in questions[currentQuestion].answers) {
        // Create new li element
        var li = document.createElement("li");

        // Set li element text from current question answers
        li.textContent = questions[currentQuestion].answers[i];

        // Set answer letter to data attribute value
        li.dataset.letter = i;

        // Li element click event handler
        li.onclick = function() {
            //console.log("Klikkasit vastausta " + this.dataset.letter + ": " + this.textContent);
            // Check answer only if answersEl is not disabled
            if (! answersEl.classList.contains("disabled")) {
                checkAnswer(this);
            }
        };

        // Append li element to answersEl
        answersEl.appendChild(li);
    }
}

/**
 * Checks if the answer was right or wrong.
 * @param {object} answerLi
 */
function checkAnswer(answerLi) {
    // Compare answer letter to current question correct answer
    if (answerLi.dataset.letter == questions[currentQuestion].correctAnswer) {
        console.log("Oikein!");
        verdictEl.textContent = "Oikein!";
        answerLi.classList.add("correct");
        score++;
        updateScore();
    } else {
        console.log("Väärin!");
        verdictEl.textContent = "Väärin!";
        answerLi.classList.add("wrong");
    }
    // Disable answers
    answersEl.classList.add("disabled");
    // Show next question button
    nextBtnEl.classList.remove("hidden");
    // Check if this was the last question
    if (currentQuestion == questions.length - 1) {
        // Stop timer
        clearInterval(timerInterval);
        // Change next question button text
        nextBtnEl.textContent = "Näytä tuomio";
    }
}

function finalVerdict() {
    // Hide question and answers
    questionEl.classList.add("hidden");
    answersEl.classList.add("hidden");

    verdictEl.textContent = "Sait " + score + " / " + questions.length + " pistettä. ";

    // Loop through verdicts array
    for (var i in verdicts) {
        // Check if score is enough for this verdict
        if (score >= verdicts[i].minScore) {
            // Right verdict found, set text and break loop
            verdictEl.textContent += verdicts[i].text;
            break;
        }
    }
}

// Show loader
quizEl.classList.add("loading");

// Set linkEl attributes
linkEl.rel = "stylesheet";
linkEl.href = quizEl.dataset.path + "quiz.css";

// Just testing onload handler
linkEl.onload = function() {
    console.log('Quiz styles loaded!');
};

// Append linkEl to DOM to load quiz stylesheet
document.head.appendChild(linkEl);

// Check if quizEl has data-config set
if (quizEl.dataset.config) {
    // Set scriptEl src attribute
    scriptEl.src = quizEl.dataset.config;
    // Config scriptEl load handler
    scriptEl.onload = function() {
        console.log("Quiz config loaded!");
        init();
    };
    // Append scriptEl to DOM
    document.body.appendChild(scriptEl);
} else {
    throw new Error("Config not set");
}
