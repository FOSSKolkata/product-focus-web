import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.css']
})
export class UserAvatarComponent implements OnInit {
  
  @Input('name') name!: string;
  @Input('color') color: string = '';
  
  constructor() { }
  
  ngOnInit(): void {
    if(this.color == ''){
      this.color = this.getRandomColor();
    }
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[2 + Math.ceil(Math.random() * 5)];
    }
    return color;
  }
}
