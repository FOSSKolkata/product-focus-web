import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
})
export class UserAvatarComponent implements OnInit {
  @Input('name') name!: string;
  @Input('color') color: string | null = null;

  ngOnInit(): void {
    if(this.color === null) {
      //this.color = localStorage.color;
      if (!this.color || this.color == '') {
        localStorage.color = this.color = this.getRandomColor();
      }
    }
  }

  getRandomColor(): string {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[2 + Math.ceil(Math.random() * 5)];
    }
    return color;
  }
}
