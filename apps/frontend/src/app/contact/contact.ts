import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';


@Component({
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  encapsulation: ViewEncapsulation.None,
})
export class Contact {

  protected readonly form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(256)]),
    message: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(1024)]),
  });

  submit() {
    console.log('submit');
    this.form.markAllAsTouched();
    
    if (this.form.valid) {
      console.log('valid');
    }
  }

   protected invalid(arg0: string) {
    return this.form.get(arg0)?.invalid && this.form.get(arg0)?.touched
  }

  protected valid(arg0: string) {
    return this.form.get(arg0)?.valid && this.form.get(arg0)?.touched
  }
}
