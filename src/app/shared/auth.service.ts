import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private auth: Auth) {}

  signInWithGoogle(): Observable<User | null> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      map(result => result.user)
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }

  get currentUser$(): Observable<User | null> {
    return new Observable(subscriber => {
      return this.auth.onAuthStateChanged(subscriber);
    });
  }
}
