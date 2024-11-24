import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDietComponent } from './new-diet.component';

describe('NewDietComponent', () => {
  let component: NewDietComponent;
  let fixture: ComponentFixture<NewDietComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDietComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
