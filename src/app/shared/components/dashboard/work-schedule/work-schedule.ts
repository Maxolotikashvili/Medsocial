import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MbSwitch } from '../../../../features/mb-switch/mb-switch';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray } from '@angular/forms';
import { WeekDay, WeekDayKey, WorkScheduleForm, WorkSchedulePayload, WorkSchedule as WorkScheduleType } from '../../../../core/models/schedule.model';
import { MbDropdown } from '../../../../features/mb-dropdown/mb-dropdown';
import { SCHEDULE_SETTINGS, WEEK_DAYS } from '../../../../core/configs/schedule.config';
import { ScheduleService } from '../../../../core/services/schedule.service';
import { forkJoin, take, Observable } from 'rxjs';
import { PopupService } from '../../../../core/services/popup.service';
import { PaginatedResponse } from '../../../../core/models/procedures.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../core/services/error.service';
import { deepEqual } from '../../../utilities/object-comparer-utility';
import { transformDate } from '../../../utilities/date-transformer.utility';
import { UserService } from '../../../../core/services/user.service';
import { ScrollFromBreadcrumbDirective } from '../../../directives/scroll-from-breadcrumb.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCopy, faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'work-schedule',
  imports: [ReactiveFormsModule, MbSwitch, MbDropdown, ScrollFromBreadcrumbDirective, FaIconComponent],
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkSchedule implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private scheduleService = inject(ScheduleService);
  private popupService = inject(PopupService);
  private errorService = inject(ErrorService);

  public scheduleGroup!: FormGroup;
  private originalSchedule: WritableSignal<WorkScheduleForm[]> = signal([]);
  public weekDays: readonly WeekDay[] = WEEK_DAYS;
  private data!: PaginatedResponse<WorkScheduleType>;
  public workingHours = computed(() => {
    const format = SCHEDULE_SETTINGS.format;
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      value: transformDate(i, format) as string,
    }));
  });

  private originalSlotIds: Set<string> = new Set();
  private originalSlotsMap: Map<string, WorkScheduleType> = new Map();
  public readonly icons: Record<string, IconDefinition> = {
    xmark: faXmark,
    copy: faCopy,
    save: faFloppyDisk,
  };

  ngOnInit(): void {
    this.initializeScheduleForm();
    this.loadSchedule();
  }

  private loadSchedule() {
    const user = this.userService.user();
    this.scheduleService
      .getWorkingSchedule(user.id)
      .pipe(take(1))
      .subscribe({
        next: (scheduleData) => {
          this.data = scheduleData;
          this.applyExistingScheduleToForm();
        },

        error: (error: HttpErrorResponse) => {
          this.errorService.handleError(error);
        },
      });
  }

  private applyExistingScheduleToForm() {
    this.originalSlotIds.clear();
    const grouped: Record<string, WorkScheduleType[]> = {};

    this.data.results.forEach((item) => {
      if (!grouped[item.week_day]) {
        grouped[item.week_day] = [];
      }
      grouped[item.week_day].push(item);
    });

    this.originalSlotsMap.clear();
    this.data.results.forEach((item) => {
      const key = `${item.week_day}-${item.start_time}-${item.end_time}`;
      this.originalSlotsMap.set(key, item);
    });

    this.weekDays.forEach((day) => {
      const group = this.scheduleGroup.get(day.key) as FormGroup;
      if (!group) return;
      group.get('isActive')?.setValue(false);
      const slotsArray = group.get('slots') as FormArray;
      slotsArray.clear();
    });

    Object.keys(grouped).forEach((dayKey) => {
      const group = this.scheduleGroup.get(dayKey) as FormGroup;
      if (!group) return;

      group.get('isActive')?.setValue(true);

      const slotsArray = group.get('slots') as FormArray;
      slotsArray.clear();

      grouped[dayKey].forEach((item) => {
        const startHourInt = parseInt(item.start_time.split(':')[0], 10);
        const endHourInt = parseInt(item.end_time.split(':')[0], 10);

        const startTimeOption = this.workingHours().find((h) => h.id === startHourInt);
        const endTimeOption = this.workingHours().find((h) => h.id === endHourInt);

        slotsArray.push(
          this.fb.group({
            id: [item.id || null],
            startTime: {
              id: startTimeOption?.id?.toString() ?? '',
              value: startTimeOption?.value ?? '',
            },
            endTime: {
              id: endTimeOption?.id?.toString() ?? '',
              value: endTimeOption?.value ?? '',
            },
          }),
        );

        if (item.id) {
          this.originalSlotIds.add(item.id);
        }
      });

      if (slotsArray.length === 0) {
        slotsArray.push(this.createSlot());
      }
    });

    this.weekDays.forEach((day) => {
      const group = this.scheduleGroup.get(day.key) as FormGroup;
      if (!group) return;

      const slotsArray = group.get('slots') as FormArray;
      if (slotsArray.length === 0) {
        slotsArray.push(this.createSlot());
      }
    });

    const initialValues = Object.values(this.scheduleGroup.getRawValue()) as WorkScheduleForm[];
    this.originalSchedule.set(structuredClone(initialValues));
  }

  private initializeScheduleForm() {
    const dayGroups: any = {};

    this.weekDays.forEach((day) => {
      dayGroups[day.key] = this.fb.group({
        weekDay: [day.key],
        isActive: [false],
        slots: this.fb.array([]),
      });
    });

    this.scheduleGroup = this.fb.group(dayGroups);

    this.weekDays.forEach((day) => {
      const slots = this.getSlots(day.key);
      if (slots.length === 0) {
        slots.push(this.createSlot());
      }
    });
  }

  private createSlot(id?: string) {
    return this.fb.group({
      id: [id || null],
      startTime: null,
      endTime: null,
    });
  }

  private isSlotEmpty(slot: any): boolean {
    if (!slot) return true;
    const hasValidStart = this.isValidSlotValue(slot.startTime);
    const hasValidEnd = this.isValidSlotValue(slot.endTime);
    return !hasValidStart && !hasValidEnd;
  }

  private isValidSlotValue(value: any): boolean {
    if (!value) return false;
    if (value.id === undefined || value.id === null || value.id === '') return false;
    if (value.id === 'reset-option') return false;
    if (value.value === undefined || value.value === null || value.value === '') return false;
    return true;
  }

  private isSlotPartiallyFilled(slot: any): boolean {
    if (!slot) return false;
    const hasValidStart = this.isValidSlotValue(slot.startTime);
    const hasValidEnd = this.isValidSlotValue(slot.endTime);
    return (hasValidStart && !hasValidEnd) || (!hasValidStart && hasValidEnd);

  }

  getSlots(dayKey: WeekDayKey): FormArray {
    return this.scheduleGroup.get(dayKey)?.get('slots') as FormArray;
  }

  addSlot(dayKey: WeekDayKey) {
    const slots = this.getSlots(dayKey);
    const last = slots.length ? slots.at(slots.length - 1).value : null;

    if (!slots.length) {
      slots.push(this.createSlot());
      return;
    }

    if (!last || !last.startTime || !last.endTime) {
      this.popupService.show({
        message: 'Fill current slot before adding another',
        type: 'error',
      });
      return;
    }

    slots.push(this.createSlot());

    const sorted = slots.value.sort((a: any, b: any) => +a.startTime?.id - +b.startTime?.id);

    slots.clear();
    sorted.forEach((s: any) =>
      slots.push(
        this.fb.group({
          id: [s.id || null],
          startTime: s.startTime,
          endTime: s.endTime,
        }),
      ),
    );
  }

  public removeSlot(dayKey: WeekDayKey, index: number) {
    const slots = this.getSlots(dayKey);

    if (slots.length === 1) {
      this.popupService.show({
        message: 'At least one slot is required',
        type: 'error',
      });
      return;
    }

    slots.removeAt(index);
  }

  validateNoOverlap(slots: any[]): boolean {
    const cleaned = slots.filter((s: any) => !this.isSlotEmpty(s));
    const mapped = cleaned
      .map((s) => ({
        start: +s.startTime?.id,
        end: +s.endTime?.id,
      }))
      .sort((a, b) => a.start - b.start);

    for (let i = 1; i < mapped.length; i++) {
      if (mapped[i].start < mapped[i - 1].end) {
        return false;
      }
    }

    return true;
  }

  validateMax24Hours(slots: any[]): boolean {
    const cleaned = slots.filter((s: any) => !this.isSlotEmpty(s));
    const total = cleaned.reduce((sum, s) => {
      const start = +s.startTime?.id;
      const end = +s.endTime?.id;
      return sum + (end - start);
    }, 0);

    return total <= 24;
  }

  public submitScheduleForm() {
    const rawValues = this.scheduleGroup.getRawValue();
    const originalById = new Map<string, WorkScheduleType>();
    const originalByPayload = new Map<string, WorkScheduleType>();
    const requests: Observable<any>[] = [];
    const usedOriginalIds = new Set<string>();
    const toAdd: { week_day: WeekDayKey; start_time: string; end_time: string }[] = [];
    const toUpdate: { wh_id: string; body: { week_day: WeekDayKey; start_time: string; end_time: string } }[] = [];
    const toDelete: string[] = [];

    this.data.results.forEach((item) => {
      if (item.id) {
        originalById.set(item.id, item);
      }
      const key = `${item.week_day}-${item.start_time}-${item.end_time}`;
      originalByPayload.set(key, item);
    });

    for (const key of Object.keys(rawValues) as WeekDayKey[]) {
      const day = rawValues[key];

      if (!day.isActive) continue;
      const slots = day.slots;
      const filledSlots = slots.filter((s: any) => !this.isSlotEmpty(s));
      const partialSlots = slots.filter((s: any) => this.isSlotPartiallyFilled(s));
      if (partialSlots.length) {
        this.popupService.show({
          message: `Please fill current slot before saving ${this.getDayLabel(key)}`,
          type: 'error',
        });
        return;
      }

      if (!filledSlots.length) {
        continue;
      }

      if (!this.validateMax24Hours(filledSlots)) {
        this.popupService.show({
          message: `Total working hours exceed 24h on ${this.getDayLabel(key)}`,
          type: 'error',
        });
        return;
      }
      filledSlots.sort((a: any, b: any) => +a.startTime.id - +b.startTime.id);

      const hasEmpty = filledSlots.some((s: any) => this.isSlotPartiallyFilled(s));
      if (hasEmpty) {
        this.popupService.show({
          message: `Please fill all time slots for ${this.getDayLabel(key)}`,
          type: 'error',
        });
        return;
      }

      const invalidRange = filledSlots.some((s: any) => {
        if (!s.startTime?.id || !s.endTime?.id) return false;
        return +s.endTime.id <= +s.startTime.id;
      });

      if (invalidRange) {
        this.popupService.show({
          message: `End time must be after start time (${this.getDayLabel(key)})`,
          type: 'error',
        });
        return;
      }

      if (!this.validateNoOverlap(filledSlots)) {
        this.popupService.show({
          message: `Time slots overlap on ${this.getDayLabel(key)}`,
          type: 'error',
        });
        return;
      }

      filledSlots.forEach((slot: any) => {
        const start_time = `${slot.startTime.id.toString().padStart(2, '0')}:00`;
        const end_time = `${slot.endTime.id.toString().padStart(2, '0')}:00`;
        const payload = {
          week_day: key,
          start_time,
          end_time,
        };
        const payloadKey = `${key}-${start_time}-${end_time}`;

        if (slot.id) {
          const original = originalById.get(slot.id);
          if (original) {
            if (original.week_day === key && original.start_time === start_time && original.end_time === end_time) {
              usedOriginalIds.add(original.id!);
              return;
            }
            toUpdate.push({ wh_id: slot.id, body: payload });
            usedOriginalIds.add(slot.id);
            return;
          }
        }

        const originalExact = originalByPayload.get(payloadKey);
        if (originalExact) {
          if (originalExact.id) {
            usedOriginalIds.add(originalExact.id);
          }
          return;
        }

        toAdd.push(payload);
      });
    }

    toDelete.push(...Array.from(this.originalSlotIds).filter((id) => !usedOriginalIds.has(id)));

    const userId = this.userService.user().id;
    toAdd.forEach((payload) => {
      requests.push(this.scheduleService.addWorkSchedule(payload));
    });
    toUpdate.forEach((update) => {
      requests.push(this.scheduleService.updateWorkSchedule({ doctorId: userId, wh_id: update.wh_id, body: update.body }));
    });
    toDelete.forEach((wh_id) => {
      requests.push(this.scheduleService.deleteWorkSchedule(userId, wh_id));
    });

    if (!requests.length) {
      this.popupService.show({
        message: 'No changes detected',
        type: 'info',
      });
      return;
    }
  
    forkJoin(requests).subscribe({
      next: () => {
        this.popupService.show({
          message: 'Work schedule updated',
          type: 'success',
        });
        
        const currentValues = Object.values(this.scheduleGroup.getRawValue());
        this.originalSchedule.set(structuredClone(this.sanitizeScheduleForms(currentValues)));
      },
      error: (err) => console.error('One or more requests failed', err),
    });
  }

  getDayLabel(dayKey: WeekDayKey): string {
    return this.weekDays.find((d) => d.key === dayKey)?.label ?? dayKey;
  }

  public get isFormChanged(): boolean {
    if (!this.scheduleGroup) return false;

    const currentValues = Object.values(this.scheduleGroup.getRawValue()) as WorkScheduleForm[];

    return !deepEqual(this.sanitizeScheduleForms(currentValues), this.sanitizeScheduleForms(this.originalSchedule()));
  }

  private sanitizeScheduleForms(values: any[]): any[] {
    return values.map((day) => ({
      weekDay: day.weekDay,
      isActive: day.isActive,
      slots: day.slots ? day.slots.filter((slot: any) => !this.isSlotEmpty(slot) && !this.isSlotPartiallyFilled(slot)) : [],
    }));
  }

  public revertChanges() {
    this.applyExistingScheduleToForm();
    this.scheduleGroup.markAsPristine();
  }
}
