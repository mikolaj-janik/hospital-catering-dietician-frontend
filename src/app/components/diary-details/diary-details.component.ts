import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Diary } from 'src/app/common/diary';
import { Meal } from 'src/app/common/meal';
import { DiaryService } from 'src/app/service/diary.service';
import { MealService } from 'src/app/service/meal.service';
import { PopUpComponent } from '../pop-up/pop-up.component';

@Component({
  selector: 'app-diary-details',
  standalone: true,
  imports: [],
  templateUrl: './diary-details.component.html',
  styleUrl: './diary-details.component.scss'
})
export class DiaryDetailsComponent {

  diaryService = inject(DiaryService);
  mealService = inject(MealService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialogRef = inject(MatDialog);

  isResponseHere = false;

  diary: Diary = null;
  date: Date = null;
  dateStr: string = '';
  breakfast: Meal = null;
  lunch: Meal = null;
  supper: Meal = null;

  meals: Meal[] = [];

  polishDaysOfWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
  day = '';


  ngOnInit() {
    const diaryId: number = +this.route.snapshot.paramMap.get('id')!;
    
    this.diaryService.getDiaryById(diaryId).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this.isResponseHere = true;
          return of(null);
        }
      })
    ).subscribe((data) => {
      this.diary = data;
      this.date = new Date(data.date);
      const month = this.formatDayMonth(this.date.getMonth() + 1)
      const day = this.formatDayMonth(this.date.getDate());
      this.dateStr = day + '-' + month + '-' + this.date.getFullYear().toString();
      this.day = this.polishDaysOfWeek[this.date.getDay()];

      this.mealService.getMealById(this.diary.breakfast.id).subscribe((meal) => {
        this.breakfast = meal;
        this.meals.push(meal);

        this.mealService.getMealById(this.diary.lunch.id).subscribe((meal) => {
          this.lunch = meal;
          this.meals.push(meal);

          this.mealService.getMealById(this.diary.supper.id).subscribe((meal) => {
            this.supper = meal;
            this.meals.push(meal);
            this.isResponseHere = true;
          });
        });
      });
    });
  }

  redirectToDiary(dietId: number) {
    this.router.navigate(['meals/diary'], { queryParams: { dietId: dietId } });
  }

  redirectToMealDetails(mealId: number) {
    this.router.navigate([`meals/details/${mealId}`], { queryParams: { diaryId: this.diary.id }});
  }

  redirectToEdit(diaryId: number) {
    this.router.navigate([`meals/diary/edit/${diaryId}`]);
  }

  openDialog(image: string) {
    this.dialogRef.open(PopUpComponent, { data : image });
  }

  formatDayMonth(number: number) {
    if (number < 10) {
      return `0${number}`;
    }
    return number.toString();
  }
}
