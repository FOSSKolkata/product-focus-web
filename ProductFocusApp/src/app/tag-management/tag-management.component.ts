import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ITag } from './models';
import { TagService } from './_services/tag.service';
import { TagManagementService } from './services/tag-management.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit, OnDestroy {
  productId: number;
  tags: ITag[] = [] ;
  tagManagementServiceSubstription: Subscription;
  constructor(private tagService: TagService,
    private tostr: ToastrService,
    private tagManagementService: TagManagementService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.params['id']; 
      this.tagManagementServiceSubstription = this.tagManagementService.tagSubject.subscribe(x => {
        this.tags = x;
      });
    }
  ngOnDestroy(): void {
    this.tagManagementServiceSubstription.unsubscribe();
  }
  
  ngOnInit(): void {
    this.setTagList();
  }

  setTagList() {
    this.tagService.getTagListByProductId(this.productId).subscribe(x => {
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
