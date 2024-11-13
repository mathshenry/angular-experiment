import {animate, AnimationTriggerMetadata, style, transition, trigger} from "@angular/animations";

export const countdownBounce: AnimationTriggerMetadata = trigger('countdownBounce', [
  transition('done => start', [
    style({
      'transform': 'scale(1.01)',
      'box-shadow': 'var(--default-box-shadow)',
    }),
    animate('300ms ease-in-out', style({'transform': 'scale(1)', 'box-shadow': 'var(--default-big-box-shadow)' }))
  ]),
]);
