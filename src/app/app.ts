import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MainHeader } from "./shared/main-header/main-header";
import { PopupService } from './core/services/popup.service';
import { PopupComponent } from "./features/popup/popup";
import { HomeHero } from "./shared/home-hero/home-hero";
import { HomeCategories } from "./shared/home-categories/home-categories";
import { StorageService } from './core/services/storage.service';
import { UserService } from './core/services/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [MainHeader, PopupComponent, HomeHero, HomeCategories],
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
