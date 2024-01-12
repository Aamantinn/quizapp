// Global variables
const startButton: HTMLElement | null = document.getElementById("start-btn");
const questionContainer: HTMLElement | null = document.getElementById("question-container");
const questionElement: HTMLElement | null = document.getElementById("question");
const answerButtons: HTMLElement | null = document.getElementById("answer-buttons");
const nextButton: HTMLElement | null = document.getElementById("next-btn");
const restartButton: HTMLElement | null = document.getElementById("restart-btn");
const resultDiv: HTMLElement | null = document.getElementById("result");
const quizContainer: HTMLElement | null = document.getElementById("quiz-container");
const progressBar: HTMLElement | null = document.getElementById("progress-bar");
const usernameInput: HTMLInputElement | null = document.getElementById("username") as HTMLInputElement;
const showAnswersButton: HTMLElement | null = document.getElementById("show-answers-btn");
const addQuestionButton: HTMLElement | null = document.getElementById("add-question-btn");
const usernamelabel: HTMLElement | null = document.getElementById("username-label");
const displayQuestions: HTMLElement | null = document.getElementById("display-answers");
const successMessage: HTMLElement | null = document.getElementById("usernameSuccessMessage");
const answerRestartButton: HTMLElement | null = document.getElementById("answer-restart");
const title: HTMLElement | null = document.getElementById("title");

let shuffledQuestions: Array<Question>, currentQuestionIndex: number, score: number;

// Interface for a question
interface Question {
  question: string;
  answers: Array<Answer>;
}

// Interface for an answer
interface Answer {
  text: string;
  correct: boolean;
}

// Array of quiz questions
const questions: Array<Question> =  [
  {
    question: "Who is the rightful heir to the Iron Throne?",
    answers: [
      { text: "Jon Snow", correct: true },
      { text: "Daenerys Targaryen", correct: false },
      { text: "Cersei Lannister", correct: false },
      { text: "Gendry Baratheon", correct: false },
    ],
  },
  {
    question: "What is the name of Arya Stark's sword?",
    answers: [
      { text: "Needle", correct: true },
      { text: "Ice", correct: false },
      { text: "Oathkeeper", correct: false },
      { text: "Longclaw", correct: false },
    ],
  },
  {
    question: "Who is known as the 'Three-Eyed Raven'?",
    answers: [
      { text: "Bran Stark", correct: true },
      { text: "Jojen Reed", correct: false },
      { text: "The Night King", correct: false },
      { text: "Hodor", correct: false },
    ],
  },
  {
    question: "What is the primary religion in the Seven Kingdoms?",
    answers: [
      { text: "Faith of the Seven", correct: true },
      { text: "Old Gods of the Forest", correct: false },
      { text: "Lord of Light (R'hllor)", correct: false },
      { text: "Drowned God", correct: false },
    ],
  },
  {
    question: "Who killed Joffrey Baratheon at the Purple Wedding?",
    answers: [
      { text: "Olenna Tyrell", correct: true },
      { text: "Sansa Stark", correct: false },
      { text: "Tyrion Lannister", correct: false },
      { text: "Margaery Tyrell", correct: false },
    ],
  },
  {
    question: "What is the ancestral Valyrian steel sword of House Stark?",
    answers: [
      { text: "Ice", correct: false },
      { text: "Longclaw", correct: false },
      { text: "Dark Sister", correct: false },
      { text: "Blackfyre", correct: true },
    ],
  },
];

  const originalQuestions: Array<Question> = JSON.parse(JSON.stringify(questions));

// Event listener for starting the quiz
startButton?.addEventListener("click", startQuiz);

// Function to start the quiz
function startQuiz() {
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;

    if (!usernameInput) {
        console.error("Username input field not found.");
        return;
      }
    
      // Check if the username field is empty
      if (usernameInput.value.trim() === "") {
        // You can add custom error handling or messages here
        alert("Please enter your username.");
        return; // Prevent further execution of the function
      }
  
    // Retrieve the latest username from local storage
    const storedUsername = localStorage.getItem("latestUsername");
  
    // Store username
    const username = usernameInput?.value || storedUsername || "Anonymous";
    console.log("Username:", username);
  
    // Store the username in local storage
    localStorage.setItem("latestUsername", username);
  
    // Update UI
    if (startButton) startButton.style.display = "none";
    if (questionContainer) questionContainer.style.display = "flex";
    if (nextButton) nextButton.classList.remove("hidden");
    if (restartButton) restartButton.classList.add("hidden");
    if (resultDiv) resultDiv.classList.add("hidden");
    if (quizContainer) quizContainer.style.display = "flex";
    if (addQuestionButton) addQuestionButton.classList.add("hidden");
    if (usernameInput) usernameInput.classList.add("hidden");
    if (usernamelabel) usernamelabel.classList.add("hidden");
    if (displayQuestions) displayQuestions.classList.add("hidden");
    if (title) title.classList.add("hidden");
    if (answerRestartButton) answerRestartButton.classList.add("hidden")
    
  
    // Display the first question
    setNextQuestion();
  }
  

// Function to reset the quiz
function resetQuiz() {
// Restore the original set of questions  
questions.length = 0; // Clear the current array
  Array.prototype.push.apply(questions, JSON.parse(JSON.stringify(originalQuestions)));
    
    if (startButton) startButton.style.display = "block";
    if (nextButton) nextButton.classList.add("hidden");
    if (restartButton) restartButton.classList.add("hidden");
    if (resultDiv) resultDiv.classList.add("hidden");
    if (quizContainer) quizContainer.style.display = "flex";
    // if (addQuestionButton) addQuestionButton.classList.remove("hidden");
    if (usernameInput) {
      usernameInput.value = "";  // Reset the value
      usernameInput.classList.remove("hidden");
    }
    if (usernamelabel) usernamelabel.classList.remove("hidden");
    if (displayQuestions) {
        displayQuestions.classList.add("hidden");
        displayQuestions.classList.remove("flex"); 
    }
    if (answerRestartButton) answerRestartButton.classList.add("hidden");
    if (showAnswersButton) showAnswersButton.classList.remove("hidden");
    if (title) title.classList.remove("hidden");
    if (addQuestionButton) addQuestionButton.classList.remove("hidden");
    

    // Clear the stored username from local storage
    localStorage.removeItem("latestUsername");
  
    
    // Reset the result div to its initial state
  
  if (resultDiv) resultDiv.classList.add("hidden");

  if (successMessage) successMessage.innerHTML = "";
  
  }
  
  
  

// Function to set up the next question
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    updateProgressBar();
  }

  // Function to update the progress bar
  function updateProgressBar() {
    if (progressBar) {
      progressBar.innerText = `${currentQuestionIndex + 1}/${questions.length}`;
    }
  }

// Function to display a question and its answer buttons
function showQuestion(question: Question) {
  resetState();
  if (questionElement) questionElement.innerText = question.question;
  if (answerButtons) answerButtons.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.value = index.toString();
    button.classList.add(
      "block",
      "w-full",
      "cursor-pointer",
      "border-2",
      "md:text-lg",
      "text-sm",
      "rounded-lg",
      "p-3",
      "text-left",
      "font-semibold",
      "border-secondary"
    );
    button.innerText = answer.text;

    button.addEventListener("click", () => {
      if (button && !button.classList.contains("answered")) {
        button.classList.add("selected");
        if (answerButtons)
          answerButtons
            .querySelectorAll("button")
            .forEach((btn) => btn.classList.add("answered"));

        if (button && answer.correct) {
          if (button) button.classList.add("bg-green", "text-white");
        } else {
          if (button) button.classList.add("bg-red", "text-white");
          if (answerButtons)
            answerButtons
              .querySelector(
                `button[value="${question.answers.findIndex((a) => a.correct)}"]`
              )
              ?.classList.add("bg-green", "text-white");
        }

        if (answer.correct) {
          score++;
        }
      }
    });

    if (answerButtons) answerButtons.appendChild(button);
  });
}

// Function to reset the state of answer buttons
function resetState() {
  if (answerButtons)
    answerButtons.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove(
        "answered",
        "bg-green",
        "bg-red",
        "text-white"
      );
    });
}

// Event listener for the next button
nextButton?.addEventListener("click", () => {
    const selectedButton = answerButtons?.querySelector(".selected");
  
    if (selectedButton) {
        // Store the user's answer in localStorage before moving to the next question
        localStorage.setItem(`userAnswer_${currentQuestionIndex}`, (selectedButton as HTMLButtonElement).value);

        resetState();
        currentQuestionIndex++;

        if (shuffledQuestions.length > currentQuestionIndex) {
            setNextQuestion();
        } else {
            endQuiz();
        }
    } else {
        alert("Please select an answer.");
    }
  });
  

// Event listener for the restart button
restartButton?.addEventListener("click", resetQuiz);

// Function to display the final score and allow the user to restart the quiz
function endQuiz() {
    if (questionContainer) questionContainer.style.display = "none";
    if (nextButton) nextButton.classList.add("hidden");
    if (resultDiv) {
      resultDiv.classList.remove("hidden");
      resultDiv.classList.add("flex", "flex-col", "gap-8", "p-8");
    }
    if (displayQuestions) {
        displayQuestions.classList.add("hidden");
        displayQuestions.innerHTML = "";}
    if (answerRestartButton) answerRestartButton.classList.remove("hidden");

    // displaying the score
    const resultSpan = document.getElementById("resultSpan");
  
    // Retrieve the latest username from local storage
    const storedUsername = localStorage.getItem("latestUsername");
    const username = usernameInput?.value || storedUsername || "Anonymous";

    if (resultSpan)
        resultSpan.innerHTML = `${score}/<span class="text-primary">${questions.length}</span>`;

    // Store the latest username in local storage
    localStorage.setItem("latestUsername", username);

    
    restartButton?.classList.remove("hidden");

    // Display success message based on success rate
    displaySuccessMessage();
  }
  

// Add this function to display the success message
function displaySuccessMessage() {
    const storedUsername = localStorage.getItem("latestUsername");

    if (successMessage) {
        if (score === questions.length) {
            successMessage.textContent = `Quizmaster ${storedUsername || "Anonymous"}`;
        } else if (score / questions.length >= 0.5) {
            successMessage.textContent = `Wow, you're really good ${storedUsername || "Anonymous"}`;
        } else if (score / questions.length < 0.3) {
            successMessage.textContent = `Aww, try again! ${storedUsername || "Anonymous"}`;
        } else {
            successMessage.textContent = `It could be better ${storedUsername || "Anonymous"}`;
        }
    }

}

  
 

// Event listener for the "Show Answers" button
if (showAnswersButton) {
    showAnswersButton.addEventListener("click", () => {
      // Hide the resultDiv
      if (resultDiv) {
        resultDiv.classList.add("hidden");
      }
  
      // Show the displayQuestions div
      
      if (displayQuestions) {
        displayQuestions.classList.remove("hidden");
      }
      if (showAnswersButton) showAnswersButton.classList.add("hidden");
 
      
  
      // Call the showAnswers function when the button is pressed
      showAnswers();
    });
  }
  

  function showAnswers() {
    // Clear existing answers
    displayQuestions
    if (displayQuestions) {
        displayQuestions.innerHTML = "";
      
      questions.forEach((question, qIndex) => {
        const userAnswerValue = localStorage.getItem(`userAnswer_${qIndex}`);
        const userAnswerIndex = userAnswerValue !== null ? parseInt(userAnswerValue) : null;
  
        const button = document.createElement("button");
        button.type = "button";
        button.value = qIndex.toString(); // Set the value to the question index
        button.classList.add(
          "block",
          "w-full",
          "cursor-pointer",
          "border-2",
          "md:text-lg",
          "text-sm",
          "rounded-lg",
          "p-3",
          "text-left",
          "font-semibold"
        );
  
        if (userAnswerIndex !== undefined && userAnswerIndex !== null) {
          const isCorrect = question.answers[userAnswerIndex].correct;
  
          if (isCorrect) {
            button.style.backgroundColor = "green";
            button.style.color = "white";
          } else {
            button.style.backgroundColor = "red";
            button.style.color = "white";
          }
        }
  
        button.innerText = `${qIndex + 1}. ${question.question} - ${
          userAnswerIndex !== undefined && userAnswerIndex !== null
            ? question.answers[userAnswerIndex].text
            : "Not answered"
        }`;
        if (successMessage) successMessage.innerHTML = "";
       
        
  
        displayQuestions.appendChild(button);
        restartButton?.classList.remove("hidden");  
      });
    }
  }
  

  // Add this function to open the modal
  function openModal() {
    // Check if the username is provided
    const storedUsername = localStorage.getItem("latestUsername");
     usernameInput 
    const username = usernameInput?.value || storedUsername;
  
    if (!username || username.trim() === "") {
      // If the username is not provided, display an alert or handle it as needed
      alert("Please provide a username before adding a new question.");
      return;
    }

    // Clear input fields
    
    if (document.getElementById("newQuestion")) (document.getElementById("newQuestion") as HTMLInputElement).value = '';
    if (document.getElementById("option1")) (document.getElementById("option1") as HTMLInputElement).value = '';
    if (document.getElementById("option2")) (document.getElementById("option2") as HTMLInputElement).value = '';
    if (document.getElementById("option3")) (document.getElementById("option3") as HTMLInputElement).value = '';
    if (document.getElementById("option4")) (document.getElementById("option4") as HTMLInputElement).value = '';
  
    // Continue to open the modal
    const modal = document.getElementById("questionModal");
    if (modal) {
      modal.style.display = "flex";
    }
  }
  

// Add this function to close the modal
function closeModal() {
  const modal = document.getElementById("questionModal");
  if (modal) {
    modal.style.display = "none";
  }
}

// Add this function to submit the new question from the modal
function submitNewQuestion() {
  const newQuestionText = (document.getElementById("newQuestion") as HTMLInputElement).value;
  const option1 = (document.getElementById("option1") as HTMLInputElement).value;
  const option2 = (document.getElementById("option2") as HTMLInputElement).value;
  const option3 = (document.getElementById("option3") as HTMLInputElement).value;
  const correctOption = (document.getElementById("option4") as HTMLInputElement).value;

   // Check if any of the input fields are empty
   if (!newQuestionText || !option1 || !option2 || !option3 || !correctOption) {
    alert("Please fill in all fields before adding the question.");
    return;
  }

  // Create the new question object
  const newQuestion: Question = {
    question: newQuestionText,
    answers: [
      { text: option1, correct: false },
      { text: option2, correct: false },
      { text: option3, correct: false },
      { text: correctOption, correct: true },
    ],
  };

  // Add the new question to the array
  questions.push(newQuestion);
  console.log("New Question Added:", newQuestion);

  // Shuffle the order of answers for the last question in the array
  if (questions.length > 1) {
    const lastQuestion = questions[questions.length - 1];
    const shuffledAnswers = lastQuestion.answers.sort(() => Math.random() - 0.5);
    lastQuestion.answers = shuffledAnswers;
  }

  // Clear input values

  // Close the modal after adding the question
  closeModal();
}

