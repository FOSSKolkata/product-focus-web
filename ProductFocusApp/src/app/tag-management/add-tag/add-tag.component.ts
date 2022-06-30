import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAddTag, ITagCategory } from '../models';
import { TagCategoriesService } from '../_services/tag-categories.service';
import { TagService } from '../_services/tag.service';
import { TagManagementService } from '../services/tag-management.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  tagCategories: ITagCategory[] = [];
  selectedCategoryId: number | null = null;
  tagName = "";
  adding = false;
  productId: number;
  
  constructor(private tagCategoryService: TagCategoriesService,
    private tagService: TagService,
    private tostr: ToastrService,
    private tagManagementService: TagManagementService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.parent?.params['id'];
    }

  ngOnInit(): void {
    this.tagCategoryService.getTagCategories(this.productId).subscribe(x => {
      this.tagCategories = x;
    }, err => {
      this.tostr.error(err.error, 'Please refresh page');
    })
  }

  addTag(tag: {name: string}) {
    let addTagInput: IAddTag = {
      name: tag.name,
      tagCategoryId: this.selectedCategoryId
    };
    this.adding = true;
    this.tagService.addTag(this.productId, addTagInput).pipe(
      finalize(() => {
        this.adding = false;
      })
    ).subscribe(x => {
      this.tostr.success('Tag added', 'Success');
      this.tagService.getTagListByProductId(this.productId).subscribe(x => {
        this.tagManagementService.updateTags(x);
      })
    },err =>
      this.tostr.error(err.error,'Not added')
    );
  }

}
