import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Feature } from '../../dht-common/models';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit, OnDestroy {

  @Input('feature') feature: Feature = {
    id: -1,
    moduleId: -1,
    title: ''
  };
  @Output('modal-closed') modalClosed = new EventEmitter<boolean>();

  closeResult = '';

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {

  }
  content: any;

  ngOnDestroy(): void{
    
  }

  openFeatureDetailsModal(content:any) {
    console.log(content);
    this.modalService.open(content, {ariaLabelledBy: 'Feature details', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
      this.modalClosed.emit(true);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}