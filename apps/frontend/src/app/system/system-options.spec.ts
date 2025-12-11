import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemOptions } from './system-options';

describe('SystemOptions', () => {
  let component: SystemOptions;
  let fixture: ComponentFixture<SystemOptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemOptions],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemOptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
