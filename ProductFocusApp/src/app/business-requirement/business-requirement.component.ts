import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBusinessRequirement, IProduct, ITag } from '../dht-common/models';
import { BusinessRequirementService } from '../_services/business-requirement.service';
import { TagService } from '../_services/tag.service';

@Component({
  selector: 'app-business-requirement',
  templateUrl: './business-requirement.component.html',
  styleUrls: ['./business-requirement.component.scss']
})
export class BusinessRequirementComponent implements OnInit {

  startDate!: Date;
  endDate!: Date;
  tags: ITag[] = [];
  selectedTags: ITag[] = [];
  selectedTagIds: number[] = [];
  selectedProduct!: IProduct;
  businessRequirements: IBusinessRequirement[] = [];

  constructor(private businessReqService: BusinessRequirementService,
    private tagService: TagService,
    private router: Router) { }

  ngOnInit(): void {
    let selectedProductString = localStorage.selectedProduct;
    if(!selectedProductString) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);

    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x;
    });
    this.businessReqService.getBusinessRequirementListByProductId(
      this.selectedProduct.id,
      this.selectedTagIds,
      this.startDate,
      this.endDate).subscribe(x => {
        this.businessRequirements = x as IBusinessRequirement[];
    })
  }

}
