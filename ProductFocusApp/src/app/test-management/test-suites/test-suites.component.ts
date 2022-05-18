import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/dht-common/models';
import { TestPlanDetails } from '../models.ts';
import { TestPlanService } from '../_services/test-plan.service';
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

  productDocumentationsMock: string[] = ["documentation 1", "documentation 2"];
  selectedDocumentationMock = this.productDocumentationsMock[0];
  addSuiteVisible = true;
  testStepsMock: {step: number, action: string, expectedResult: string}[] = [];
  modeMock = TestCaseMode.Update;
  selectedProduct!: IProduct;
  testPlanDetails!: TestPlanDetails;

  constructor(private testPlanService: TestPlanService,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    let suiteId = Number(this.route.snapshot.paramMap.get('suiteId'));
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(!selectedProductString) {
      this.router.navigate(['..']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.testPlanService.getTestPlanDetails(suiteId, this.selectedProduct.id).subscribe(x => {
      this.testPlanDetails = x;
      console.log(x);
    });
  }

  addSuiteVisibilityToggle(visibility: boolean) {
    this.addSuiteVisible = visibility;
  }

  addTestStepMock() {
    this.testStepsMock.push({step: this.testStepsMock.length + 1, action: '', expectedResult: ''});
  }

  removeTestStepMock(step: number) {
    this.testStepsMock = this.testStepsMock.filter(testStep => testStep.step != step);
    this.testStepsMock.map((testStep, index) => {
      testStep.step = index + 1;
    });
  }

  get testCaseModeMock() : typeof TestCaseMode {
    return TestCaseMode;
  }

}
