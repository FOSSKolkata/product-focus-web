import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessRequirement, IBusinessRequirements, IProduct, ITag } from '../dht-common/models';
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
  businessRequirementList!: IBusinessRequirements;
  businessRequirementSortedList!: IBusinessRequirements;
  offset = 0;
  count = 2;
  pageNo = 1;

  constructor(private businessReqService: BusinessRequirementService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    let selectedProductString = localStorage.selectedProduct;
    if(!selectedProductString) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);

    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x;
    });
    let pageMayBeNull = this.route.snapshot.paramMap.get('pageNo');
    this.pageNo = pageMayBeNull ? Number(pageMayBeNull) : 1;
    this.offset = (this.pageNo - 1) * this.count;
    this.setBusinessRequirement()
  }

  setBusinessRequirement(): void {
    this.businessReqService.getBusinessRequirementListByProductId(
      this.selectedProduct.id,
      this.selectedTagIds,
      this.startDate,
      this.endDate,this.offset,this.count).subscribe(x => {
        this.businessRequirementList = x;
        this.businessRequirementSortedList = x;
    });
  }

  sortData(sort: Sort) {
    const data = this.businessRequirementList.businessRequirements.slice();
    if (!sort.active || sort.direction === '') {
      this.businessRequirementSortedList.businessRequirements = data;
      return;
    }

    this.businessRequirementSortedList.businessRequirements = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'receivedDate':
          return this.compare(a.receivedOn, b.receivedOn, isAsc);
        default:
          return 0;
      }
    });
  }
  
  compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    if(a instanceof Date && b instanceof Date){
      return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1);
    }
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  pageChange(event: any){
    this.offset = this.count * event.pageIndex;
    this.setBusinessRequirement();
  }
}
