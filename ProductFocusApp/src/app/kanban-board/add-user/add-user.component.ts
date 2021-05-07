import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject, OperatorFunction, Observable, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  fullUserName: any;
  usernameList: Array<string> = [];
  isAddUserActive:boolean = false;
  
  userData = ["Vikram Shaw","Pritam Shaw","Amit Shaw","Ankit Shaw","Ankit Singh","Akhilesh Chaudhary","Dipak Prasad","Raju"];
  
  constructor() { }
  
  ngOnInit(): void {

  }

  inputTextFocus(inputText:any): void {
    setTimeout(()=> inputText.focus(),0);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.userData
        : this.userData.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  addTag(event: any){
    setTimeout(()=>this.fullUserName = '',0);
    var index = this.usernameList.indexOf(event.item);
    if(index != -1) {
      console.log(event.item + " is already added");
      return;
    }
    this.usernameList.push(event.item);
  }

  removeTag(name: string){
    var index = this.usernameList.indexOf(name);
    this.usernameList.splice(index,1);
  }
}
