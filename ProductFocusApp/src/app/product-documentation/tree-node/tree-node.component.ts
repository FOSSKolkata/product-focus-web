import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProductDocumentation, TopParentDetails } from '../model';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  @Input('node') node!: ProductDocumentation;
  @Output('scrollTo') scrollTo = new EventEmitter<number>();
  @Output('topParent') topParent = new EventEmitter<TopParentDetails>();
  constructor(private router: Router) { }
  

  ngOnInit(): void {
  }

  print(mes1: string, mes2: number){
    console.log(mes1, mes2);
  }

  scroll(position: number) {
    this.scrollTo.emit(position);
  }

  getTopParentDocumentation(productDocumentation: ProductDocumentation) {
    let index = 1;
    for(let child of this.node.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
        this.topParent.emit(new TopParentDetails(child,index));
        break;
      }
      index++;
    }
  }

  private getTopParentDocumentationHelper(current: ProductDocumentation, id: number): boolean {
    if(current.id === id)
      return true;
    for(let child of current.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, id)) {
        return true;
      }
    }
    return false;
  }
}
