import { Pipe, PipeTransform } from '@angular/core';
import { ITestRunSuite } from '../models.ts';

@Pipe({
  name: 'caseCount',
  pure: false
})
export class CaseCountPipe implements PipeTransform {

  transform(testRunSuites: ITestRunSuite[] | undefined): number {
    if(!testRunSuites)
      return 0;
    let count = 0;
    testRunSuites.forEach(testSuite => {
      testSuite.testCases.forEach(testCase => {
        count += testCase.isIncluded ? 1 : 0;
      });
    });
    return count;
  }

}
