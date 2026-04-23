import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { faAward, faCapsules, faEarthAmerica, faEye, faHeartPulse, faHospital, faLocationDot, faStar, faUserDoctor, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ProceduresService } from '../../../core/services/procedures.service';
import { Procedure } from '../../../core/models/procedures.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { AnimateOnScrollDirective } from "../../directives/animate-on-scroll.directive";
import { DobToAgePipePipe } from '../../pipes/dob-to-age.pipe';
import { Rating } from '../rating/rating';
import { ScrollFromBreadcrumbDirective } from "../../directives/scroll-from-breadcrumb.directive";
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { EffectDirective } from '../../directives/effect.directive';
import { CurrencyService } from '../../../core/services/currency.service';
import { UserService } from '../../../core/services/user.service';
import { USER_ROLES } from '../../../core/configs/user.config';

@Component({
  selector: 'app-procedure-details',
  imports: [EffectDirective, FaIconComponent, AnimateOnScrollDirective, DobToAgePipePipe, Rating, RouterLink, ScrollFromBreadcrumbDirective],
  templateUrl: './procedure-details.html',
  styleUrl: './procedure-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProcedureDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
  private proceduresService = inject(ProceduresService);
  private currencyService = inject(CurrencyService);
  private userService = inject(UserService);

  private procedureId: WritableSignal<string> = signal('');
  public procedure!: Signal<Procedure | undefined>;
  public icons: Record<string, IconDefinition> = {
    eye: faEye,
    pulse: faHeartPulse,
    pills: faCapsules,
    locationDot: faLocationDot,
    hospital: faHospital,
    name: faAddressCard,
    location: faEarthAmerica,
    doctor: faUserDoctor,
    rating: faStar,
    title: faAward
  }
  public user = this.userService.user;
  public roles = USER_ROLES
  public currency = this.currencyService.currency;
  
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
    const data = this.proceduresService.getProcedure(this.procedureId())
    this.procedure = toSignal<Procedure | undefined>(data, { injector: this.injector });
  }

  public handleDoctorImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;

    imgElement.src = 'images/doctor-placeholder.png';
  }
}
