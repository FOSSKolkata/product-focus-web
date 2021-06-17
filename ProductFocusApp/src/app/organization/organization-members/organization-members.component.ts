import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { IMemberDetailsList, ISendInvitationInput, IUser } from 'src/app/dht-common/models';
import { InvitationService } from 'src/app/_services/invitation.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.css'],
})
export class OrganizationMembersComponent implements OnInit {
  users: IUser[] = [];
  closeResult = '';
  invitationStatusText = 'Send invitation to join';
  sendingInvitationActive = false;
  selectedUser!: IUser | string;
  lastSelctedOrganizationId!: number;
  organizationMemberList: IMemberDetailsList = {
    recordCount : 0,
    members : []
  };

  constructor(
    private modalService: NgbModal,
    private invitationService: InvitationService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (!localStorage.lastSelctedOrganizationId) this.router.navigate(['/']);
    this.lastSelctedOrganizationId = localStorage.lastSelctedOrganizationId;
    this.userService.getUserListByOrganization(this.lastSelctedOrganizationId).subscribe(x => {
      console.log("organization user",x);
      this.organizationMemberList = x;
    })
    this.invitationService.getUserListNotPartOfOrganization(this.lastSelctedOrganizationId).subscribe(x => {
      console.log("user",x);
      this.users = x;
    })
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  formatter = (user: IUser) => user.email;
  formatterResult = (user: IUser) => user.email + "(" + user.name + ")";

  search: OperatorFunction<string, readonly IUser[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.users
          .filter((user) => user.email.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    );

  sendInvitation() {
    this.sendingInvitationActive = true;
    var invitationInput: ISendInvitationInput = {
      email: '',
      orgId: this.lastSelctedOrganizationId
    };
    if(typeof(this.selectedUser) == "string"){
      invitationInput.email = this.selectedUser;
    }else{
      invitationInput.email = this.selectedUser.email;
    }
    this.invitationService.sendInvitation(invitationInput).subscribe(
      (x) => {
        this.sendingInvitationActive = false;
        this.invitationStatusText = 'Completed';
        setTimeout(() => {
          this.invitationStatusText = 'Send invitation to join';
        }, 2000);
      },
      (err) => {
        this.sendingInvitationActive = false;
        console.log(err);
      }
    );
  }
}
