import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFeature } from '../../dht-common/models';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent implements OnInit {
  @Input('feature') feature: IFeature = {
    id: -1,
    moduleId: -1,
    title: '',
    status: 0,
    workItemType: 0,
    isBlocked: false,
    plannedStartDate: new Date(),
    plannedEndDate: new Date(),
    actualStartDate: new Date(),
    actualEndDate: new Date(),
    assignees: [],
    storyPoint: 0,
    workCompletionPercentage: 0
  };

  @Output('modal-closed') modalClosed = new EventEmitter<boolean>();
  detailsChanged: boolean = false;
  closeResult = '';

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void { }

  openFeatureDetailsModal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'Feature details', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          if (this.detailsChanged) this.modalClosed.emit(true);
        }
      );
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
