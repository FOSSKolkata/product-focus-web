import { Component, OnInit } from '@angular/core';
import { StylingService } from './styling.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  
  constructor(private styling: StylingService) { }

  ngOnInit(): void {
  }

  onHover(){
    this.styling.newStyle({'margin-left': '310px', 'transition': '0.5s'});
  }

  onOut(){
    this.styling.newStyle({'margin-left': '70px', 'transition': '0.5s'});
  }
}
