import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  selector: 'bo-root',
  templateUrl: './app.html',
  encapsulation: ViewEncapsulation.None,
})
export class App {
  protected title = 'Falling Water - Backoffice';
}
