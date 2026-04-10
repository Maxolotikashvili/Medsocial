import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MbSwitch } from '../../../../features/mb-switch/mb-switch';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WeekDay, WeekDayKey, WorkScheduleForm, WorkSchedulePayload, WorkSchedule as WorkScheduleType } from '../../../../core/models/schedule.model';
import { MbDropdown } from '../../../../features/mb-dropdown/mb-dropdown';
import { SCHEDULE_SETTINGS, WEEK_DAYS } from '../../../../core/configs/schedule.config';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { forkJoin, take } from 'rxjs';
import { PopupService } from '../../../../core/services/popup.service';
import { PaginatedResponse } from '../../../../core/models/procedures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../core/services/error.service';
import { deepEqual } from '../../../utilities/object-comparer-utility';
import { transformDate } from '../../../utilities/date-transformer.utility';

@Component({
  selector: 'work-schedule',
  imports: [ReactiveFormsModule, MbSwitch, MbDropdown],
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkSchedule implements OnInit {
  private fb = inject(FormBuilder);
  private scheduleService = inject(ScheduleService);
  private popupService = inject(PopupService);
  private errorService = inject(ErrorService);

  public scheduleGroup!: FormGroup;
  private originalSchedule: WritableSignal<WorkScheduleForm[]> = signal([]);
  public weekDays: readonly WeekDay[] = WEEK_DAYS;
  public workingHours = computed(() => {
    const format = SCHEDULE_SETTINGS.format;
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      value: transformDate(i, format) as string,
    }));
  });
  private data!: PaginatedResponse<WorkScheduleType>

  ngOnInit(): void {
    this.initializeScheduleForm();
    this.loadSchedule();
  }

  private loadSchedule() {
    this.scheduleService.getWorkingSchedule().pipe(take(1)).subscribe({
      next: (data) => {
        this.data = data;
        this.applyExistingScheduleToForm();
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.handleError(error);
      },
    });
  }

  private applyExistingScheduleToForm() {
    this.data.results.forEach((item) => {
      const dayKey = item.week_day;
      const group = this.scheduleGroup.get(dayKey) as FormGroup;

      if (group) {
        const startHourInt = parseInt(item.start_time.split(':')[0], 10);
        const endHourInt = parseInt(item.end_time.split(':')[0], 10);

        const startTimeOption = this.workingHours().find((h) => h.id === startHourInt);
        const endTimeOption = this.workingHours().find((h) => h.id === endHourInt);
        const previousGroupValue: WorkScheduleForm = {
          weekDay: item.week_day,
          isActive: true,
          startTime: { id: startTimeOption?.id?.toString() ?? '', value: startTimeOption?.value ?? '' },
          endTime: { id: endTimeOption?.id?.toString() ?? '', value: endTimeOption?.value ?? '' },
        };
        group.patchValue(previousGroupValue);
        this.originalSchedule.update((prevValue) => [...prevValue, previousGroupValue]);
      }
    });

    const initialValues = Object.values(this.scheduleGroup.getRawValue()) as WorkScheduleForm[];
    this.originalSchedule.set(structuredClone(initialValues));
  }

  private initializeScheduleForm() {
    const dayGroups: any = {};

    this.weekDays.forEach((day) => {
      const isWeekend = day.key === 'SA' || day.key === 'SU';

      dayGroups[day.key] = this.fb.group({
        weekDay: [{ value: day.key, disabled: isWeekend }],
        isActive: [{ value: false, disabled: isWeekend }],
        startTime: [{ value: '', disabled: isWeekend }],
        endTime: [{ value: '', disabled: isWeekend }],
      });
    });

    this.scheduleGroup = this.fb.group(dayGroups);
  }

  public submitScheduleForm() {
    const rawValues = this.scheduleGroup.getRawValue();
    const originalMap = new Map(this.originalSchedule().map((s) => [s.weekDay, s]));

    const requests = Object.keys(rawValues).map((key) => {
        const currentVal = rawValues[key];
        const originalEntry = originalMap.get(key as WeekDayKey);

        const wasActive = !!originalEntry?.isActive;
        const isActive = !!currentVal.isActive;

        if (originalEntry && deepEqual(currentVal, originalEntry)) {
          return null;
        }

        if (wasActive && !isActive) {
          //delete work schedule
        }

        if (isActive) {
          const payload: WorkSchedulePayload = {
            week_day: key as WeekDayKey,
            start_time: `${currentVal.startTime.id.toString().padStart(2, '0')}:00`,
            end_time: `${currentVal.endTime.id.toString().padStart(2, '0')}:00`,
          };

          return this.scheduleService.updateWorkSchedule(payload);
        }

        return null;
      })
      .filter((req): req is ReturnType<typeof this.scheduleService.updateWorkSchedule> => !!req);

    if (!requests.length) {
      this.popupService.show({
        message: 'No changes detected',
        type: 'info',
      });
      return;
    }

    forkJoin(requests).subscribe({
      next: () =>
        this.popupService.show({
          message: 'Work schedule updated',
          type: 'success',
        }),
      error: (err) => console.error('One or more requests failed', err),
    });
  }

  public get isFormChanged(): boolean {
    if (!this.scheduleGroup) {
      return false;
    }

    const currentValues = Object.values(this.scheduleGroup.getRawValue());
    return !deepEqual(currentValues, this.originalSchedule());
  }

  test(ss: any) {
    console.log(ss)
  }
  public revertChanges() {
    this.applyExistingScheduleToForm();
    this.scheduleGroup.markAsPristine();
  }
}
