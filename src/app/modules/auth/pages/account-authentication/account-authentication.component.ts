import { Component } from '@angular/core';

import { faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account-authentication',
  templateUrl: './account-authentication.component.html',
})
export class AccountAuthenticationComponent {
  faLock = faLock;
}
