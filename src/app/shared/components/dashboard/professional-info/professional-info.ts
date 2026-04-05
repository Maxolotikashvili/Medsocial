import { Component, inject, Injector, OnInit, Signal } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Doctor } from '../../../../core/models/doctor.model';
import { ProfessionalDetails } from "../../professional-details/professional-details";
import { ScrollFromBreadcrumbDirective } from "../../../directives/scroll-from-breadcrumb.directive";

@Component({
  selector: 'professional-info',
  imports: [ProfessionalDetails, ScrollFromBreadcrumbDirective],
  templateUrl: './professional-info.html',
  styleUrl: './professional-info.scss',
})
export class ProfessionalInfo implements OnInit {
  private userService = inject(UserService);
  private injector = inject(Injector);

  public doctor!: Signal<Doctor | undefined>;

  constructor() {}

  ngOnInit(): void {
    this.getDoctor();
  }

  private getDoctor() {
    const doctorId = this.userService.user().id;

    this.doctor = toSignal(this.userService.getDoctor(doctorId), { injector: this.injector });
  }
}
