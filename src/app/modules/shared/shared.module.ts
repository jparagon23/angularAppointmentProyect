import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './components/select/select.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { CheckboxComponent } from './components/chechbox/chechbox.component';
import { TimeFormatPipe } from './pipes/time-format.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserInformationPageComponent } from './pages/user-information-page/user-information-page.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TimePipe } from './pipes/time.pipe';
import { CapitalizeFirstWordPipe } from './pipes/capitalize-first-word.pipe';
import { UserSearchListComponent } from './components/user-search-list/user-search-list.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatchResultCardComponent } from './components/match-result-card/match-result-card.component';
import { StatusTranslatePipe } from './pipes/status-translate.pipe';
import { MatchConfirmationModalComponent } from '../match/modals/match-confirmation-modal/match-confirmation-modal.component';
import { RankingTableComponent } from './components/ranking-table/ranking-table.component';
import { TabSelectorComponent } from './components/tab-selector/tab-selector.component';
import { MatchModule } from '../match/match.module';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    ErrorMessageComponent,
    CheckboxComponent,
    TimeFormatPipe,
    TimePipe,
    LoaderComponent,
    UserInformationPageComponent,
    DateSelectorComponent,
    TimePipe,
    CapitalizeFirstWordPipe,
    UserSearchListComponent,
    MatchResultCardComponent,
    StatusTranslatePipe,
    MatchConfirmationModalComponent,
    RankingTableComponent,
    TabSelectorComponent,
    UserProfileComponent,
  ],

  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
  exports: [
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    TimeFormatPipe,
    TimePipe,
    LoaderComponent,
    DateSelectorComponent,
    CapitalizeFirstWordPipe,
    UserSearchListComponent,
    MatchResultCardComponent,
    StatusTranslatePipe,
    RankingTableComponent,
    TabSelectorComponent,
  ],
})
export class SharedModule {}
