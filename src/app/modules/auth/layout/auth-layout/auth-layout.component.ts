import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {
  initialData: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getInitialSignUpData().subscribe({
      next: (data) => {
        this.initialData = data;
      },
      error: () => {
        console.error('❌ Error al obtener los datos iniciales');
      },
    });
  }
}
