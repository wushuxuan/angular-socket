import { ChangeDetectionStrategy, Component } from '@angular/core';
import { App, SettingsService } from '@delon/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('user login:');
    console.log(sessionStorage.getItem('user'));
    if (!sessionStorage.getItem('user')) {
      this.router.navigateByUrl('/passport/login');
    }
  }

  searchToggleStatus = false;

  get app(): App {
    return this.settings.app;
  }

  get collapsed(): boolean {
    return this.settings.layout.collapsed;
  }

  constructor(private settings: SettingsService, private router: Router) {}

  toggleCollapsedSidebar(): void {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange(): void {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
