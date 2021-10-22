import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { IInvitationDetails, IInvitationInput } from '../dht-common/models';
import { InvitationService } from '../_services/invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  invitationData!: IInvitationInput;
  invalidLink: HttpErrorResponse | undefined;
  accepting = false;
  rejecting = false;
  invitationDetails: IInvitationDetails | undefined;

  constructor(private dataRoute: ActivatedRoute,
    private invitationService: InvitationService,
    private router: Router,
    private modalService: NgbModal,
    private tostr: ToastrService) {}

  ngOnInit(): void {
    let invitationId = this.dataRoute.snapshot.queryParams.iid;
    this.invitationData = {invitationId: invitationId};
    this.setInvitationDetails(invitationId);
  }

  setInvitationDetails(invitationId: number) {
    this.invitationService.getInvitationById(invitationId).subscribe(x => {
        this.invitationDetails = x
      },err => {
        this.invalidLink = err;
      }
    );
  }

  acceptInvitation(){
    this.accepting = true;
    this.invitationService.acceptInvitation(this.invitationData).subscribe(x => {
      this.accepting = false;
      this.router.navigate(['/']);
    }, err => {
      this.accepting = false;
      this.tostr.error('Error', err.error);
    })
  }

  openRejectInvitation(content: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', centered: true }).result.then((result) => {
      
    }, (reason) => {

    });
  }

  rejectInvitation(modal: any){
    this.rejecting = true;
    this.invitationService.rejectInvitation(this.invitationData).subscribe(x => {
      modal.close();
      this.rejecting = false;
      this.router.navigate(["/"]);
    }, err => {
      this.rejecting = false;
      this.tostr.error('Error', err.error);
    });
  }
}