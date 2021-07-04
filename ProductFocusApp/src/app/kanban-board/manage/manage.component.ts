import { Component, OnInit } from '@angular/core';
import { StylingService } from 'src/app/side-nav/styling.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  isActive: boolean = true;
  moduleAddView: boolean = false;
  moduleName: string | undefined;
  constructor(public styling: StylingService) {}

  ngOnInit(): void {}

  addModule() {}
}
