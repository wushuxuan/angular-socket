import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsService, User } from '@delon/theme';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  get user(): User {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  constructor(private settings: SettingsService) {}
}
