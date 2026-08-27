import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question, QuizSubmission, ResultResponse } from '../models/quiz.model';
import { environment } from '../../../environments/environment';

@Service()
export class QuizService {
  private readonly http = inject(HttpClient);

  // Backend API endpoints configuration
  private readonly apiUrl = environment.apiUrl;
  private readonly submitUrl = `${environment.apiUrl}/submit`;
  /**
   * Fetches the list of quiz questions from the backend.
   */
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  /**
   * Submits user answers to the backend for evaluation.
   */
  submitQuiz(submission: QuizSubmission): Observable<ResultResponse> {
    return this.http.post<ResultResponse>(this.submitUrl, submission);
  }
}
