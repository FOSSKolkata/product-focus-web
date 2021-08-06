import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IMember, IMemberDetail } from '../../dht-common/models';

@Component({
  selector: 'app-switch-text-autocomplete',
  templateUrl: './switch-text-autocomplete.component.html',
  styleUrls: ['./switch-text-autocomplete.component.scss']
})
export class SwitchTextAutocompleteComponent implements OnInit {

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  fullUserName: string = '';
  @Input('added-users') addedUsers: IMember[] = [];
  @Input('other-users') otherUsers: IMemberDetail[] = [];
  @Output('is-added') isUserAdded = new EventEmitter<IMember>();
  @Output('is-removed') isUserRemoved = new EventEmitter<IMember>();
  isAddUserActive: boolean = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.addUserHandler();
  }

  ngOnInit(): void {}

  inputTextFocus(inputText: any): void {
    setTimeout(() => inputText.focus(), 0);
  }

  formatter = (user: IMember) => user.name;

  search: OperatorFunction<string, readonly any[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 2),
      map((term) =>
        this.otherUsers
          .filter((user) => new RegExp(term, 'mi').test(user.name))
          .slice(0, 10)
      )
    );

  addUser(event: any) {
    this.addedUsers.push(event.item);
    this.addUserHandler();
    this.isUserAdded.emit(event.item);
    setTimeout(()=>this.fullUserName = '',0);
  }

  addUserHandler() {
    // console.log('before other', this.otherUsers, 'added', this.addedUsers);
    this.otherUsers = this.addHelper(this.otherUsers, this.addedUsers);
    this.addedUsers = this.addHelper(this.addedUsers, this.otherUsers);
    // console.log('after other', this.otherUsers, 'added', this.addedUsers);
  }

  removeUser(user: IMember){
    this.isUserRemoved.emit(user);
    this.removeHelper(user);
  }
  
  removeHelper(user: IMember){
    console.log('before other remove', this.otherUsers, 'added', this.addedUsers);
    this.otherUsers.push({
      email: user.email,
      isOwner: false,
      name: user.name,
      id: -1
    });
    for(let i=0;i<this.addedUsers.length;i++){
      if(this.addedUsers[i].email == user.email){
        this.addedUsers.splice(i,1);
        break;
      }
    }
    console.log('after other remove', this.otherUsers, 'added', this.addedUsers);
  }

  addHelper(a: any[], b: any[]): any[] {
    //a-b
    var tempIMember: any[] = [];
    a.forEach((aUser) => {
      var found = false;
      b.forEach((bUser) => {
        if (aUser.email == bUser.email) {
          found = true;
        }
      });
      if (!found) {
        tempIMember.push(aUser);
      }
    });
    return tempIMember;
  }

}
