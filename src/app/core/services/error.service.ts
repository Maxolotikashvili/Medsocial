import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessageSignal: WritableSignal<string | null> = signal<string | null>(null);
  public errorMessage = this.errorMessageSignal.asReadonly();

  constructor() {}

  public handleError(error: HttpErrorResponse) {
    let message = 'An unexpected error occurred';

    if (error.status < 500) {
      message = error.error?.detail || error.message;
    } else {
      message = error.statusText;
    }

    this.errorMessageSignal.set(message);
    console.error(error);

    setTimeout(() => {
      this.errorMessageSignal.set(null);
    }, 5000);
  }
}
