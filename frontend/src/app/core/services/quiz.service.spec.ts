import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { QuizService } from './quiz.service';
import { Question, QuizSubmission, ResultResponse } from '../models/quiz.model';

describe('QuizService', () => {
  let service: QuizService;
  let httpMock: HttpTestingController;

  const mockQuestions: Question[] = [
    {
      id: 1,
      question: 'What is 2 + 2?',
      options: ['3', '4', '5'],
    },
  ];

  const mockSubmission: QuizSubmission = {
    answers: { 1: 1 },
  };

  const mockResult: ResultResponse = {
    score: 1,
    total: 1,
    results: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuizService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(QuizService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensures that there are no outstanding HTTP requests after each test
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQuestions', () => {
    it('should fetch questions from the correct API endpoint via GET', () => {
      service.getQuestions().subscribe((questions) => {
        expect(questions).toEqual(mockQuestions);
        expect(questions.length).toBe(1);
      });

      const req = httpMock.expectOne('http://127.0.0.1:5000/api/quiz');
      expect(req.request.method).toBe('GET');
      req.flush(mockQuestions);
    });
  });

  describe('submitQuiz', () => {
    it('should send user answers to the submit endpoint via POST and return the result', () => {
      service.submitQuiz(mockSubmission).subscribe((result) => {
        expect(result).toEqual(mockResult);
        expect(result.score).toBe(1);
      });

      const req = httpMock.expectOne('http://127.0.0.1:5000/api/quiz/submit');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockSubmission);
      req.flush(mockResult);
    });
  });
});
