import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Diary } from 'src/app/common/diary';
import { Meal } from 'src/app/common/meal';
import { DiaryService } from 'src/app/service/diary.service';
import { MealService } from 'src/app/service/meal.service';

@Component({
  selector: 'app-edit-diary',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './edit-diary.component.html',
  styleUrl: './edit-diary.component.scss'
})
export class EditDiaryComponent {

  diaryService = inject(DiaryService);
  mealService = inject(MealService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;

  diary: Diary = null;
  date: Date = null;
  dateStr: string = '';

  breakfasts: Meal[] = [];
  lunches: Meal[] = [];
  suppers: Meal[] = [];

  chosenBreakfastId = 0;
  chosenLunchId = 0;
  chosenSupperId = 0;

  polishDaysOfWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  day = '';

  editDiaryForm = new FormGroup({
    breakfastId: new FormControl(this.chosenBreakfastId, [Validators.required, Validators.min(1)]),
    lunchId: new FormControl(this.chosenLunchId, [Validators.required, Validators.min(1)]),
    supperId: new FormControl(this.chosenSupperId, [Validators.required, Validators.min(1)])
  });

  ngOnInit() {
    const diaryId: number = +this.route.snapshot.paramMap.get('id');

    this.diaryService.getDiaryById(diaryId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.isResponseHere = true;
          return of(null);
        } 
      })
    ).subscribe((data) => {
      this.diary = data;
      this.chosenBreakfastId = data.breakfast.id;
      this.chosenLunchId = data.lunch.id;
      this.chosenSupperId = data.supper.id;

      this.editDiaryForm.patchValue({
        breakfastId: this.chosenBreakfastId,
        lunchId: this.chosenLunchId,
        supperId: this.chosenSupperId
      });
 
      this.mealService.getMealsByDietIdAndType(this.diary.diet.id, 'breakfast').subscribe((meals) => this.breakfasts = meals);
      this.mealService.getMealsByDietIdAndType(this.diary.diet.id, 'lunch').subscribe((meals) => this.lunches = meals);
      this.mealService.getMealsByDietIdAndType(this.diary.diet.id, 'supper').subscribe((meals) => this.suppers = meals);
      this.date = new Date(data.date);
      const month = this.formatDayMonth(this.date.getMonth() + 1)
      const day = this.formatDayMonth(this.date.getDate());
      this.dateStr = day + '-' + month + '-' + this.date.getFullYear().toString();
      this.day = this.polishDaysOfWeek[this.date.getDay()];
      this.isResponseHere = true;
    });
  }

  submitEditDiary() {
    if (this.editDiaryForm.valid) {
      const { 
        breakfastId,
        lunchId,
        supperId
        } = this.editDiaryForm.value;

      if (this.diary.breakfast.id != breakfastId || 
          this.diary.lunch.id != lunchId || 
          this.diary.supper.id != supperId) {
            
            this.diaryService.updateDiary(
              {
                id: this.diary.id,
                breakfastId: breakfastId as number,
                lunchId: lunchId as number,
                supperId: supperId as number
              }
            ).subscribe(() => {
              this.toastr.success("Pomyślnie zaktualizowano jadłospis");
              this.router.navigate([`meals/diary/${this.diary.id}`]);
            });
        } else {
          this.toastr.info('Nic nie zostało zmienione')
        }
    }
  }

  redirectToDiaryDetails(diaryId: number) {
    this.router.navigate([`meals/diary/${diaryId}`]);
  }

  formatDayMonth(number: number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number.toString();
  }
}
