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
import { SwitchTextDropdownComponent } from './switch-text-dropdown/switch-text-dropdown.component';

@NgModule({
  declarations: [
    TagComponent,
    SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent,
    SwitchTextDropdownComponent,
  ],
  imports: [CommonModule, FormsModule, NgbModule, MatProgressSpinnerModule],
  exports: [
    TagComponent,
    SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent,
  ],
})
export class DhtCommonModule {}
