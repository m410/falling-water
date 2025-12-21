import { Component, signal, ViewEncapsulation } from '@angular/core';
import { ScaffoldSidebar } from './scaffold-sidebar';
import { ScaffoldNav } from './scaffold-nav';
import { RouterOutlet } from '@angular/router';
import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { NgTemplateOutlet } from '@angular/common';

type TreeNode = {
  name: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
  expanded?: boolean;
};

@Component({
  selector: 'bo-scaffold-tree',
  imports: [Tree, TreeItem, TreeItemGroup, NgTemplateOutlet],
  template: `
    <ul ngTree #tree="ngTree" [(values)]="selected" class="basic-tree">
      <ng-template
        [ngTemplateOutlet]="treeNodes"
        [ngTemplateOutletContext]="{nodes: nodes, parent: tree}"
      />
    </ul>
    <ng-template #treeNodes let-nodes="nodes" let-parent="parent">
      @for (node of nodes; track node.value) {
        <li
          ngTreeItem
          [parent]="parent"
          [value]="node.value"
          [label]="node.name"
          [disabled]="node.disabled"
          [(expanded)]="node.expanded"
          #treeItem="ngTreeItem"
        >
      <span  class="bi bi-arrows-expand" ></span>
<!--          {{
          node.children ? 'chevron_right' : ''
        }}-->
          <span class="bi bi-folder" ></span>
<!--          {{
              node.children ? 'folder' : 'docs'
            }}-->
          {{ node.name }}
          <span class="bi bi-check"></span>
        </li>
        @if (node.children) {
          <ul role="group">
            <ng-template ngTreeItemGroup [ownedBy]="treeItem" #group="ngTreeItemGroup">
              <ng-template
                [ngTemplateOutlet]="treeNodes"
                [ngTemplateOutletContext]="{nodes: node.children, parent: group}"
              />
            </ng-template>
          </ul>
        }
      }
    </ng-template>
`,
  styles: [`

  [ngTree] {
    min-width: 24rem;
    padding: 0.5rem;
  }
  [ngTreeItem] {
    cursor: pointer;
    list-style: none;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.3rem 1rem;
  }
  [ngTreeItem][aria-disabled='true'] {
    opacity: 0.5;
    cursor: default;
  }
  [ngTreeItem]:focus,
  [ngTreeItem]:hover {
    //background-color: var(--bs-white);
  }
  [ngTreeItem]:focus {
    //outline: 1px solid color-mix(in srgb, var(--bs-pink) 60%, transparent);
  }
  [ngTreeItem][aria-selected='true'],
  [ngTreeItem][aria-selected='true'] .expand-icon {
    //background-image: var(--pink-to-purple-horizontal-gradient);
    background-clip: text;
    //color: transparent;
  }
  .material-symbols-outlined {
    margin: 0;
    width: 24px;
  }
  .expand-icon {
    transition: transform 0.2s ease;
  }
  [ngTreeItem][aria-expanded='true'] .expand-icon {
    transform: rotate(90deg);
  }
  .selected-icon {
    visibility: hidden;
    margin-left: auto;
  }
  [ngTreeItem][aria-current] .selected-icon,
  [ngTreeItem][aria-selected='true'] .selected-icon {
    visibility: visible;
  }
  li[aria-expanded='false'] + ul[role='group'] {
    display: none;
  }`]
})
export class ScaffoldTree{
  readonly nodes: TreeNode[] = [
    {
      name: 'public',
      value: 'public',
      children: [
        {name: 'index.html', value: 'public/index.html'},
        {name: 'favicon.ico', value: 'public/favicon.ico'},
        {name: 'styles.css', value: 'public/styles.css'},
      ],
      expanded: true,
    },
    {
      name: 'src',
      value: 'src',
      children: [
        {
          name: 'app',
          value: 'src/app',
          children: [
            {name: 'app.ts', value: 'src/app/app.ts'},
            {name: 'app.html', value: 'src/app/app.html'},
            {name: 'app.css', value: 'src/app/app.css'},
          ],
          expanded: false,
        },
        {
          name: 'assets',
          value: 'src/assets',
          children: [{name: 'logo.png', value: 'src/assets/logo.png'}],
          expanded: false,
        },
        {
          name: 'environments',
          value: 'src/environments',
          children: [
            {
              name: 'environment.prod.ts',
              value: 'src/environments/environment.prod.ts',
              expanded: false,
            },
            {name: 'environment.ts', value: 'src/environments/environment.ts'},
          ],
          expanded: false,
        },
        {name: 'main.ts', value: 'src/main.ts'},
        {name: 'polyfills.ts', value: 'src/polyfills.ts'},
        {name: 'styles.css', value: 'src/styles.css', disabled: true},
        {name: 'test.ts', value: 'src/test.ts'},
      ],
      expanded: false,
    },
    {name: 'angular.json', value: 'angular.json'},
    {name: 'package.json', value: 'package.json'},
    {name: 'README.md', value: 'README.md'},
  ];
  readonly selected = signal(['angular.json']);
}
