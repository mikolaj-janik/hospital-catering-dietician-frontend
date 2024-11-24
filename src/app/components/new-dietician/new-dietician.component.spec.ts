import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDieticianComponent } from './new-dietician.component';

describe('NewDieticianComponent', () => {
  let component: NewDieticianComponent;
  let fixture: ComponentFixture<NewDieticianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDieticianComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDieticianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
