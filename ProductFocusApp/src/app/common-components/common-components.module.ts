import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchTextTextareaComponent } from './switch-text-textarea/switch-text-textarea.component';
import { AddUserComponent } from './add-user/add-user.component';



@NgModule({
  declarations: [
    TagComponent,
    SwitchTextTextareaComponent,
    AddUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    TagComponent,
    SwitchTextTextareaComponent,
    AddUserComponent
  ]
})
export class CommonComponentsModule { }
