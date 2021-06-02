import { unsupported } from '@angular/compiler/src/render3/view/util';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
    title: '',
    status: 0,
    workItemType: 0,
    isBlocked: false,
    plannedStartDate: new Date(),
    plannedEndDate: new Date(),
    actualStartDate: new Date(),
    actualEndDate: new Date()
  };

  @Output('modal-closed') modalClosed = new EventEmitter<boolean>();

  detailsChanged: boolean = false;
  closeResult = '';

  constructor(private modalService: NgbModal,
              private router: Router) { }

  ngOnInit(): void {
    var lastSelectedOrgId = localStorage.getItem("lastSelctedOrganizationId");
    if(lastSelectedOrgId == null || lastSelectedOrgId == undefined)
      this.router.navigate(["organization-home"])
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
      if(this.detailsChanged)
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