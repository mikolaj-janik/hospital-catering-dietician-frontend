import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DieticiansComponent } from './dieticians.component';

describe('DieticiansComponent', () => {
  let component: DieticiansComponent;
  let fixture: ComponentFixture<DieticiansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DieticiansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DieticiansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
