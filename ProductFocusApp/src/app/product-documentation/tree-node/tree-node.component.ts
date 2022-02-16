import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductDocumentation, TreeContainer } from '../model';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss']
})
export class TreeNodeComponent implements OnInit {
  @Input('node') node!: ProductDocumentation;
  @Output('topParent') topParent = new EventEmitter<TreeContainer>();
  @Output('onAddClick') onAddClick = new EventEmitter<TreeContainer>();
  
  constructor() { }

  ngOnInit(): void {
  }

  getTopParentDocumentation(productDocumentation: ProductDocumentation, parentDocumentation: ProductDocumentation) {
    let index = 1;
    for(let child of this.node.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
        // this.topParent.emit(new TopParentDetails(child,index));
        this.topParent.emit(new TreeContainer(child, parentDocumentation, productDocumentation, index));
        break;
      }
      index++;
    }
  }

  // sendAddDocumentationId(productDocumentation: ProductDocumentation, documentationId: number | null | undefined) {
  //   let index = 1;
  //   for(let child of this.node.childDocumentations) {
  //     if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
  //       this.onAddClick.emit({topParentDetails: new TopParentDetails(child,index), parentDocumentationId: documentationId});
  //       // this.topParent.emit(new TopParentDetails(child,index));
  //       break;
  //     }
  //     index++;
  //   }
  // }

  sendAddDocumentationId(productDocumentation: ProductDocumentation, parentDocumentation: ProductDocumentation) {
    let index = 1;
    for(let child of this.node.childDocumentations) {
      if(this.getTopParentDocumentationHelper(child, productDocumentation.id)) {
        this.onAddClick.emit(new TreeContainer(child, parentDocumentation, productDocumentation, index));
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
