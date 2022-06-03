import { Pipe, PipeTransform } from '@angular/core';
import { ITestRunSuite } from '../models.ts';

@Pipe({
  name: 'suiteCount',
  pure: false
})
export class SuiteCountPipe implements PipeTransform {

  transform(testRunSuites : ITestRunSuite[] | undefined): number {
    if(!testRunSuites)
      return 0;
    let count = 0;
    testRunSuites.forEach(testSuite => {
      let isAllSelected = false;
      testSuite.testCases.forEach(testCase => {
        isAllSelected ||= testCase.isIncluded;
      });
      count += isAllSelected ? 1 : 0;
    });
    return count;
  }

}
