import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: []
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  loginWithGoogle() {
    this.authService.signInWithGoogle().subscribe(user => {
      if (user) {
        this.router.navigate(['/Monday']);
      }
    });
  }
}
