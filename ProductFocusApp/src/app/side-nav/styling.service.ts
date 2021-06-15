import { Injectable } from '@angular/core';

import { ReplaySubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StylingService {
  sharedStyleSource = new ReplaySubject<any>(1);
  public sharedStyle$ = this.sharedStyleSource.asObservable();

  constructor() {}

  newStyle(value: any) {
    this.sharedStyleSource.next(value);
  }
}
