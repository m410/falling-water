import { Component, viewChild, ViewEncapsulation } from '@angular/core';
import { ScaffoldSidebar } from './scaffold-sidebar';
import { ScaffoldNav } from './scaffold-nav';
import { RouterOutlet } from '@angular/router';
import { ScaffoldTree } from './scaffold-tree';
import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import {OverlayModule} from '@angular/cdk/overlay';

@Component({
  selector: 'bo-scaffold-menu',
  imports: [Menu, MenuContent, MenuItem, MenuTrigger, OverlayModule],
  template: `
    <button
      class="btn btn-outline-secondary"
      ngMenuTrigger
      #origin
      #trigger="ngMenuTrigger"
      [menu]="formatMenu()">Open Menu</button>
    <ng-template
      [cdkConnectedOverlayOpen]="trigger.expanded()"
      [cdkConnectedOverlay]="{origin, usePopover: 'inline'}"
      [cdkConnectedOverlayPositions]="[
    {originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4},
  ]"
      cdkAttachPopoverAsChild
    >
      <div ngMenu class="menu" #formatMenu="ngMenu">
        <ng-template ngMenuContent>
          <div ngMenuItem value="Mark as read">
            <span class="icon bi bi-reply-all"></span>
            <span class="label">Mark as read</span>
          </div>
          <div ngMenuItem value="Snooze">
            <span class="icon bi bi-clock" translate="no" aria-hidden="true"></span>
            <span class="label">Snooze</span>
          </div>
          <div role="separator" aria-orientation="horizontal" class="separator"></div>
          <div
            ngMenuItem
            class="menu-item"
            value="Categorize"
            #categorizeItem
            [submenu]="categorizeMenu()"
          >
        <span class="icon bi-graph-down"></span
        >
            <span class="label">Categorize</span>
            <span class="icon bi bi-arrow-down"></span>
          </div>
          <ng-template
            [cdkConnectedOverlayOpen]="formatMenu.visible()"
            [cdkConnectedOverlay]="{origin: categorizeItem, usePopover: 'inline'}"
            [cdkConnectedOverlayPositions]="[
          {originX: 'end', originY: 'top', overlayY: 'top', overlayX: 'start', offsetX: 6},
        ]"
            cdkAttachPopoverAsChild
          >
            <div ngMenu class="menu" #categorizeMenu="ngMenu">
              <ng-template ngMenuContent>
                <div ngMenuItem value="Mark as important">
                  <span class="icon bi bi-exclamation-circle"></span>
                  <span class="label">Mark as important</span>
                </div>
                <div ngMenuItem value="Star">
                  <span class="icon bi bi-star"></span>
                  <span class="label">Star</span>
                </div>
                <div ngMenuItem value="Label">
              <span class="icon bi bi-bookmark"></span>
                  <span class="label">Label</span>
                </div>
              </ng-template>
            </div>
          </ng-template>
          <div role="separator" aria-orientation="horizontal" class="separator"></div>
          <div ngMenuItem value="Archive">
        <span class="icon bi bi-archive"></span>
            <span class="label">Archive</span>
          </div>
          <div ngMenuItem value="Report spam">
            <span class="icon bi bi-radioactive" ></span>
            <span class="label">Report spam</span>
          </div>
          <div ngMenuItem value="Delete">
            <span class="icon bi bi-trash" ></span>
            <span class="label">Delete</span>
          </div>
        </ng-template>
      </div>
    </ng-template>
  `,
  styles: [`
    [ngMenuTrigger] {
      //display: flex;
      //cursor: pointer;
      //align-items: center;
      //padding: 0.6rem 2rem;
      //border-radius: 0;
      //color: var(--bs-text-body);
      //border: 1px solid var(--bs-red);
      //background-color: var(--bs-white);
    }
    [ngMenuTrigger] .icon {
      //font-size: 1.5rem;
      //opacity: 0.875;
    }
    [ngMenu] {
      margin: 0;
      width: 15rem;
      padding: 0.25rem;
      border-radius: 0.5rem;
      //border: 1px solid var(--bs-primary);
      background-color: var(--bs-white);
      box-shadow: 2px 3px 21px -4px rgba(0,0,0,0.59);
    }
    [ngMenu][data-visible='false'] {
      display: none;
    }
    [ngMenuItem] {
      //outline: none;
      display: flex;
      cursor: pointer;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    [ngMenuTrigger]:hover,
    [ngMenuItem][data-active='true'] {
      //background: color-mix(in srgb, var(--bs-primary) 10%, transparent);
    }
    [ngMenuItem]:focus,
    [ngMenuTrigger]:focus {
      //outline: 2px solid var(--bs-pink);
    }
    [ngMenuItem] .icon {
      opacity: 0.875;
      font-size: 1.25rem;
    }
    [ngMenuItem] .label {
      flex: 1;
      opacity: 0.875;
      font-size: 0.875rem;
    }
    [ngMenuItem]:not([aria-expanded='true']) .arrow {
      opacity: 0.5;
    }
    [ngMenu] .separator {
      border-top: 1px solid var(--bs-primary);
      margin: 0.25rem 0;
      opacity: 0.25;
    }`]
})
export class ScaffoldMenu {
  formatMenu = viewChild<Menu<string>>('formatMenu');
  categorizeMenu = viewChild<Menu<string>>('categorizeMenu');

  // dash
  // user
  // category
  // product
  // order
  // system
  // suppliers
}
