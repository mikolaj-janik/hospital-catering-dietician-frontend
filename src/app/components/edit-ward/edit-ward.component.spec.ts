import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWardComponent } from './edit-ward.component';

describe('EditWardComponent', () => {
  let component: EditWardComponent;
  let fixture: ComponentFixture<EditWardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
