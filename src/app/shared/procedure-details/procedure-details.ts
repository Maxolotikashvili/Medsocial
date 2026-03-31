import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { faCapsules, faEye, faHeartPulse, faHospital, faLocationDot, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ProceduresService } from '../../core/services/procedures.service';
import { Procedure } from '../../core/models/procedures.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { AnimateOnScrollDirective } from "../directives/animate-on-scroll.directive";
import { TitleCasePipe } from '@angular/common';
import { Map } from '../../features/map/map';
import { DobToAgePipePipe } from '../pipes/dob-to-age.pipe';
import { Rating } from '../rating/rating';
import { ScrollFromBreadcrumbDirective } from "../directives/scroll-from-breadcrumb.directive";

@Component({
  selector: 'app-procedure-details',
  imports: [FaIconComponent, AnimateOnScrollDirective, TitleCasePipe, DobToAgePipePipe, Map, Rating, RouterLink, ScrollFromBreadcrumbDirective],
  templateUrl: './procedure-details.html',
  styleUrl: './procedure-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcedureDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
  private proceduresService = inject(ProceduresService);

  private procedureId: WritableSignal<string> = signal('');
  public procedure!: Signal<Procedure | undefined>;
  public icons: Record<string, IconDefinition> = {
    eye: faEye,
    pulse: faHeartPulse,
    pills: faCapsules,
    locationDot: faLocationDot,
    hospital: faHospital
  };

  constructor() {}

  ngOnInit(): void {
    this.getProcedureId();
    this.getProcedure();
  }

  private getProcedureId() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.procedureId.set(id);
    }
  }
  
  private getProcedure() {
    const data = this.proceduresService.getProcedureDetails(this.procedureId())
    this.procedure = toSignal<Procedure | undefined>(data, {injector: this.injector});
    this.toConsole(data)
  }

  public handleDoctorImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/doctor-placeholder.png';
  }

  toConsole(data: any) {
    data.subscribe((sd: any) => console.log(sd));
  } 
}
