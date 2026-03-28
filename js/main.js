class CSKQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.timer = null;
        this.answered = false;
        this.init();
    }

    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.displayQuestion();
    }

    async loadQuestions() {
        try {
            const response = await fetch('data/questions.json');
            this.questions = await response.json();
            document.getElementById('totalQuestions').textContent = this.questions.length;
            document.getElementById('total').textContent = this.questions.length;
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

    setupEventListeners() {
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitQuiz());
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) return;

        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('questionText').textContent = question.question;
        
        // Display image if it exists
        const mediaSection = document.getElementById('mediaSection');
        if (question.image) {
            mediaSection.innerHTML = `<img src="${question.image}" alt="Question image" style="max-width: 100%; height: auto; border-radius: 8px;">`;
        } else {
            mediaSection.innerHTML = '';
        }
        
        this.displayOptions(question);
        this.updateButtons();
        this.answered = false;
        this.setupTimer(30);
    }

    displayOptions(question) {
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => this.selectAnswer(index, button));
            optionsContainer.appendChild(button);
        });
    }

    selectAnswer(index, button) {
        if (this.answered) return;

        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        button.classList.add('selected');
        this.userAnswers[this.currentQuestionIndex] = index;
        this.answered = true;

        // Update score display immediately
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if (index === currentQuestion.answer) {
            this.score++;
            document.getElementById('score').textContent = this.score;
        }

        if (this.timer) {
            this.timer.stop();
        }

        document.getElementById('nextBtn').disabled = false;
    }

    setupTimer(duration) {
        if (this.timer) {
            this.timer.stop();
        }

        this.timer = new QuizTimer(duration);

        this.timer.onTick = (remaining) => {
            document.getElementById('timer').textContent = this.timer.getFormattedTime();

            if (remaining <= 10) {
                document.getElementById('timer').classList.add('warning');
            } else {
                document.getElementById('timer').classList.remove('warning');
            }
        };

        this.timer.onTimeUp = () => {
            if (!this.answered) {
                this.nextQuestion();
            }
        };

        this.timer.start();
    }

    updateButtons() {
        const isFirst = this.currentQuestionIndex === 0;
        const isLast = this.currentQuestionIndex === this.questions.length - 1;

        document.getElementById('prevBtn').disabled = isFirst;
        document.getElementById('nextBtn').disabled = !this.answered;
        document.getElementById('nextBtn').style.display = isLast ? 'none' : 'block';
        document.getElementById('submitBtn').style.display = isLast && this.answered ? 'block' : 'none';
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    submitQuiz() {
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        this.questions.forEach((question, index) => {
            if (this.userAnswers[index] === question.answer) {
                this.score++;
            }
        });
    }

    showResults() {
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalTotal').textContent = this.questions.length;
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        document.getElementById('percentage').textContent = `${percentage}% Correct`;

        if (this.timer) {
            this.timer.stop();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CSKQuiz();
});
