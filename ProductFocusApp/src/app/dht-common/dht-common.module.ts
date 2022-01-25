import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShortnamePipe } from './shortname.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { SwitchTextDropdownComponent } from './switch-text-dropdown/switch-text-dropdown.component';
import { SwitchTextDatepickComponent } from './switch-text-datepick/switch-text-datepick.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { ErrorComponent } from './error/error.component';
import { MatCardModule } from '@angular/material/card';
import { MdePopoverModule } from '@material-extended/mde';
import { SwitchLabelTextComponent } from './switch-text-input/switch-label-text.component';
import { TextDropdownComponent } from './text-dropdown/text-dropdown.component';

@NgModule({
  declarations: [
    // SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent,
    SwitchLabelTextComponent,
    SwitchTextDatepickComponent,
    EditableTextComponent,
    ErrorComponent,
    TextDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCardModule,
    MdePopoverModule
  ],
  exports: [
    // SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    SwitchLabelTextComponent,
    SwitchTextDatepickComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent,
    EditableTextComponent,
    ErrorComponent,
    TextDropdownComponent
  ],
})
export class DhtCommonModule {}