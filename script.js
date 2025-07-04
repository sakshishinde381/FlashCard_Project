// 📌 DOM References
const form = document.getElementById('flashcardForm');
const termInput = document.getElementById('term');
const defInput = document.getElementById('definition');
const container = document.getElementById('flashcardsContainer');

const startQuizBtn = document.getElementById('startQuizBtn');
const quizContainer = document.getElementById('quizContainer');
const quizCard = document.getElementById('quizCard');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const nextCardBtn = document.getElementById('nextCardBtn');
const quizProgress = document.getElementById('quizProgress');

// (Optional) Exit Quiz Button (if added in HTML)
const exitQuizBtn = document.getElementById('exitQuizBtn');

// 📌 Load flashcards from localStorage
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
renderFlashcards();

// 📌 Handle Flashcard Form Submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const card = {
    term: termInput.value.trim(),
    definition: defInput.value.trim()
  };

  if (!card.term || !card.definition) return; // Prevent empty cards

  flashcards.push(card);
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
  termInput.value = '';
  defInput.value = '';
  renderFlashcards();
});

// 📌 Render All Flashcards
function renderFlashcards() {
  container.innerHTML = '';
  flashcards.forEach((card, index) => {
    const flashcard = document.createElement('div');
    flashcard.className = 'flashcard';

    const inner = document.createElement('div');
    inner.className = 'flashcard-inner';

    const front = document.createElement('div');
    front.className = 'flashcard-front';
    front.textContent = card.term;

    const back = document.createElement('div');
    back.className = 'flashcard-back';
    back.textContent = card.definition;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      flashcards.splice(index, 1);
      localStorage.setItem('flashcards', JSON.stringify(flashcards));
      renderFlashcards();
    });

    flashcard.appendChild(deleteBtn);
    inner.appendChild(front);
    inner.appendChild(back);
    flashcard.appendChild(inner);

    flashcard.addEventListener('click', () => {
      flashcard.classList.toggle('flipped');
    });

    container.appendChild(flashcard);
  });

  // Ensure container is visible in case quiz ended
  container.style.display = 'flex';
  startQuizBtn.style.display = 'inline-block';
  if (exitQuizBtn) exitQuizBtn.style.display = 'none';
}

// ====================
// 📘 QUIZ MODE SECTION
// ====================
let currentQuizIndex = 0;
let quizCards = [];

startQuizBtn.addEventListener('click', () => {
  if (flashcards.length === 0) {
    alert('No flashcards available!');
    return;
  }

  quizCards = [...flashcards];
  currentQuizIndex = 0;
  showQuizCard();

  quizContainer.style.display = 'block';
  container.style.display = 'none';
  startQuizBtn.style.display = 'none';
  if (exitQuizBtn) exitQuizBtn.style.display = 'inline-block';
});

showAnswerBtn.addEventListener('click', () => {
  quizCard.innerText = quizCards[currentQuizIndex].definition;
  showAnswerBtn.style.display = 'none';
  nextCardBtn.style.display = 'inline-block';
});

nextCardBtn.addEventListener('click', () => {
  currentQuizIndex++;
  if (currentQuizIndex < quizCards.length) {
    showQuizCard();
  } else {
    quizCard.innerText = "🎉 You've completed the quiz!";
    showAnswerBtn.style.display = 'none';
    nextCardBtn.style.display = 'none';
    quizProgress.innerText = '';

    setTimeout(() => {
      quizContainer.style.display = 'none';
      renderFlashcards(); // Show normal cards again
    }, 1500);
  }
});

function showQuizCard() {
  const currentCard = quizCards[currentQuizIndex];
  quizCard.innerText = currentCard.term;
  showAnswerBtn.style.display = 'inline-block';
  nextCardBtn.style.display = 'none';
  quizProgress.innerText = `Card ${currentQuizIndex + 1} of ${quizCards.length}`;
}

// (Optional) Exit button handling
if (exitQuizBtn) {
  exitQuizBtn.addEventListener('click', () => {
    quizContainer.style.display = 'none';
    renderFlashcards();
  });
}
