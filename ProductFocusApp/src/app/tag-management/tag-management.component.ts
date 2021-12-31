import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProduct, ITag } from '../dht-common/models';
import { TagService } from '../_services/tag.service';
import { TagManagementService } from './services/tag-management.service';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit, OnDestroy {

  tags: ITag[] = [] ;
  selectedProduct!: IProduct;
  tagManagementServiceSubstription: Subscription;
  constructor(private tagService: TagService,
    private router: Router,
    private tostr: ToastrService,
    private tagManagementService: TagManagementService) { 
      this.tagManagementServiceSubstription = this.tagManagementService.tagSubject.subscribe(x => {
        this.tags = x;
      });
    }
  ngOnDestroy(): void {
    this.tagManagementServiceSubstription.unsubscribe();
  }
  
  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.setTagList();
  }

  setTagList() {
    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x;
    });
  }

  remove(tag: ITag) {
    this.tagService.deleteTagById(tag.id).subscribe(x => {
      this.tags = this.tags.filter(curr => curr !== tag);
      this.tagManagementService.updateTags(this.tags);
      this.tostr.success('Tag deleted','Success');
    }, err => {
      this.tostr.error(err.error, 'Failed');
    });
  }
}
