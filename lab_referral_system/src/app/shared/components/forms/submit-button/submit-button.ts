import { Component, input } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  imports: [],
  templateUrl: './submit-button.html'
})
export class SubmitButton {
    content = input.required<string>();
    title = input<string>('Submit button');
    loading = input<boolean>(false);
    disabled = input<boolean>(false);
}
