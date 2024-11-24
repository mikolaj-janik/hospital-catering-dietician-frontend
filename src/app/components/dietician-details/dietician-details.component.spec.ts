import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticianDetailsComponent } from './dietician-details.component';

describe('DieticianDetailsComponent', () => {
  let component: DieticianDetailsComponent;
  let fixture: ComponentFixture<DieticianDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticianDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
