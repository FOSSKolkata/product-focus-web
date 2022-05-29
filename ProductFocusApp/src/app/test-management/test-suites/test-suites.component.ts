import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/dht-common/models';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ITestSuiteOrder, TestCase, TestCaseInput, TestPlanDetails, TestStep, TestStepInput, TestSuite, TestSuiteInput, UpdateTestCaseInput, UpdateTestStepInput } from '../models.ts';
import { TestCaseService } from '../_services/test-case.service';
import { TestPlanService } from '../_services/test-plan.service';
import { TestRunService } from '../_services/test-run.service';
import { TestSuiteService } from '../_services/test-suite.service';
enum TestCaseMode {
  Add = 1,
  Update = 2
}
enum TestSuiteMovementDirection {
  Up = 1,
  Down = 2
}
@Component({
  selector: 'app-test-suites',
  templateUrl: './test-suites.component.html',
  styleUrls: ['./test-suites.component.scss']
})
export class TestSuitesComponent implements OnInit {
  addSuiteVisible = false;
  testMode = TestCaseMode.Add;
  selectedProduct!: IProduct;
  testPlanDetails!: TestPlanDetails;
  newTestSuiteInput: TestSuiteInput;
  private testPlanId: number;
  selectedTestSuite!: TestSuite;
  newTestCaseInput: TestCaseInput;

  newTestStepAddMode = false;
  newTestStepAddModeOnUpdate = false;
  newTestStepAction = '';
  newTestStepExpectedResult = '';

  testCaseInputForUpdate!: TestCase;
  testSuiteTitleForDisplay = '';

  constructor(private testPlanService: TestPlanService,
    private route: ActivatedRoute,
    private router: Router,
    private testSuiteService: TestSuiteService,
    private tostr: ToastrService,
    private testCaseService: TestCaseService,
    private testRunService: TestRunService,
    private breadcrumbService: BreadcrumbService) {
      this.testPlanId = Number(this.route.snapshot.paramMap.get('testPlanId'));
      this.newTestSuiteInput = new TestSuiteInput(this.testPlanId,'');
      this.newTestCaseInput = new TestCaseInput('','',null,null,[]);
    }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(!selectedProductString) {
      this.router.navigate(['..']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.setTestPlanDetails();
  }

  setTestPlanDetails(): void {
    this.testPlanService.getTestPlanDetails(this.testPlanId, this.selectedProduct.id).subscribe(x => {
      this.testPlanDetails = x;
      if(this.testPlanDetails.testSuites.length > 0) {
        console.log(this.testPlanDetails.testSuites)
        this.selectTestSuite(this.testPlanDetails?.testSuites[0]);
      }
      this.breadcrumbService.set('@testPlanName', {
        label: this.testPlanDetails.testPlanTitle,
        routeInterceptor: (routeLink, breadcrumb) =>
          this.testPlanDetails.testPlanId.toString()
      });
    });
  }

  selectTestSuite(suite: TestSuite) {
    this.testMode = TestCaseMode.Add;
    this.selectedTestSuite = suite;
    this.newTestCaseInput = new TestCaseInput('','',this.testPlanId,this.selectedTestSuite.testSuiteId,[]);
  }

  addTestSuite(testSuiteForm: any) {
    this.testSuiteService.addTestSuite(this.newTestSuiteInput).subscribe(x => {
      this.tostr.success('Test Suites added.', 'Success');
      this.setTestPlanDetails();
      testSuiteForm.form.reset();
    }, err=> {
      this.tostr.error(err.error,'Failed');
    });
  }

  deleteTestSuite(suite: TestSuite) {
    this.testSuiteService.deleteTestSuite(suite.testPlanId, suite.testSuiteId).subscribe(x => {
      this.tostr.success('Test suite deleted', 'Success');
      this.setTestPlanDetails();
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  reorderTestSuite(direction: TestSuiteMovementDirection, testSuite: TestSuite) {
    for(let i = 0; i < this.testPlanDetails.testSuites.length; i++) {
      let suite = this.testPlanDetails.testSuites[i];
      if(suite == testSuite) {
        if(direction == TestSuiteMovementDirection.Up) {
          [this.testPlanDetails.testSuites[i-1], this.testPlanDetails.testSuites[i]] =
          [this.testPlanDetails.testSuites[i], this.testPlanDetails.testSuites[i-1]];
        } else {
          [this.testPlanDetails.testSuites[i+1], this.testPlanDetails.testSuites[i]] =
          [this.testPlanDetails.testSuites[i], this.testPlanDetails.testSuites[i+1]];
        }
        break;
      }
    }
    let suiteIds: ITestSuiteOrder[] = [];
    for(let testSuite of this.testPlanDetails.testSuites) {
      suiteIds.push({id: testSuite.testSuiteId});
    }
    this.testSuiteService.updateTestSuiteOrdering(this.testPlanId, suiteIds).subscribe(x => {
      
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  addTestCase() {
    if(this.newTestStepAddMode) {
      this.newTestCaseInput.addTestStep(this.newTestStepAction, this.newTestStepExpectedResult);
      this.newTestStepAction = '';
      this.newTestStepExpectedResult = '';
    }
    this.testCaseService.addTestCase(this.newTestCaseInput).subscribe(x => {
      this.tostr.success('Test case added', 'Success');
      this.setTestPlanDetails();
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  createTestRun() {
    this.testRunService.createTestRun(this.testPlanId).subscribe(x => {
      this.router.navigate(['../..','test-run', x], {relativeTo: this.route});
    }, err => {
      this.tostr.error(err.error, 'Failed');
    })
  }

  addSuiteVisibilityToggle(visibility: boolean) {
    this.addSuiteVisible = visibility;
  }

  removeTestStep(testCase: TestCaseInput, step: TestStepInput) {
    testCase.removeTestStep(step);
  }

  removeTestStepInUpdate(step: TestStep) {
    this.testCaseInputForUpdate.testSteps = this.testCaseInputForUpdate.testSteps.filter(testStep => testStep != step);
    this.testCaseInputForUpdate.testSteps.map((testStep, index) => {
        testStep.step = index + 1;
    });
  }

  addNewTestStep() {
    if(this.newTestStepAddMode) {
      this.newTestCaseInput.addTestStep(this.newTestStepAction,this.newTestStepExpectedResult);
      this.newTestStepAction = '';
      this.newTestStepExpectedResult = '';
    } else {
      this.newTestStepAddMode = true;
    }
  }

  addNewTestStepOnUpdate() {
    if(this.newTestStepAddModeOnUpdate) {
      this.testCaseInputForUpdate.testSteps.push(
        new TestStep(this.testCaseInputForUpdate.testCaseId,
          null, this.testCaseInputForUpdate.testSteps.length + 1,
          this.newTestStepAction,
          this.newTestStepExpectedResult
        )
      );
      this.newTestStepAction = '';
      this.newTestStepExpectedResult = '';
    } else {
      this.newTestStepAddModeOnUpdate = true;
    }
  }

  onTestCaseSelection(testSuiteId: number, testCaseId: number) {
    let testSuite = this.testPlanDetails.testSuites.filter(suite => suite.testSuiteId == testSuiteId).shift();
    let testCase = testSuite?.testCases.filter(testCase => testCase.testCaseId == testCaseId).shift();
    if(!testSuite || !testCase) {
      throw('not found');
    }
    this.testCaseInputForUpdate = testCase;
    this.testSuiteTitleForDisplay = testSuite.testSuiteTitle;
    this.testMode = TestCaseMode.Update;
  }

  updateExistingTestCase() {
    this.addNewTestStepOnUpdate();
    let updatedTestCase: UpdateTestCaseInput = {
      title: this.testCaseInputForUpdate.testCaseTitle,
      preconditions: this.testCaseInputForUpdate.preconditions,
      testSteps: []
    };
    this.testCaseInputForUpdate.testSteps.forEach(step => {
      let transformedStep:UpdateTestStepInput = {
        id: step.testStepId,
        action: step.action,
        expectedResult: step.expectedResult
      }
      updatedTestCase.testSteps.push(transformedStep);
    })
    this.testCaseService.updateTestCase(this.testCaseInputForUpdate.testCaseId, updatedTestCase).subscribe(x => {
      this.tostr.success('Test case updated', 'Success');
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  get testCaseMode() : typeof TestCaseMode {
    return TestCaseMode;
  }

  get testSuiteMovementDirection() : typeof TestSuiteMovementDirection {
    return TestSuiteMovementDirection;
  }

}
