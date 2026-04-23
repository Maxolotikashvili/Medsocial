import { Component, DestroyRef, effect, inject, Injector, signal, WritableSignal } from '@angular/core';
import { Procedures } from "../../procedures/procedures";
import { UserService } from '../../../../core/services/user.service';
import { EditProcedure } from "./edit-procedure/edit-procedure";
import { Procedure } from '../../../../core/models/procedures.model';
import { ProceduresService } from '../../../../core/services/procedures.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PopupService } from '../../../../core/services/popup.service';

@Component({
  selector: 'doctors-procedures',
  imports: [Procedures, EditProcedure],
  templateUrl: './doctors-procedures.html',
  styleUrl: './doctors-procedures.scss',
})
export class DoctorsProcedures {
  private userService = inject(UserService);
  private procedureService = inject(ProceduresService);
  private destroy$ = inject(DestroyRef);
  private popupService = inject(PopupService);
  
  public user = this.userService.user();
  public editProcedure: WritableSignal<Procedure | null | undefined> = signal(undefined);
  public refreshProcedures = signal<number>(0);

  constructor() {}

  public deleteProcedure(procedure: Procedure) {
    this.procedureService.deleteProcedure(procedure.id).pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.refreshProcedures.update(v => v + 1);
        this.popupService.show({ message: 'Procedure deleted', type: 'info' });
      },
      error: () => this.popupService.show({ message: 'Something went wrong, try again later', type: 'error' })
    });
  }
}
