import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Procedure } from '../../../../core/models/procedures.model';
import { CalendarEvent } from 'calendar-utils';
import { DatePipe } from '@angular/common';
import { faGear, faUserDoctor, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../../../core/services/user.service';
import { ApiUser } from '../../../../core/models/user.model';
import { DobToAgePipePipe } from '../../../pipes/dob-to-age.pipe';
import { faCalendar, faClock, faUser } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ScheduleService } from '../../../../core/services/schedule.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Loading } from '../../../../features/loading/loading';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../../core/services/error.service';
import { PopupService } from '../../../../core/services/popup.service';
import { ModalService } from '../../../../core/services/modal.service';
import { MbTextarea } from '../../../../features/mb-textarea/mb-textarea';

@Component({
  selector: 'app-request-appointment-modal',
  imports: [
    DatePipe,
    DobToAgePipePipe,
    FaIconComponent,
    FormsModule,
    Loading,
    MbTextarea,
    ReactiveFormsModule,
  ],
  templateUrl: './request-appointment-modal.html',
  styleUrl: './request-appointment-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAppointmentModal implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;

  private userService = inject(UserService);
  private scheduleService = inject(ScheduleService);
  private errorService = inject(ErrorService);
  private popupService = inject(PopupService);
  private modalService = inject(ModalService);
  private formBuilder = inject(FormBuilder);

  public modalData!: { procedure: Procedure; date: CalendarEvent };
  public user: Signal<ApiUser | null> = signal(null);
  public selectedImage!: File;
  // public description: string = '';
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public appointmentForm!: FormGroup;

  public get procedure(): Procedure {
    return this.modalData.procedure;
  }

  public get doctor(): Procedure['user'] {
    return this.modalData.procedure.user;
  }

  public get date(): CalendarEvent {
    return this.modalData.date;
  }

  public icons: Record<string, IconDefinition> = {
    doctor: faUserDoctor,
    age: faUser,
    service: faGear,
    date: faCalendar,
    time: faClock,
  };

  constructor() {}

  ngOnInit(): void {
    this.getUser();
    this.initializeForm();
  }

  private getUser() {
    this.user = this.userService.user;
  }

  private initializeForm() {
    this.appointmentForm = this.formBuilder.group({
      description: ['', Validators.required],
      image: [null],
    });
  }

  public handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/user-placeholder.png';
  }

  public triggerImageUploader() {
    this.imageInput.nativeElement.click();
  }

  public onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const selectedImage = input.files[0];
    this.appointmentForm.get('image')?.setValue(selectedImage);
  }

  public sendAppointmentRequest() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsDirty();
      return;
    };

    const formValues = this.appointmentForm.getRawValue();
    const formData = new FormData();

    formData.append('date', new Date().toISOString());
    formData.append('brief', formValues.description);

    if (formValues.image) {
      formData.append('image', formValues.image, formValues.image.name);
    }

    formData.append('procedure_id', this.procedure.id);

    this.isLoading.set(true);
    this.scheduleService.scheduleAppointmentWithDoctor(this.modalData.procedure.user.id, formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.popupService.show({
          message:
            "Appointment request sent, you will get notified about doctor's decision from appointments section in your profile page",
          type: 'info',
          timer: 6000,
        });
        this.modalService.close();
      },

      error: (error: HttpErrorResponse) => {
        this.errorService.handleError(error);
        this.popupService.show({
          message: 'Something went wrong, please try again later',
          type: 'error',
        });
        this.modalService.close();
      },
    });
  }
}
