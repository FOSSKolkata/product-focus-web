import { Component, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { IBusinessRequirements, IProduct, ITag } from '../dht-common/models';
import { BusinessRequirementService } from '../_services/business-requirement.service';
import { TagService } from '../_services/tag.service';

enum DateType {
  startDate = 1,
  endDate = 2
}

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
  selectedProduct!: IProduct;
  businessRequirementList!: IBusinessRequirements;
  businessRequirementSortedList!: IBusinessRequirements;
  offset = 0;
  count = 5;
  pageNo = 1;

  constructor(private businessReqService: BusinessRequirementService,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute) { }

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
    this.route.paramMap.subscribe(x => {
      let pageMayBeNull = x.get('pageNo');
      this.pageNo = pageMayBeNull ? Number(pageMayBeNull) : 1;
      this.offset = (this.pageNo - 1) * this.count;
      this.setBusinessRequirement();
    })
  }

  setBusinessRequirement(): void {
    let selectedTagIds: number[] = [];
    for(let tag of this.selectedTags) {
      selectedTagIds.push(tag.id);
    }
    this.businessReqService.getBusinessRequirementListByProductId(
      this.selectedProduct.id,
      selectedTagIds,
      this.startDate,
      this.endDate,this.offset,this.count).subscribe(x => {
        this.businessRequirementList = x;
        this.businessRequirementSortedList = x;
    });
  }

  removeTag(tag: ITag) {
    this.selectedTags = this.selectedTags.filter(x => x != tag);
    this.tags.push(tag);
    this.setBusinessRequirement();
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    this.selectedTags.push({id: event.option.value, name: event.option.viewValue});
    this.tags = this.tags.filter(x => x.id != event.option.value);
    this.setBusinessRequirement();
  }

  selectedDate(event: Date, dateType: DateType) {
    if(dateType === DateType.startDate) {
      this.startDate = event;
    } else {
      this.endDate = event;
    }
    this.setBusinessRequirement();
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
    this.router.navigate(['../',event.pageIndex + 1], {relativeTo: this.route});
  }

  public get dateType(): typeof DateType {
    return DateType;
  }
}
