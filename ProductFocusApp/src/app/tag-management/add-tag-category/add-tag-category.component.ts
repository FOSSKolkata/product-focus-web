import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-tag-category',
  templateUrl: './add-tag-category.component.html',
  styleUrls: ['./add-tag-category.component.scss']
})
export class AddTagCategoryComponent implements OnInit {

  constructor() { }
  tagName = "";
  ngOnInit(): void {
  }

  addTagCategory(data: any) {
    console.log(data);
  }

}
