import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  constructor() { }
  // @ViewChild("inputText") set inputTextRef(ref: ElementRef) {
  //   if (ref) {
  //     ref.nativeElement.focus();
  //   }
  // }
  ngOnInit(): void {
  }
  keyword = 'name';
  data = [
     {
       id: 1,
       name: 'PNR medication needs to transfer to a new tab'
     },
     {
       id: 2,
       name: 'Login button is not aligned properly.'
     },
     {
       id: 3,
       name: 'Title in progress 1'
     }
  ];
  tagName: string = '';
  taglist: Array<{id:number,name:string}> = [];
  isAddTagActive:boolean = false;
  addTag(item: any){
    this.taglist.push({id:this.taglist.length,name:item.name});
    this.isAddTagActive = false;
    var index = this.data.indexOf(item);
    this.data.splice(index,1);
    setTimeout(()=>this.tagName = '',0);
  }

  removeTag(tagDetails: {id: number, name: string}){
    var index = this.taglist.indexOf(tagDetails);
    this.data.push(tagDetails);
    this.taglist.splice(index,1);
  }

  deactiveAddTag(){
    setTimeout(()=>this.isAddTagActive=false,0);
  }

  activeAddTag(){
    setTimeout(()=>this.isAddTagActive=true,0);
  }
}
