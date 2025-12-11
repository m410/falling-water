import { Component, ViewEncapsulation } from '@angular/core';
import { Builder } from "../builder/builder";

@Component({
  imports: [Builder],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
})
export class Home {}
