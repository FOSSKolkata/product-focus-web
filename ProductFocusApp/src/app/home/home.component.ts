import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { b2cPolicies } from '../b2c-config';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  login() {
    window.location.href =
      'https://dumanhillb2c.b2clogin.com/dumanhillb2c.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_susi&client_id=165777d2-f326-4211-a9a3-a5fe12b9c516&nonce=defaultNonce&redirect_uri=http%3A%2F%2Flocalhost%3A4200&scope=openid&response_type=id_token&prompt=login';
  }
}
