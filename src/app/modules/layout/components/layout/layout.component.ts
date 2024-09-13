import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('LayoutComponent getting profile');

    this.authService.getProfile().subscribe({
      next: (profile) => {
        console.log('Profile obtained:', profile);

        // Realizar otro llamado después de obtener el perfil
        this.userService.getUserReservations().subscribe({
          next: (reservations) => {
            console.log('Reservations obtained:', reservations);
          },
          error: (err) => {
            console.error('Error getting reservations:', err);
          },
          complete: () => {
            console.log('Reservations call completed');
          },
        });
      },
      error: (err) => {
        console.error('Error getting profile:', err);
      },
      complete: () => {
        console.log('LayoutComponent ending getting profile');
      },
    });
  }
}
