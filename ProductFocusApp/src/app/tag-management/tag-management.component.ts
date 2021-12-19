import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProduct, ITag } from '../dht-common/models';
import { TagService } from '../_services/tag.service';

@Component({
  selector: 'app-tag-management',
  templateUrl: './tag-management.component.html',
  styleUrls: ['./tag-management.component.scss']
})
export class TagManagementComponent implements OnInit {

  tags: ITag[] = [] ;
  selectedProduct!: IProduct;
  constructor(private tagService: TagService,
    private router: Router) { }
  
  ngOnInit(): void {
    let selectedProductString = localStorage.getItem('selectedProduct');
    if(selectedProductString === null) {
      this.router.navigate(['/']);
      return;
    }
    this.selectedProduct = JSON.parse(selectedProductString);
    this.tagService.getTagListByProductId(this.selectedProduct.id).subscribe(x => {
      this.tags = x;
    })
  }
  remove(tag: ITag) {
    //delete
    console.log(tag);
  }
  
}
