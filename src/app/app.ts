import { Component, inject, OnInit, signal } from '@angular/core';
import { PopupService } from './core/services/popup.service';
import { PopupComponent } from "./features/popup/popup";
import { UserService } from './core/services/user.service';
import { take } from 'rxjs';
import { HomeCategories } from './shared/home/home-categories/home-categories';
import { HomeHero } from './shared/home/home-hero/home-hero';
import { StorageService } from './core/services/storage.service';
import { MainHeader } from './shared/main-header/main-header';
import { RouterOutlet } from "../../node_modules/@angular/router/types/_router_module-chunk";

@Component({
  selector: 'app-root',
  imports: [MainHeader, PopupComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('medproject');

  protected popupService = inject(PopupService);
  private storageService = inject(StorageService);
  private userService = inject(UserService);

  constructor() {}

  ngOnInit(): void {
    this.fetchUser();
  }

  private fetchUser() {
    const token: string | null = this.storageService.get<string>('access_token');

    if (token) {
      this.userService.getUser(token).pipe(take(1)).subscribe();
    }
  }
}
