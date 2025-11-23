import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../services/users-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-users-list',
  imports: [RouterLink],
  templateUrl: './users-list.html'
})
export class UsersList implements OnInit {
  usersService = inject(UsersService);

  ngOnInit(): void {
    this.usersService.usersResource.reload();
  }

  async deleteUser(userId: string) {
    if(confirm('¿Estás seguro que quieres borrar este recurso?'))
    {
      try {
        await this.usersService.deleteUser(userId);
        this.usersService.usersResource.reload();
      } catch (error) {

      }
    }
  }
}
