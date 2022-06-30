import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAddTagCategory } from '../models';
import { TagCategoriesService } from '../_services/tag-categories.service';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-tag-category',
  templateUrl: './add-tag-category.component.html',
  styleUrls: ['./add-tag-category.component.scss']
})
export class AddTagCategoryComponent implements OnInit {
  tagCategoryName = "";
  productId: number;
  adding = false;
  constructor(private tagCategoryService: TagCategoriesService,
    private tostr: ToastrService,
    private route: ActivatedRoute) {
      this.productId = this.route.snapshot.parent?.params['id'];
    }
  
  ngOnInit(): void { }

  addTagCategory(tagCategory: IAddTagCategory) {
    this.adding = true;
    this.tagCategoryService.addTagCategories(this.productId,tagCategory).pipe(
      finalize(() => {
        this.adding = false;
      })
    ).subscribe(x => {
      this.tostr.success('Tag added', 'Success');
    }, err => {
      this.tostr.error(err.error, 'Not added');
    })
  }

}
