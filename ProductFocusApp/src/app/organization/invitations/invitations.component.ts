import { Component, OnInit, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { IClosedInvitation, IGetClosedInvitation, IGetPendingInvitation, InvitationStatus, IPendingInvitation } from 'src/app/dht-common/models';
import { InvitationService } from 'src/app/_services/invitation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css'],
})
export class InvitationsComponent implements OnInit {
  lastSelctedOrganizationId!: number;
  pendingInvitationList: IGetPendingInvitation = {
    pendingInvitations: [],
    recordCount: 0
  };
  pendingInvitationContainer: any = [];
  closedInvitationList: IGetClosedInvitation = {
    closedInvitations: [],
    recordCount: 0
  };
  closedInvitationContainer: any = [];
  offset = 0;
  count = 5;
  pendingLoadMore = true;
  loadingPending = false;
  cancelInvitationItem!: IPendingInvitation;
  cancellingInvitation = false;
  loadingClosed = false;
  sortedData!: IClosedInvitation[];
  constructor(
    private invitationService: InvitationService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.lastSelctedOrganizationId = localStorage.lastSelctedOrganizationId;
    if (!this.lastSelctedOrganizationId) {
      this.router.navigate(['/']);
    }
    this.initializePendingInvitation();
    this.initializeClosedInvitation();
  }
  reset(){
    this.pendingInvitationList = {
      pendingInvitations : [],
      recordCount : 0
    }
    this.closedInvitationList = {
      closedInvitations : [],
      recordCount : 0
    }
    this.pendingInvitationContainer = [];
    this.closedInvitationContainer = [];
    this.offset = 0;
    this.count = 5;
  }

  clearPendingInvitationsList(){
    this.pendingInvitationList.pendingInvitations = [];
  }

  clearClosedInvitationsList(){
    this.closedInvitationList.closedInvitations = [];
  }

  initializeClosedInvitation() {
    this.loadingClosed = true;
    this.invitationService.getClosedInvitationList(
      this.lastSelctedOrganizationId,
      this.offset,
      this.count
    ).subscribe(x => {
      console.log("getClosedInvitation",x);
      this.loadingClosed = false;
      this.closedInvitationList = x;
      if(this.closedInvitationContainer.length == 0){
        for(let i=0;i<this.closedInvitationList.recordCount;i++){
          this.closedInvitationContainer.push([]);
        }
      }
      for(let i=0; i<this.closedInvitationList.closedInvitations.length;i++){
        this.closedInvitationContainer[i] = this.closedInvitationList.closedInvitations[i]
      }
      this.sortedData = this.closedInvitationList.closedInvitations.slice();
    }, err => {
      alert(err);
      this.loadingClosed = false;
    });
  }

  changeClosedInvitationPage(event: any) {
    this.count = event.pageSize;
    var start = event.pageSize * event.pageIndex;
    console.log("count & closed",this.count,start);
    console.log("closedInvicon",this.closedInvitationContainer[start]);
    // Check if container contains currently selected page data
    // If doesn't contain then call the api else add old data in pendinglist from container
    if(this.closedInvitationContainer[start].length == 0){
      this.loadingClosed = true;
      this.invitationService.getClosedInvitationList(this.lastSelctedOrganizationId,start,event.pageSize).subscribe(x => {
        this.loadingClosed = false;
        console.log("res closed",x);
        for(var i=0, j=start; i<x.closedInvitations.length; i++, j++){
          this.closedInvitationContainer[j] = x.closedInvitations[i];
        }
        console.log("container",this.closedInvitationContainer);
        this.clearClosedInvitationsList();
        for(var i=start, j=0;i<this.closedInvitationList.recordCount && i < start + this.count; i++,j++){
          this.closedInvitationList.closedInvitations[j] = this.closedInvitationContainer[i];
        }
        console.log("closed",this.closedInvitationList);
        this.sortedData = this.closedInvitationList.closedInvitations.slice();
      });
    }
    else {
     this.clearClosedInvitationsList(); 
      for(var i=start, j=0;i<this.closedInvitationList.recordCount && i < start + this.count; i++,j++){
        this.closedInvitationList.closedInvitations[j] = this.closedInvitationContainer[i];
      }
      this.sortedData = this.closedInvitationList.closedInvitations.slice();
    }
  }

  initializePendingInvitation() {
    this.loadingPending = true;
    this.invitationService
      .getPendingInvitationList(
        this.lastSelctedOrganizationId,
        this.offset,
        this.count
      )
      .subscribe(
        (x) => {
          console.log("getPendingInvitation",x);
          this.loadingPending = false;
          this.pendingInvitationList = x;
          if(this.pendingInvitationContainer.length == 0){
            for(let i=0;i<this.pendingInvitationList.recordCount;i++){
              this.pendingInvitationContainer.push([]);
            }
          }
          for(let i=0; i<this.pendingInvitationList.pendingInvitations.length;i++){
            this.pendingInvitationContainer[i] = this.pendingInvitationList.pendingInvitations[i]
          }
        },
        (err) => {
          alert(err);
          this.loadingPending = false;
        }
      );
  }

  changeInvitationPage(event: any) {
    this.count = event.pageSize;
    var start = event.pageSize * event.pageIndex;
    // Check if container contains currently selected page data
    // If doesn't contain then call the api else add old data in pendinglist from container
    if(this.pendingInvitationContainer[start].length == 0){
      this.loadingPending = true;
      this.invitationService.getPendingInvitationList(this.lastSelctedOrganizationId,start,event.pageSize).subscribe(x => {
        this.loadingPending = false;
        for(var i=0, j=start; i<x.pendingInvitations.length; i++, j++){
          this.pendingInvitationContainer[j] = x.pendingInvitations[i];
        }
        this.clearPendingInvitationsList();
        for(var i=start, j=0;i<this.pendingInvitationList.recordCount && i < start + this.count; i++,j++){
          this.pendingInvitationList.pendingInvitations[j] = this.pendingInvitationContainer[i];
        }
      });
    }
    else {
     this.clearPendingInvitationsList(); 
      for(var i=start, j=0;i<this.pendingInvitationList.recordCount && i < start + this.count; i++,j++){
        this.pendingInvitationList.pendingInvitations[j] = this.pendingInvitationContainer[i];
      }
    }
  }

  sortData(sort: Sort) {
    const data = this.closedInvitationList.closedInvitations.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'name': return compare(a.name, b.name, isAsc);
        case 'invitedOn':
          return compare(a.invitedOn, b.invitedOn, isAsc);
        case 'actionedOn':
          return compare(a.actionedOn, b.actionedOn, isAsc);
        default:
          return 0;
      }
    });
  }

  openCancelPendingInvitation(content: any, cancelInvitation: IPendingInvitation){
    this.cancelInvitationItem = cancelInvitation;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm', centered: true }).result.then((result) => {
      
    }, (reason) => {

    });
  }

  cancelInvitation(modal: any) {
    this.cancellingInvitation = true;
    this.invitationService.cancelInvitation({invitationId: this.cancelInvitationItem.id, orgId: this.lastSelctedOrganizationId, email: this.cancelInvitationItem.email }).subscribe(res => {
      this.toastr.success("Invitation cancelled.","Success");
      modal.close();
      this.cancellingInvitation = false;
      this.reset();
      this.initializePendingInvitation();
      this.initializeClosedInvitation();
    },(err) => {
      this.toastr.error("Cancelling failed","Failed");
      modal.close();
    });
  }


  invitationStatus(position: number): string {
    return InvitationStatus[position];
  }

}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  if(a instanceof Date && b instanceof Date){
    return (a.getTime() < b.getTime() ? -1 : 1) * (isAsc ? 1 : -1);
  }
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
