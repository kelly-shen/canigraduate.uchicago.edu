import {animate, ChangeDetectionStrategy, Component, Input, state, style, transition, trigger} from '@angular/core';
import {Transcript} from 'app/transcript';
import {TranscriptRecord} from 'app/transcript-record';
import {mean, median} from 'math';
import {Observable} from 'rxjs/Observable';
import {Memoize} from 'typescript-memoize';

import {DatabaseService} from './../database/database.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'cig-transcript',
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss'],
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
export class TranscriptComponent {
  @Input() transcript: Transcript;
  @Input() showGrades: boolean;
  constructor(private databaseService: DatabaseService) {}

  @Memoize()
  getTermEgpa(term: string) {
    const records = this.transcript.getCumulativeTranscript(term)
                        .records.map(record => record.course)
                        .map(course => {
                          return this.databaseService.grades(course)
                              .map(grades => grades.map(grade => grade.gpa))
                              .map(median);
                        });
    return Observable.combineLatest(records)
        .map(grades => grades.filter(grade => !isNaN(grade)))
        .map(mean);
  }
}
