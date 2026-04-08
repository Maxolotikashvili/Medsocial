import { Component, inject, OnInit } from '@angular/core';
import { MbSwitch } from '../../../../features/mb-switch/mb-switch';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeekDay } from '../../../../core/models/schedule.model';
import { MbDropdown } from '../../../../features/mb-dropdown/mb-dropdown';
import { WEEK_DAYS } from '../../../../core/configs/schedule.config';

@Component({
  selector: 'work-schedule',
  imports: [ReactiveFormsModule, MbSwitch, MbDropdown],
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss',
})
export class WorkSchedule implements OnInit {
  private fb = inject(FormBuilder);

  public scheduleGroup!: FormGroup;
  public weekDays: readonly WeekDay[] = WEEK_DAYS;

  constructor() {}

  ngOnInit(): void {
    this.initializeScheduleForm();
  }

  private initializeScheduleForm() {
    this.scheduleGroup = this.fb.group({
      isActive: [false, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });

   
  }
}
