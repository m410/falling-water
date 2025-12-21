import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Look } from './look';

describe('Look', () => {
  let component: Look;
  let fixture: ComponentFixture<Look>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Look]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Look);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
