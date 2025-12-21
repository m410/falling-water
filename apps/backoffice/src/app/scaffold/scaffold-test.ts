import { Component, ViewEncapsulation } from '@angular/core';
import { ScaffoldSidebar } from './scaffold-sidebar';
import { ScaffoldNav } from './scaffold-nav';
import { RouterOutlet } from '@angular/router';
import { ScaffoldTree } from './scaffold-tree';
import { ScaffoldMenu } from './scaffold-menu';
import { ScaffoldAutocomplete } from './scaffold-autocomplete';
import { ScaffoldLabel } from './scaffold-label';

@Component({
  selector: 'bo-scaffold-test',
  imports: [
    ScaffoldTree, ScaffoldMenu, ScaffoldAutocomplete
  ],
  template: `
    <h1 class="display-1 mb-3">testing</h1>
    <hr>
    <div class="row">
    <div class="col">
      <h1 class="display-3 mb-3">menu</h1>
      <bo-scaffold-menu></bo-scaffold-menu></div>
    <div class="col">
      <h1 class="display-3 mb-3">autocomplete</h1>
      <bo-scaffold-autocomplete></bo-scaffold-autocomplete>
    </div>
      <div class="row">
      <div class="col">
        <h1 class="display-3 mb-3">tree</h1>
        <bo-scaffold-tree></bo-scaffold-tree>
        <hr>
      </div>
      </div>
    <hr>
<!--      <div class="row">-->
<!--      <div class="col">-->
<!--        <bo-scaffold-label></bo-scaffold-label>-->
<!--      </div>-->
<!--      </div>-->
`,
  encapsulation: ViewEncapsulation.None
})
export class ScaffoldTest {
}
