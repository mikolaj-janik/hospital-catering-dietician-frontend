import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { Diet } from 'src/app/common/diet';
import { Meal } from 'src/app/common/meal';
import { DiaryService } from 'src/app/service/diary.service';
import { DietService } from 'src/app/service/diet.service';
import { MealService } from 'src/app/service/meal.service';

@Component({
  selector: 'app-new-diary',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule, ReactiveFormsModule],
  templateUrl: './new-diary.component.html',
  styleUrl: './new-diary.component.scss'
})
export class NewDiaryComponent {
  diaryService = inject(DiaryService);
  mealService = inject(MealService);
  dietService = inject(DietService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);

  isResponseHere = false;
  isIncorrectRequest = false;

  diet: Diet = null;
  date: Date = null;
  breakfasts: Meal[] = [];
  lunches: Meal[] = [];
  suppers: Meal[] = [];

  chosenBreakfastId = 0;
  chosenLunchId = 0;
  chosenSupperId = 0;
  repeatFor = 'never';
  repeatUntil = '1';

  polishDaysOfWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  day = '';
  dateStr = '';

  newDiaryForm = new FormGroup({
    breakfastId: new FormControl(this.chosenBreakfastId, [Validators.required, Validators.min(1)]),
    lunchId: new FormControl(this.chosenLunchId, [Validators.required, Validators.min(1)]),
    supperId: new FormControl(this.chosenSupperId, [Validators.required, Validators.min(1)]),
    repeatFor: new FormControl(this.repeatFor, [Validators.required]),
    repeatUntil: new FormControl(this.repeatUntil)
  });

  ngOnInit() {
    const dietId = +this.route.snapshot.queryParamMap.get('dietId');
    const dateStr = this.route.snapshot.queryParamMap.get('date');

    this.date = new Date(dateStr);

    const month = this.formatDayMonth(this.date.getMonth() + 1);
    const day = this.formatDayMonth(this.date.getDate());
    
    this.dateStr = day + '-' + month + '-' + this.date.getFullYear().toString(); 
    this.day = this.polishDaysOfWeek[this.date.getDay()];

    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

    this.dietService.getDietByIdFromDiary(dietId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.isResponseHere = true;
          this.redirectToDiaryCalendar();
          return of(null);
        }
      })
    ).subscribe((diet) => {
      this.diet = diet;
      this.mealService.getMealsByDietIdAndType(this.diet.id, 'breakfast').subscribe((meals) => this.breakfasts = meals);
      this.mealService.getMealsByDietIdAndType(this.diet.id, 'lunch').subscribe((meals) => this.lunches = meals);
      this.mealService.getMealsByDietIdAndType(this.diet.id, 'supper').subscribe((meals) => this.suppers = meals);
      this.isResponseHere = true;
    });

    if (this.date.toString() === 'Invalid Date' || this.date < yesterday) {
      this.redirectToDiaryCalendar();
    }
  }

  addNewDiary() {
    if(this.newDiaryForm.valid) {
      const { 
        breakfastId,
        lunchId,
        supperId,
        repeatFor,
        repeatUntil
        } = this.newDiaryForm.value;

        this.repeatUntil = repeatUntil;
        if (this.repeatFor === 'never') {
          this.repeatUntil = '0';
        }

        this.diaryService.addNewDiary(
          {
            dietId: this.diet.id as number,
            breakfastId: breakfastId as number,
            lunchId: lunchId as number,
            supperId: supperId as number,
            date: this.dateStr,
            repeatFor: repeatFor as string,
            repeatUntil: this.repeatUntil
          }, 
        ).pipe(
          catchError(() => {
            this.toastr.error('Wystąpił problem z dodawaniem jadłospisu')
            return of(null);
          }) 
        ).subscribe(() => {
          this.toastr.success('Pomyślnie dodano do jadłospisu');
          this.router.navigate(['meals/diary'], { queryParams: { dietId: this.diet.id } });
        });
    }
  }

  redirectToDiaryCalendar() {
    this.isIncorrectRequest = true;
    this.toastr.error('Niepoprawne żądanie');
    this.router.navigate(['meals/diary']);
  }

  onRepeatForSelected(type: string) {
    this.repeatFor = type;
    console.log(this.repeatUntil);
  }

  redirectToDiary(dietId: number) {
    this.router.navigate(['meals/diary'], { queryParams: { dietId: dietId } });
  }

  formatDayMonth(number: number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number.toString();
  }
}
