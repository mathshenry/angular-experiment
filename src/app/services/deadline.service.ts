import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from '@angular/core';
import { catchError, delay, finalize, Observable, of } from "rxjs";
import { environment } from "../environments/environment";
import { DeadlineResponse } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {
  public secondsLeft = signal<number>(0);
  // The  error could  hold  the  message, but as this is simple, let's just record there is an error
  public hasError = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  
  private readonly httpClient = inject(HttpClient);

  public fetchDeadline(): void {
    this.isLoading.set(true);
    let requestData = this.httpClient.get<DeadlineResponse>('/api/deadline');

    if (environment.mock) {
      requestData = this.mockData();
    }

    requestData.pipe(
      catchError((err) => {
        // There could be a service for proper logging
        console.error(err);
        this.hasError.set(true);
        return of({secondsLeft: 0});
      }),
      finalize(() => this.isLoading.set(false))
    )
      .subscribe((response) => {
        if (Number.isInteger(response.secondsLeft)) {
          this.secondsLeft.set(response.secondsLeft);
        }
      })
  }

  // I could've created a mock server, but this is simpler for time sake
  private mockData(): Observable<DeadlineResponse> {
    return of({
      secondsLeft: Math.round(Math.random() * 10 + 10)
    }).pipe(
      delay(Math.round(Math.random() * environment.mockMaximumDelay))
    )
  }
}
