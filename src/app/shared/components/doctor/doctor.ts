import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Doctor as DoctorType } from '../../../core/models/doctor.model';
import { DoctorHeader } from "./doctor-header/doctor-header";
import { ScrollFromBreadcrumbDirective } from '../../directives/scroll-from-breadcrumb.directive';
import { UserService } from '../../../core/services/user.service';
import { ProfessionalDetails } from "../professional-details/professional-details";

@Component({
  selector: 'doctor',
  imports: [ScrollFromBreadcrumbDirective, DoctorHeader, ProfessionalDetails],
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

  constructor() {}

  ngOnInit(): void {
    this.getDoctorId();
    this.getDoctor();
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
}
