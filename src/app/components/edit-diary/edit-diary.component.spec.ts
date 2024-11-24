import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiaryComponent } from './edit-diary.component';

describe('EditDiaryComponent', () => {
  let component: EditDiaryComponent;
  let fixture: ComponentFixture<EditDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDiaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
