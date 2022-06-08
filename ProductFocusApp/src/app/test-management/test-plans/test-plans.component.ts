import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct } from 'src/app/dht-common/models';
import { TestPlan } from '../models';
import { TestPlanService } from '../_services/test-plan.service';

@Component({
  selector: 'app-test-plans',
  templateUrl: './test-plans.component.html',
  styleUrls: ['./test-plans.component.scss']
})
export class TestPlansComponent implements OnInit {

  selectedProduct!: IProduct;
  testPlans: TestPlan[] = [];

  constructor(private testManagement: TestPlanService,
    private router: Router) { }

  ngOnInit(): void {
    let selectedProductString = localStorage.getItem("selectedProduct");
    if(!selectedProductString) {
      this.router.navigate(['/']);
    }
    this.selectedProduct = JSON.parse(selectedProductString??'');
    this.testManagement.getTestPlansByProductId(this.selectedProduct.id).subscribe(x => {
      this.testPlans = x;
    })
  }

}
