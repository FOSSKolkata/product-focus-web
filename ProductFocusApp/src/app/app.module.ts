import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalRedirectComponent,
} from '@azure/msal-angular';

import { b2cPolicies, apiConfig } from './b2c-config';
import { FormsModule } from '@angular/forms';
import { OrganizationHomeComponent } from './organization-home/organization-home.component';
import { OrganizationComponent } from './organization/organization.component';
import { LayoutComponent } from './layout/layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { OrganizationService } from './_services/organization.service';
import { RediectComponent } from './rediect/rediect.component';
import { UserService } from './_services/user.service';
import { DhtCommonModule } from './dht-common/dht-common.module';
import { InvitationComponent } from './invitation/invitation.component';
import { OrganizationMembersComponent } from './organization/organization-members/organization-members.component';
import { StateComponent } from './garbage/state/state.component';
import { ErrorComponent } from './garbage/error/error.component';
import { CodeComponent } from './garbage/code/code.component';
import { MatSortModule } from '@angular/material/sort';
import { SprintService } from './_services/sprint.service';
import { InvitationsComponent } from './organization/invitations/invitations.component';
import { ToastrModule } from 'ngx-toastr';
import {BreadcrumbModule} from 'angular-crumbs';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
  // console.log("LOg:::",logLevel);
  // console.log("MEss:::",message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '165777d2-f326-4211-a9a3-a5fe12b9c516',
      authority: b2cPolicies.authorities.signUpSignIn.authority,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
      knownAuthorities: [b2cPolicies.authorityDomain],
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(apiConfig.uri, apiConfig.scopes);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...apiConfig.scopes],
    },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OrganizationHomeComponent,
    OrganizationComponent,
    LayoutComponent,
    SideNavComponent,
    TopNavComponent,
    ProfileComponent,
    RediectComponent,
    InvitationComponent,
    OrganizationMembersComponent,
    StateComponent,
    ErrorComponent,
    CodeComponent,
    InvitationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MsalModule,
    NgbModule,
    DhtCommonModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule,
    ToastrModule.forRoot({timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BreadcrumbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    OrganizationService,
    UserService,
    SprintService,
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
