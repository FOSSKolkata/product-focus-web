import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITestRun, TestTypeEnum } from '../models.ts';

@Injectable({
  providedIn: 'root'
})
export class TestExecutionService {

  private testRunBehaviorSubject!: BehaviorSubject<ITestRun>;
  testRunObserver!: Observable<ITestRun>;

  constructor() {

    this.testRunBehaviorSubject = new BehaviorSubject({} as ITestRun);
    this.testRunObserver = this.testRunBehaviorSubject.asObservable();
  }

  updateTestRun(testRun: ITestRun): void {
    this.testRunBehaviorSubject.next(testRun);
  }

}
