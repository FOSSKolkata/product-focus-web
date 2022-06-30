import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, OperatorFunction } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { IMemberDetailsList, IOrganization, ISendInvitationInput, IUser } from 'src/app/dht-common/models';
import { InvitationService } from 'src/app/_services/invitation.service';
import { OrganizationService } from 'src/app/_services/organization.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss'],
})
export class OrganizationMembersComponent implements OnInit {
  private organization!: IOrganization;
  private organizationName: string;
  usersMail: string[] = [];
  closeResult = '';
  sendingInvitationActive = false;
  selectedMail!: string;
  gettingUserList = false;
  organizationMemberList: IMemberDetailsList = {
    recordCount : 0,
    members : []
  };

  constructor(
    private modalService: NgbModal,
    private invitationService: InvitationService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private organizationService: OrganizationService
  ) {
    this.organizationName = this.route.snapshot.parent?.params['organizationName'];
  }

  async ngOnInit(): Promise<void> {
    this.organization = await this.organizationService.getOrganizationByName(this.organizationName).toPromise();
    this.userService.getUserListByOrganization(this.organization.id).subscribe(x => {
      this.organizationMemberList = x;
    });

    this.gettingUserList = true;
    this.invitationService.getUserListNotPartOfOrganization(this.organization.id).subscribe(x => {
      this.usersMail = this.getEmails(x);
      this.gettingUserList = false;
    });
  }
  open(content: any): void {
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

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.usersMail
          .filter((usermail) => usermail.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    )

  sendInvitation(invitationForm: NgForm): void {
    this.sendingInvitationActive = true;
    const invitationInput: ISendInvitationInput = {
      email: this.selectedMail,
      orgId: this.organization.id
    };
    this.invitationService.sendInvitation(invitationInput).subscribe(
      (res) => {
        this.toastr.success("Invitation Send","Success");
        this.sendingInvitationActive = false;
        this.selectedMail = '';
        invitationForm.reset();
      },
      (err) => {
        this.toastr.error("Unable to send Invitation","Failed");
        this.sendingInvitationActive = false;
      }
    );
  }
  
  getEmails(users: IUser[]): string[] {
    let mails= new Array();
    for(var user of users) {
      mails.push(user.email);
    }
    return mails;
  }
}