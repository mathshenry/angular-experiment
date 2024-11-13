import { Component, computed, effect, HostBinding, HostListener, input, Input, signal } from '@angular/core';

import { countdownBounce } from "../../animations";
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [],
  animations: [countdownBounce],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent {
  public hasError = input(false);
  public isLoading = input(false);

  protected readonly timeLeft = signal<number>(0);

  @HostBinding('@countdownBounce') 
  protected animationState: 'start' | 'done' = 'done';
  
  private countdownInterval?: number;

  constructor() {
    effect(() => {
      if (this.isLoading() || this.hasError()) {
        this.stopInterval();
      }
    });
  }

  // This is the easiest way to do this, since signalInput doesn't support the same structure yet afaik
  @Input()
  public set countdown(countdown: number) {
    this.timeLeft.set(countdown);
    this.startCountdownInterval();
  }

  // Since HostBinding still doesn't  work  with  signals,  we have this 'workaround'
  @HostBinding('class.error')
  private get errorStyle(): boolean {
    return this.hasError();
  }

  @HostListener('@countdownBounce.done', ['$event'])
  private updateAnimationState(): void {
    this.animationState = 'done';
  }

  protected warnStyle = computed(() => {
    return this.timeLeft() <= environment.warnValue;
  });

  private stopInterval(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdownInterval(): void {
    this.stopInterval();

    this.countdownInterval = window.setInterval(() => {
      if (this.timeLeft()! > 0) {
        this.animationState = 'start';
        this.timeLeft.set(this.timeLeft() - 1);
      }
      // Since it's  always 1s, no need to extract to another variable
    }, 1000);
  }
}
