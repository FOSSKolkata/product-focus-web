import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchTextTextareaComponent } from './switch-text-textarea/switch-text-textarea.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShortnamePipe } from './shortname.pipe';

@NgModule({
  declarations: [
    TagComponent,
    SwitchTextTextareaComponent,
    UserAvatarComponent,
    ShortnamePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ],
  exports: [
    TagComponent,
    SwitchTextTextareaComponent,
    UserAvatarComponent,
    ShortnamePipe
  ]
})
export class DhtCommonModule { }
