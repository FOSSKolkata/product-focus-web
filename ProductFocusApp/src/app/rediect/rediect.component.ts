import { Inject, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { AuthenticationResult, AuthError, EventMessage, EventType, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { b2cPolicies } from '../b2c-config';
import { Router } from '@angular/router';
import { RegisterUserService } from '../_services/register-user.service';
import { RegisterUserInput } from './../kanban-board/models';

interface IdTokenClaims extends AuthenticationResult {
  idTokenClaims: {
    acr?: string
  }
}

@Component({
  selector: 'app-rediect',
  templateUrl: './rediect.component.html',
  styleUrls: ['./rediect.component.css']
})
export class RediectComponent implements OnInit, OnDestroy {

  isNavbarCollapsed=true;
  title = 'Product Focus';
  isIframe = false;
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private registerUserService: RegisterUserService
  ) { }

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {

    });


    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS || msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
      
        let payload: IdTokenClaims = <AuthenticationResult>result.payload;

        // We need to reject id tokens that were not issued with the default sign-in policy.
        // "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr")
        // To learn more about b2c tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview

        if (payload.idTokenClaims?.acr === b2cPolicies.names.forgotPassword) {
          window.alert('Password has been reset successfully. \nPlease sign-in with your new password.');
          return this.authService.logout();
        } else if (payload.idTokenClaims['acr'] === b2cPolicies.names.editProfile) {
          window.alert('Profile has been updated successfully. \nPlease sign-in again.');
          return this.authService.logout();
        }
        
        if(this.isNewUser()) {
          this.registerUser();
        }

        // this.router.navigate(['organization-home']);
        return result;
      });

      this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE || msg.eventType === EventType.ACQUIRE_TOKEN_FAILURE),
        takeUntil(this._destroying$)
      )
      .subscribe((result: EventMessage) => {
        if (result.error instanceof AuthError) {
          // Check for forgot password error
          // Learn more about AAD error codes at https://docs.microsoft.com/azure/active-directory/develop/reference-aadsts-error-codes
          if (result.error.message.includes('AADB2C90118')) {
            
            // login request with reset authority
            let resetPasswordFlowRequest = {
              scopes: ["openid"],
              authority: b2cPolicies.authorities.forgotPassword.authority,
            };

            this.login(resetPasswordFlowRequest);
          }
        }
      });
  }

  isNewUser(): boolean{
    var userInfo:any = this.authService.instance.getAllAccounts();
    return !!userInfo[0].idTokenClaims.newUser;
  }

  registerUser() {
    var userInfo:any = this.authService.instance.getAllAccounts();
    var user: RegisterUserInput = {
      name: userInfo[0].idTokenClaims.given_name + " " + userInfo[0].idTokenClaims.family_name,
      email: userInfo[0].username
    };
    this.registerUserService.registerUser(user).subscribe(x => {
      console.log(x);
    });
  }

  login(userFlowRequest?: RedirectRequest | PopupRequest) {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      if (this.msalGuardConfig.authRequest) {
        this.authService.loginPopup({...this.msalGuardConfig.authRequest, ...userFlowRequest} as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      } else {
        this.authService.loginPopup(userFlowRequest)
          .subscribe((response: AuthenticationResult) => {
            this.authService.instance.setActiveAccount(response.account);
          });
      }
    } else {
      if (this.msalGuardConfig.authRequest){
        this.authService.loginRedirect({...this.msalGuardConfig.authRequest, ...userFlowRequest} as RedirectRequest);
      } else {
        this.authService.loginRedirect(userFlowRequest);
      }
    }
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
