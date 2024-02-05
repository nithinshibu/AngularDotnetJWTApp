import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  public fullname: string = '';
  public role: string = '';
  constructor(
    private auth: AuthService,
    private api: ApiService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.userStore.getFullNameFromStore().subscribe((val) => {
      let fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullname = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      let roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  logout() {
    this.auth.signOut();
  }
}
