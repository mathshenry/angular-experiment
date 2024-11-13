import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CountdownComponent } from "./components/countdown/countdown.component";
import { SoftwareCameraComponent } from "./components/software-camera/software-camera.component";
import { DeadlineService } from "./services/deadline.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountdownComponent, SoftwareCameraComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly deadlineService = inject(DeadlineService);

  protected fetchDeadline(): void {
    this.deadlineService.fetchDeadline();
  }
}
