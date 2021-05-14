import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchTextTextareaComponent } from './switch-text-textarea/switch-text-textarea.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShortnamePipe } from './shortname.pipe';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    TagComponent,
    SwitchTextTextareaComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    MatProgressSpinnerModule
  ],
  exports: [
    TagComponent,
    SwitchTextTextareaComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent
  ]
})
export class DhtCommonModule { }
