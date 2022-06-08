import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Feature, IProduct, ISprint } from 'src/app/dht-common/models';
import { FlatProductDocumentation } from 'src/app/product-documentation/model';
import { ProductDocumentationService } from 'src/app/product-documentation/_services/product-documentation.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { SprintService } from 'src/app/_services/sprint.service';
import { AddTestPlanInput, TestTypeEnum } from '../models';
import { TestPlanService } from '../_services/test-plan.service';

@Component({
  selector: 'app-new-test-plan',
  templateUrl: './new-test-plan.component.html',
  styleUrls: ['./new-test-plan.component.scss']
})
export class NewTestPlanComponent implements OnInit {

  sprints: ISprint[] = [];
  testTypes: {name: string, position: number}[] = [];
  selectedType : {name: string, position: number};
  newTestPlanInput!: AddTestPlanInput;
  selectedProduct!: IProduct;
  features: Feature[] = [];
  productDocumentations: FlatProductDocumentation[] = [];
  private _selectedDocumentation !: FlatProductDocumentation;
  private _selectedWorkItem!: Feature;

  set selectedDocumentation(documentation: FlatProductDocumentation) {
    if(typeof documentation === 'object') {
      this._selectedDocumentation = documentation;
      this.newTestPlanInput.productDocumentationId = documentation.id;
      this.newTestPlanInput.workItemId = null;
    }
  }

  set selectedWorkItem(workItem: Feature) {
    if(typeof workItem === 'object') {
      this._selectedWorkItem = workItem;
      this.newTestPlanInput.workItemId = workItem.id;
      this.newTestPlanInput.productDocumentationId = null;
    }
  }

  constructor(private testManagement: TestPlanService,
    private sprintService: SprintService,
    private router: Router,
    private productDocumentationService: ProductDocumentationService,
    private featureService: FeatureService,
    private tostr: ToastrService) {

      this.selectedType = { name: TestTypeEnum.RegressionTest.toString(), position: Number(TestTypeEnum.RegressionTest) };
      for(const testType in TestTypeEnum) {
        if(isNaN(Number(testType))) {
          this.testTypes.push({name: testType, position: Number(TestTypeEnum[testType])})
        }
      }
      let selectedProductString = localStorage.getItem('selectedProduct');
      if(!selectedProductString) {
        this.router.navigate(['/']);
        return;
      }
      this.selectedProduct = JSON.parse(selectedProductString);
      this.newTestPlanInput = new AddTestPlanInput(this.selectedProduct.id, -1, TestTypeEnum.RegressionTest, null, null, '');
    }

  ngOnInit(): void {
    
    this.sprintService.getSprintByProductId(this.selectedProduct.id).subscribe(x => {
      this.sprints = x;
      this.newTestPlanInput.sprintId = x[0].id;
    });

    this.featureService.getFeatureListByProductId(this.selectedProduct.id).subscribe(x => {
      this.features = x;
    });

    this.productDocumentationService.getFlatProductDocumentationsByProductId(this.selectedProduct.id).subscribe(x => {
      this.productDocumentations = x;
    });
  }

  selectTestType(selectedTestType: {name: string, position: number}) {
    this.selectedType = selectedTestType;
    for(let [key, value] of Object.entries(TestTypeEnum)) {
      if(!isNaN(Number(key))) {
        continue;
      }
      if(selectedTestType.name === key) {
        this.newTestPlanInput.testType = Number(value);
      }
    }
  }

  searchProductDocumentation: OperatorFunction<string, readonly FlatProductDocumentation[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.productDocumentations.filter(x => x.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0,10))
    )
  }

  productDocumentationFormatter = (x: FlatProductDocumentation) => x.title;

  searchWorkItem: OperatorFunction<string, readonly Feature[]> = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.features.filter(x => x.title.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1).slice(0,10))
    )
  }
  workItemFormatter = (x: Feature) => x.title;

  createNewTestPlan() {
    this.testManagement.addTestPlan(this.newTestPlanInput).subscribe(x => {
      this.tostr.success('Test Plan Created','success');
      this.newTestPlanInput = new AddTestPlanInput(this.selectedProduct.id, -1, TestTypeEnum.RegressionTest, null, null, '');
    }, err => {
      this.tostr.error('Failed to add test plan',err.error);
    })
  }
  
  get testTypeEnum(): typeof TestTypeEnum {
    return TestTypeEnum;
  }

}
