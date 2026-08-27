import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Quiz } from './quiz';
import { QuizService } from '../../core/services/quiz.service';
import { Question, ResultResponse } from '../../core/models/quiz.model';

describe('Quiz Component', () => {
  let component: Quiz;
  let quizServiceMock: { getQuestions: any; submitQuiz: any };

  const mockQuestions: Question[] = [
    {
      id: 1,
      question: 'What is 2 + 2?',
      options: ['3', '4', '5'],
    },
  ];

  const mockResult: ResultResponse = {
    score: 1,
    total: 1,
    results: [],
  };

  beforeEach(async () => {
    quizServiceMock = {
      getQuestions: vi.fn().mockReturnValue(of(mockQuestions)),
      submitQuiz: vi.fn().mockReturnValue(of(mockResult)),
    };

    await TestBed.configureTestingModule({
      imports: [Quiz],
      providers: [{ provide: QuizService, useValue: quizServiceMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(Quiz);
    component = fixture.componentInstance;
  });

  it('should create the component and fetch questions on init', () => {
    expect(component).toBeTruthy();
    expect(quizServiceMock.getQuestions).toHaveBeenCalled();
    expect(component.questions()).toEqual(mockQuestions);
    expect(component.loading()).toBe(false);
  });

  it('should handle error when fetching questions fails', () => {
    quizServiceMock.getQuestions.mockReturnValue(throwError(() => new Error('API Error')));

    // Создаем новый инстанс компонента для проверки ошибки при загрузке
    const fixture = TestBed.createComponent(Quiz);
    const errorComponent = fixture.componentInstance;

    expect(errorComponent.loading()).toBe(false);
    expect(errorComponent.errorMessage()).toContain('Не удалось загрузить вопросы');
  });

  it('should update user answers and computed hasAnswers signal', () => {
    expect(component.hasAnswers()).toBe(false);

    component.selectOption(1, 1);

    expect(component.userAnswers()).toEqual({ 1: 1 });
    expect(component.hasAnswers()).toBe(true);
  });

  it('should not update user answers if quiz is already submitted', () => {
    component.quizSubmitted.set(true);
    component.selectOption(1, 1);

    expect(component.userAnswers()).toEqual({});
  });

  it('should submit quiz successfully and update result state', () => {
    component.selectOption(1, 1);
    component.submitQuiz();

    expect(quizServiceMock.submitQuiz).toHaveBeenCalledWith({ answers: { 1: 1 } });
    expect(component.scoreResult()).toEqual(mockResult);
    expect(component.quizSubmitted()).toBe(true);
  });

  it('should reset quiz state correctly', () => {
    component.selectOption(1, 1);
    component.quizSubmitted.set(true);
    component.scoreResult.set(mockResult);

    component.resetQuiz();

    expect(component.userAnswers()).toEqual({});
    expect(component.quizSubmitted()).toBe(false);
    expect(component.scoreResult()).toBeNull();
  });
});
