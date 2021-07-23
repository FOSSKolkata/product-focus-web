import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { IMember, IMemberDetail } from '../models';

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
  isAddUserActive: boolean = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.removeAddedUser();
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
    this.removeAddedUser();
    this.isUserAdded.emit(event.item);
    setTimeout(()=>this.fullUserName = '',0);
  }

  removeAddedUser() {
    console.log('before other', this.otherUsers, 'added', this.addedUsers);
    this.otherUsers = this.removeHelper(this.otherUsers, this.addedUsers);
    this.addedUsers = this.removeHelper(this.addedUsers, this.otherUsers);
    console.log('after other', this.otherUsers, 'added', this.addedUsers);
  }

  removeHelper(a: any[], b: any[]): any[] {
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
