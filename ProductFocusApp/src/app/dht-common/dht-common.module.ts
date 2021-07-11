import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwitchTextTextareaComponent } from './switch-text-textarea/switch-text-textarea.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ShortnamePipe } from './shortname.pipe';
import { SpinnerComponent } from './spinner/spinner.component';
import { SwitchTextDropdownComponent } from './switch-text-dropdown/switch-text-dropdown.component';
import { SwitchTextInputComponent } from './switch-text-input/switch-text-input.component';
import { SwitchTextDatepickComponent } from './switch-text-datepick/switch-text-datepick.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SwitchTextAutocompleteComponent } from './switch-text-autocomplete/switch-text-autocomplete.component';

@NgModule({
  declarations: [
    TagComponent,
    SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent,
    SwitchTextInputComponent,
    SwitchTextDatepickComponent,
    SwitchTextAutocompleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  exports: [
    TagComponent,
    SwitchTextTextareaComponent,
    SwitchTextDropdownComponent,
    SwitchTextInputComponent,
    SwitchTextDatepickComponent,
    SwitchTextAutocompleteComponent,
    UserAvatarComponent,
    ShortnamePipe,
    SpinnerComponent
  ],
})
export class DhtCommonModule {}
