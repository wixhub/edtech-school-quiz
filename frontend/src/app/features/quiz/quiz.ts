import { Component, signal, computed, inject } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { Question, ResultResponse } from '../../core/models/quiz.model';

@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
})
export class Quiz {
  private readonly quizService = inject(QuizService);

  // Component reactive state management using Signals
  readonly questions = signal<Question[]>([]);
  readonly userAnswers = signal<{ [key: number]: number }>({});
  readonly quizSubmitted = signal<boolean>(false);
  readonly scoreResult = signal<ResultResponse | null>(null);
  readonly loading = signal<boolean>(true);
  readonly errorMessage = signal<string>('');

  // Computed signal to check if the user has selected at least one answer
  readonly hasAnswers = computed(() => Object.keys(this.userAnswers()).length > 0);

  constructor() {
    this.fetchQuestions();
  }

  /**
   * Loads questions from the service.
   */
  private fetchQuestions(): void {
    this.quizService.getQuestions().subscribe({
      next: (data) => {
        this.questions.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load questions:', err);
        this.errorMessage.set('Не удалось загрузить вопросы. Проверьте подключение к бэкенду!');
        this.loading.set(false);
      },
    });
  }

  /**
   * Handles option selection for a specific question.
   */
  selectOption(questionId: number, optionIndex: number): void {
    if (!this.quizSubmitted()) {
      this.userAnswers.update((answers) => ({
        ...answers,
        [questionId]: optionIndex,
      }));
    }
  }

  /**
   * Submits the quiz answers for evaluation.
   */
  submitQuiz(): void {
    this.quizService.submitQuiz({ answers: this.userAnswers() }).subscribe({
      next: (result) => {
        this.scoreResult.set(result);
        this.quizSubmitted.set(true);
      },
      error: (err) => {
        console.error('Failed to submit quiz:', err);
        alert('Ошибка при отправке ответов. Попробуйте снова.');
      },
    });
  }

  /**
   * Resets the quiz state to start over.
   */
  resetQuiz(): void {
    this.userAnswers.set({});
    this.quizSubmitted.set(false);
    this.scoreResult.set(null);
  }
}
