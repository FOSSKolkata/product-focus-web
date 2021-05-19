import { Component, OnInit } from '@angular/core';
import {Sort} from '@angular/material/sort';

export interface ClosedAction {
  name: string,
  invitedOn: string,
  status: string,
  actionedOn: string
}

@Component({
  selector: 'app-closed-invitations',
  templateUrl: './closed-invitations.component.html',
  styleUrls: ['./closed-invitations.component.css']
})
export class ClosedInvitationsComponent implements OnInit {
  desserts: ClosedAction[] = [
    {name: 'Chandan Prajapati', invitedOn: '24 Apr 4:00pm', status: 'Accepted', actionedOn: '13 May 7:00pm'},
    {name: 'Rahul Dubey', invitedOn: '24 Apr 4:00pm', status: 'Declined', actionedOn: '14 May 6:02pm'},
    {name: 'Sunny Shaw', invitedOn: '24 Apr 4:05pm', status: 'Accepted', actionedOn: '11 May 5:20am'},
    {name: 'Dipak Prasad', invitedOn: '25 Apr 4:00pm', status: 'Accepted', actionedOn: '12 May 8:51pm'},
    {name: 'Sneha Shaw', invitedOn: '24 Apr 4:00pm', status: 'Cancelled', actionedOn: '17 May 7:09am'},
  ];
  sortedData: ClosedAction[];
  constructor() {
    this.sortedData = this.desserts.slice();
   }

  ngOnInit(): void {
  }
  sortData(sort: Sort) {
    const data = this.desserts.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'name': return compare(a.name, b.name, isAsc);
        case 'invitedOn': return compare(a.invitedOn.length, b.invitedOn.length, isAsc);
        case 'actionedOn': return compare(a.actionedOn, b.actionedOn, isAsc);
        default: return 0;
      }
    });
  } 
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}