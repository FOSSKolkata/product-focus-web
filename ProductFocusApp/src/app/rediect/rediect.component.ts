import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { UserService } from '../_services/user.service';
import { IRegisterUserInput } from '../dht-common/models';
import { filter, takeUntil } from 'rxjs/operators';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rediect',
  templateUrl: './rediect.component.html',
  styleUrls: ['./rediect.component.css'],
})
export class RediectComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private authService: MsalService,
    private userService: UserService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        console.log(this.authService.instance.getActiveAccount());
        if (this.isNewUser()) {
          this.registerUser();
        }
      });
  }

  isNewUser(): boolean {
    var userInfo: any = this.authService.instance.getAllAccounts();
    return !!userInfo[0].idTokenClaims.newUser;
  }

  registerUser() {
    var userInfo: any = this.authService.instance.getAllAccounts();
    var user: IRegisterUserInput = {
      name:
        userInfo[0].idTokenClaims.given_name +
        ' ' +
        userInfo[0].idTokenClaims.family_name,
      email: userInfo[0].username,
    };
    this.userService.registerUser(user).subscribe((x) => {
      console.log('regis:::', x);
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
