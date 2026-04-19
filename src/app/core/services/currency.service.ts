import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CurrencyConfig } from '../models/currency.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private currencySignal: WritableSignal<CurrencyConfig> = signal({
    code: 'en-US',
    locale: 'USD',
    name: 'US dollars',
    symbol: '$'
  });
  public currency: Signal<CurrencyConfig> = this.currencySignal.asReadonly();

  public setCurrentCurrency(newCurrency: CurrencyConfig) {
    this.currencySignal.set(newCurrency);
  }
}
