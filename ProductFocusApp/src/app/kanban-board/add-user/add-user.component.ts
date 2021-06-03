import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Member } from 'src/app/dht-common/models';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnChanges {

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  fullUserName: any;
  @Input('added-users') addedUsers: Member[] = [];
  @Input('other-users') otherUsers: Member[] = [];
  @Output('is-added') isUserAdded = new EventEmitter<Member>();
  isAddUserActive:boolean = false;
  
  
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("changes",changes);
    this.removeAddedUser();
  }
  
  ngOnInit(): void {

  }

  inputTextFocus(inputText:any): void {
    setTimeout(()=> inputText.focus(),0);
  }

  formatter = (user: Member) => user.name;

  search: OperatorFunction<string, readonly Member[]> = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => this.otherUsers.filter(user => new RegExp(term, 'mi').test(user.name)).slice(0,10))
  );

  addUser(event: any){
    // console.log(event);
    // setTimeout(()=>this.fullUserName = '',0);
    // var index = this.addedUsers.indexOf(event.item);
    // if(index != -1) {
    //   console.log(event.item + " is already added");
    //   return;
    // }
    this.addedUsers.push(event.item);
    this.removeAddedUser();
    this.isUserAdded.emit(event.item);
  }

  removeAddedUser() {
    console.log("before other",this.otherUsers,"added",this.addedUsers);
    this.otherUsers = this.removeHelper(this.otherUsers, this.addedUsers);
    this.addedUsers = this.removeHelper(this.addedUsers, this.otherUsers);
    console.log("after other",this.otherUsers,"added",this.addedUsers);
  }

  removeHelper(a: Member[], b: Member[]): Member[] {//a-b
    var tempMember: Member[] = [];
    a.forEach((aUser) => {
      var found = false;
      b.forEach((bUser) => {
        if(aUser.email == bUser.email){
          found = true;
        }
      });
      if(!found){
        tempMember.push(aUser);
      }
    });
    return tempMember;
  }
}
