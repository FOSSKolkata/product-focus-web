import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/dht-common/models';
import { TestCase, TestCaseInput, TestPlanDetails, TestStep, TestStepInput, TestSuite, TestSuiteInput, UpdateTestCaseInput } from '../models.ts';
import { TestCaseService } from '../_services/test-case.service';
import { TestPlanService } from '../_services/test-plan.service';
import { TestSuiteService } from '../_services/test-suite.service';
enum TestCaseMode {
  Add = 1,
  Update = 2
}
@Component({
  selector: 'app-test-suites',
  templateUrl: './test-suites.component.html',
  styleUrls: ['./test-suites.component.scss']
})
export class TestSuitesComponent implements OnInit {

  // productDocumentationsMock: string[] = ["documentation 1", "documentation 2"];
  // productDocumentations: FlatProductDocumentation[] = [];
  // private _selectedDocumentation !: FlatProductDocumentation;
  // set selectedDocumentation(documentation: FlatProductDocumentation) {
  //   if(typeof documentation === 'object') {
  //     this._selectedDocumentation = documentation;
  //     //do stuff in model
  //   }
  // }
  // selectedDocumentationMock = this.productDocumentationsMock[0];
  addSuiteVisible = false;
  testStepsMock: {step: number, action: string, expectedResult: string}[] = [];
  modeMock = TestCaseMode.Add;
  selectedProduct!: IProduct;
  testPlanDetails!: TestPlanDetails;
  newTestSuiteInput: TestSuiteInput;
  private suiteId: number;
  selectedTestSuite!: TestSuite;
  newTestCaseInput: TestCaseInput;

  newTestStepAddMode = false;
  newTestStepAction = '';
  newTestStepExpectedResult = '';

  testCaseInputForUpdate!: TestCase;
  testSuiteTitleForDisplay = '';

  constructor(private testPlanService: TestPlanService,
    private route: ActivatedRoute,
    private router: Router,
    // private productDocService: ProductDocumentationService
    private testSuiteService: TestSuiteService,
    private tostr: ToastrService,
    private testCaseService: TestCaseService) {
      this.suiteId = Number(this.route.snapshot.paramMap.get('suiteId'));
      this.newTestSuiteInput = new TestSuiteInput(this.suiteId,'');
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
    // this.productDocService.getFlatProductDocumentationsByProductId(this.selectedProduct.id).subscribe(x => {
    //   this.productDocumentations = x;
    // })
  }

  setTestPlanDetails(): void {
    this.testPlanService.getTestPlanDetails(this.suiteId, this.selectedProduct.id).subscribe(x => {
      this.testPlanDetails = x;
      console.log(x);
      if(this.testPlanDetails.testSuites) {
        this.selectedTestSuite = this.testPlanDetails.testSuites[0];
      }
    });
  }

  addTestSuite() {
    this.testSuiteService.addTestSuite(this.newTestSuiteInput).subscribe(x => {
      this.tostr.success('Test Suites added.', 'Success');
      this.setTestPlanDetails();
    }, err=> {
      this.tostr.error(err.error,'Failed');
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
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }

  addSuiteVisibilityToggle(visibility: boolean) {
    this.addSuiteVisible = visibility;
  }

  addTestStepMock() {
    this.testStepsMock.push({step: this.testStepsMock.length + 1, action: '', expectedResult: ''});
  }

  removeTestStep(testCase: TestCaseInput, step: TestStepInput) {
    testCase.removeTestStep(step);
  }
  removeTestStepInUpdate(step: TestStep) {
    // this.testCaseInputForUpdate.removeTestStep(step);
    this.testCaseInputForUpdate.print();
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

  onTestCaseSelection(testSuiteId: number, testCaseId: number) {
    let testSuite = this.testPlanDetails.testSuites.filter(suite => suite.testSuiteId == testSuiteId).shift();
    let testCase = testSuite?.testCases.filter(testCase => testCase.testCaseId == testCaseId).shift();
    if(!testSuite || !testCase) {
      throw('not found');
    }
    this.testCaseInputForUpdate = testCase;
    this.testSuiteTitleForDisplay = testSuite.testSuiteTitle;
    this.modeMock = TestCaseMode.Update;
  }

  updateExistingTestCase() {
    console.log(this.testCaseInputForUpdate);
  }

  // searchProductDocumentation: OperatorFunction<string, readonly FlatProductDocumentation[]> = (text$: Observable<string>) => {
  //   return text$.pipe(
  //     debounceTime(200),
  //     map(term => term === '' ? []
  //       : this.productDocumentations.filter(x => x.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0,10))
  //   )
  // }

  // productDocumentationFormatter = (x: FlatProductDocumentation) => x.title;

  get testCaseModeMock() : typeof TestCaseMode {
    return TestCaseMode;
  }

}
