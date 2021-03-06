import {AfterViewInit, animate, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, state, style, transition, trigger} from '@angular/core';
import {DatabaseService} from 'app/database/database.service';
import {Period} from 'app/period';
import {Section} from 'app/section';
import {Term} from 'app/term';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs/Observable';

import {FiltersState} from './filters/filters.store';

@Component({
  selector: 'cig-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [trigger(
      'toggle',
      [
        transition(
            ':enter',
            [
              style({height: 0, opacity: 0}),
              animate('300ms ease-in', style({height: '*', opacity: 1}))
            ]),
        transition(
            ':leave',
            [
              style({height: '*', opacity: 1}),
              animate('300ms ease-out', style({height: 0, opacity: 0}))
            ])
      ])],
})
export class SearchResultComponent implements AfterViewInit {
  @Input() course: string;
  @Input() filters: FiltersState;
  @Input() expanded: boolean;
  @Input() crosslists: string;
  @Output() expandedChange = new EventEmitter<void>();
  terms: Observable<string[]>;
  periods: Period[] = environment.institution.periods;

  constructor(private databaseService: DatabaseService) {}

  ngAfterViewInit() {
    if (!this.course) {
      throw new Error('course parameter must be specified');
    }
    this.terms = this.databaseService.offerings(this.course);
  }
}
