import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {CourseInfoModule} from 'app/course-info/course-info.module';
import {DatabaseModule} from 'app/database/database.module';
import {environment} from 'environments/environment';
import {FilnuxModule} from 'filnux';

import {FiltersComponent, RemovePipe, SearchPipe} from './filters.component';
import {ACTIONS, INITIAL_STATE, State} from './filters.store';

@NgModule({
  declarations: [FiltersComponent, RemovePipe, SearchPipe],
  imports: [
    BrowserModule, MaterialModule, FormsModule, ReactiveFormsModule,
    CourseInfoModule, FlexLayoutModule, FilnuxModule.forChild({
      module: FiltersModule,
      actions: ACTIONS,
      initialState: INITIAL_STATE
    })
  ],
  exports: [FiltersComponent],
  providers: [],
})
export class FiltersModule {
}
