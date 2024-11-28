import { Component, inject } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; 
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DietService } from 'src/app/service/diet.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { DiaryService } from 'src/app/service/diary.service';
import { Diet } from 'src/app/common/diet';
import plLocale from '@fullcalendar/core/locales/pl';
import { Diary } from 'src/app/common/diary';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CommonModule, RouterModule, MatSelectModule],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss'
})
export class DiaryComponent {

  diaryService = inject(DiaryService);
  dietService = inject(DietService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  renderer = inject(Renderer2);

  diets: Diet[] = [];
  selectedDiet = 0;
  isResponseHere = false;

  datesWithMeals = [];

  diaries: Diary[] = [];

  diaryMap: Map<string, Diary> = new Map();

  ngOnInit() {
    this.dietService.getAllDietsWithActiveMeals().subscribe((diets: Diet[]) => {
      this.diets = diets;
      if (this.route.snapshot.queryParamMap.has('dietId')) {
        this.selectedDiet = +this.route.snapshot.queryParamMap.get('dietId')!;
      } else {
        this.selectedDiet = diets[0].id;
      }
      console.log(this.selectedDiet);
      this.handleDietsUpdate(this.selectedDiet);
      this.isResponseHere = true;
    });
  
  }

  onDietSelected(selectedDietId: number) {
    this.selectedDiet = selectedDietId;
    this.handleDietsUpdate(selectedDietId);
  }

  handleDietsUpdate(dietId: number) {
    if (dietId > 0) {
      this.isResponseHere = false;
      this.diaryService.getDiariesByDietId(dietId).subscribe(data => {
        this.diaries = data;
        this.updateDates();
        this.refreshCalendar();
        this.initializeDiaryMap();
        this.isResponseHere = true;
      });
    }
  }

  initializeDiaryMap() {
    this.diaryMap.clear();
    this.diaries.forEach(diary => {
      const dateKey = diary.date.toString();
      this.diaryMap.set(dateKey, diary);
    });
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: plLocale,
    timeZone: 'local',
    firstDay: 1,
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next'
    },
    dayHeaderContent: this.customDayHeader,
    dayCellContent: this.customDayCellContent.bind(this)
  };

  onSelectDiaryDetails(diaryId: number) {
    this.router.navigate([`meals/diary/${diaryId}`]);
  } 

  customDayHeader(arg: any) {
    const daysOfWeek = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    return { html: daysOfWeek[arg.date.getUTCDay()] };
  }

  ngAfterViewInit() {
    this.applyCustomStyles();
  }

  customDayCellContent(arg: any) {
    const dateStr = arg.date.toLocaleDateString('sv-SE');
    const dayNumber = arg.date.getDate();
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const cellDate = arg.date;

    const hasMeal = this.datesWithMeals.includes(dateStr);
    
    let buttonType = 'btn-primary';
    let buttonText = 'Szczegóły';
    let buttonTextColor = '';
    let title = 'Jadłospis dodany';
    let disabled = '';

    if (cellDate < today) {
      disabled = 'disabled';
      buttonTextColor = "color: white;"
    }

    let finalContent = `
        <div class="row">
          <span style="color: rgb(110, 110, 110); font-weight: 450;">${dayNumber}</span>
        </div>
        <div class="mt-2 text-center mt-2">  
          <span>${title}</span>
          <button class="btn ${buttonType} ${disabled}" style="width: 100%; ${buttonTextColor}">${buttonText}</button>
        </div>
      `;

    if (!hasMeal) {
      title = 'Brak posiłków';
      finalContent = `
        <div class="row" style="width: 100%;">
          <span style="color: rgb(110, 110, 110); font-weight: 450; width: 100%;">${dayNumber}</span>
        </div>
        <div class="mt-5 text-center mt-2">  
          <span>${title}</span>
          <button class="disabled" style="width: 100%; visibility: hidden;">Brak jadłospisu</button>
        </div>
      `;
    } 

    const cellContent = document.createElement('div');
    cellContent.innerHTML = finalContent;
      const button = cellContent.querySelector('button');
      if (button) {
        this.renderer.listen(button, 'click', () => {
          if (hasMeal) {
            const diaryId = this.diaryMap.get(dateStr).id;
            this.onSelectDiaryDetails(diaryId);
          } 
        });
      }
    return { domNodes: [cellContent] };
  }

  applyCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .fc .fc-daygrid-day-frame {
        border: 1px solid #b6b6b6;
      }

      .disabled-date {
        background-color: #f0f0f0;
        pointer-events: none; 
      }
      .fc .fc-toolbar-title {
        font-weight: 400;
      }
    `;
    document.head.appendChild(style);
  }

  private updateDates() {
    this.datesWithMeals = [];
    for (let diary of this.diaries) {
      this.datesWithMeals.push(diary.date.toString());
    }
  }

  private refreshCalendar() {
    this.calendarOptions = {
      ...this.calendarOptions,
      dayCellContent: this.customDayCellContent.bind(this),
    };
  }
}
