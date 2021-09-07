import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IInvitationInput } from '../dht-common/models';
import { InvitationService } from '../_services/invitation.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {
  invitationData!: IInvitationInput;
  accepting = false;
  rejecting = false;

  constructor(private dataRoute: ActivatedRoute,
    private invitationService: InvitationService,
    private router: Router,
    private modalService: NgbModal) {}

  ngOnInit(): void {
    this.invitationData = {invitationId: this.dataRoute.snapshot.queryParams.iid};
    // const invitationInfo = JSON.parse(this.dataRoute.snapshot.params.invitationInfo);
    // const email = this.authService.instance.getAllAccounts()[0].username;

    // this.invitationData = {
    //   invitationId: invitationInfo['inId'],
    //   orgId: invitationInfo['orId'],
    //   email: email
    // };
  }

  acceptInvitation(){
    this.accepting = true;
    this.invitationService.acceptInvitation(this.invitationData).subscribe(x => {
      this.accepting = false;
      this.router.navigate(['/']);
    }, err => {
      this.accepting = false;
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
    });
  }
}