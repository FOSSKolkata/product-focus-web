import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, OperatorFunction, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { IMember } from 'src/app/dht-common/models';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnChanges {
  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  fullUserName: any;
  @Input('added-users') addedUsers: IMember[] = [];
  @Input('other-users') otherUsers: IMember[] = [];
  @Output('is-added') isUserAdded = new EventEmitter<IMember>();
  @Output('is-removed') isUserRemoved = new EventEmitter<IMember>();
  isAddUserActive: boolean = false;

  constructor(private modalService: NgbModal) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.addUserHandler();
  }

  inputTextFocus(inputText: any): void {
    setTimeout(() => inputText.focus(), 0);
  }

  formatterEmail = (user: IMember) => `${user.name} (${user.email})`;
  formatter = (user: IMember) => user.name;

  search: OperatorFunction<string, readonly IMember[]> = (
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

  private addUserHandler() {
    this.otherUsers = this.addHelper(this.otherUsers, this.addedUsers);
    this.addedUsers = this.addHelper(this.addedUsers, this.otherUsers);
  }

  removeUser(user: IMember){
    this.isUserRemoved.emit(user);
    this.removeHelper(user);
  }

  removeHelper(user: IMember){
    this.otherUsers.push(user);
    for(let i=0;i<this.addedUsers.length;i++){
      if(this.addedUsers[i].objectId == user.objectId){
        this.addedUsers.splice(i,1);
        break;
      }
    }
  }

  addHelper(a: IMember[], b: IMember[]): IMember[] {
    //a-b
    var tempIMember: IMember[] = [];
    a.forEach((aUser) => {
      var found = false;
      b.forEach((bUser) => {
        if (aUser.objectId == bUser.objectId) {
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
