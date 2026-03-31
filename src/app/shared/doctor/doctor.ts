import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Doctor as DoctorType } from '../../core/models/doctor.model';
import { ScrollFromBreadcrumbDirective } from "../directives/scroll-from-breadcrumb.directive";
import { Rating } from "../rating/rating";
import { DobToAgePipePipe } from '../pipes/dob-to-age.pipe';
import { DatePipe } from '@angular/common';
import { faBriefcase, faBuildingColumns, faCalendarDays, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'doctor',
  imports: [ScrollFromBreadcrumbDirective, Rating, DobToAgePipePipe, DatePipe, FaIconComponent],
  templateUrl: './doctor.html',
  styleUrl: './doctor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Doctor implements OnInit {
  private injector = inject(Injector);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  private id: WritableSignal<string> = signal<string>('');
  public doctor!: Signal<DoctorType | undefined>;

  public icons: Record<string, IconDefinition> = {
    university: faBuildingColumns,
    calendar: faCalendarDays,
    briefcase: faBriefcase
  }

  constructor() {}

  ngOnInit(): void {
    this.getDoctorId();
    this.getDoctor();

    this.userService.getDoctors().subscribe((data) => console.log(data))
  }

  private getDoctorId(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.id.set(id);
    }
  }

  private getDoctor(): void {
    if (this.id()) {
      this.doctor = toSignal(this.userService.getDoctor(this.id()), { injector: this.injector });
    }
  }

  public handleImageError(event: Event) {
    const image = event.target as HTMLImageElement;

    image.src = 'images/doctor-placeholder.png';
  }
}
