import { Component } from '@angular/core';

@Component({
  selector: 'app-rediect',
  templateUrl: './rediect.component.html',
  styleUrls: ['./rediect.component.scss'],
})
export class RediectComponent {
  // private readonly _destroying$ = new Subject<void>();
  // constructor(
  //   private authService: MsalService,
  //   private userService: UserService,
  //   private msalBroadcastService: MsalBroadcastService
  // ) {}

  // ngOnInit(): void {
  //   this.msalBroadcastService.inProgress$
  //     .pipe(
  //       filter(
  //         (status: InteractionStatus) => status === InteractionStatus.None
  //       ),
  //       takeUntil(this._destroying$)
  //     )
  //     .subscribe(() => {
  //       console.log("User: ",this.authService.instance.getAllAccounts());
  //       if (this.isNewUser()) {
  //         this.registerUser();
  //       }
  //     });
  // }

  // isNewUser(): boolean {
  //   var userInfo: any = this.authService.instance.getAllAccounts();
  //   return !!userInfo[0].idTokenClaims.newUser;
  // }

  // registerUser() {
  //   var userInfo: any = this.authService.instance.getAllAccounts();
  //   var user: IRegisterUserInput = {
  //     name:
  //       userInfo[0].idTokenClaims.given_name +
  //       ' ' +
  //       userInfo[0].idTokenClaims.family_name,
  //     email: userInfo[0].username,
  //   };
  //   this.userService.registerUser(user).subscribe((x) => {
  //     console.log('regis:::', x);
  //   });
  // }

  // ngOnDestroy(): void {
  //   this._destroying$.next(undefined);
  //   this._destroying$.complete();
  // }
}
