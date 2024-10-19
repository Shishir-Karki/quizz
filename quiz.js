let Questions = [];
let currentQuestion = 0;
let score = 0;
const quesTag = document.getElementById("ques");
const opt = document.getElementById("opt");

// Fetch questions
async function fetchQuestions() {
  try {
    const resp = await fetch("https://opentdb.com/api.php?amount=10");
    if (!resp.ok) {
      throw new Error("Couldn't fetch questions");
    }
    const data = await resp.json();
    Questions = data.results;
    loadQues();
  } catch (err) {
    console.error(err);
    quesTag.innerHTML = `<h5>${err.message}</h5>`;
  }
}

// Shuffle the options array
function shuffleOptions(options) {
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
}

// Load the current question and options
function loadQues() {
  if (Questions.length === 0) {
    quesTag.innerHTML = `<h5>Please wait, questions are loading...</h5>`;
    return;
  }
  
  const currentQuestext = Questions[currentQuestion].question;
  const correctAnswer = Questions[currentQuestion].correct_answer;
  const incorrectAnswers = Questions[currentQuestion].incorrect_answers;
  const options = [correctAnswer, ...incorrectAnswers];
  
  shuffleOptions(options); // Shuffle the options array

  quesTag.innerHTML = currentQuestext;
  opt.innerHTML = ""; // Clear previous options

  options.forEach((option, idx) => {
    const optDiv = document.createElement('div');
    const optTag = document.createElement('input');
    const labelTag = document.createElement('label');

    optTag.type = 'radio';
    optTag.name = 'answer';
    optTag.value = option;
    optTag.id = `option${idx}`;

    labelTag.textContent = option;
    labelTag.htmlFor = `option${idx}`;

    optDiv.appendChild(optTag);
    optDiv.appendChild(labelTag);
    opt.appendChild(optDiv);
  });
}

// Check if an answer is selected and move to the next question
function checkAnswer() {
  const selectedAns = document.querySelector('input[name="answer"]:checked');
  if (!selectedAns) {
    alert("Please select an answer before submitting.");
    return;
  }

  const answerValue = selectedAns.value;
  if (answerValue === Questions[currentQuestion].correct_answer) {
    score++;
  }

  nextQuestion();
}

// Load the previous question
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQues();
  }
}

// Move to the next question or show the final score
function nextQuestion() {
  if (currentQuestion < Questions.length - 1) {
    currentQuestion++;
    loadQues();
  } else {
    showTotal();
  }
}

// Show the final score and correct answers
function showTotal() {
  quesTag.style.display = "none";
  opt.style.display = "none";
  document.getElementById("btn").style.display = "none";
  document.getElementById("skpBtn").style.display = "none";
  document.getElementById("prevBtn").style.display = "none";

  const totalScore = document.getElementById("score");
  totalScore.innerHTML = `<h3>Your Score: ${score}/10</h3>`;
  Questions.forEach((ques, idx) => {
    totalScore.innerHTML += `<p>Q${idx + 1}: ${ques.correct_answer}</p>`;
  });

  document.getElementById("restartBtn").style.display = "inline-block";
}

// Restart the quiz
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quesTag.style.display = "block";
  opt.style.display = "block";
  document.getElementById("btn").style.display = "inline-block";
  document.getElementById("skpBtn").style.display = "inline-block";
  document.getElementById("prevBtn").style.display = "none";
  document.getElementById("restartBtn").style.display = "none";
  document.getElementById("score").innerHTML = ""; // Clear score display

  fetchQuestions();
}

// Start the game by fetching questions
fetchQuestions();
