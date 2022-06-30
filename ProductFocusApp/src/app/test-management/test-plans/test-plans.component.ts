import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestPlan } from '../models';
import { TestPlanService } from '../_services/test-plan.service';

@Component({
  selector: 'app-test-plans',
  templateUrl: './test-plans.component.html',
  styleUrls: ['./test-plans.component.scss']
})
export class TestPlansComponent implements OnInit {
  productId: number;
  testPlans: TestPlan[] = [];

  constructor(private testManagement: TestPlanService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.parent?.params['id'];
    }

  ngOnInit(): void {
    this.testManagement.getTestPlansByProductId(this.productId).subscribe(x => {
      this.testPlans = x;
    })
  }

}
