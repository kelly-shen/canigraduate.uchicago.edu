import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TranscriptRecord} from 'app/transcript-record';
import {median} from 'math';
import {Observable} from 'rxjs/Observable';

import {DatabaseService} from './../database/database.service';

@Directive({selector: '[cigTranscriptRecord]', exportAs: 'cigTranscriptRecord'})
export class TranscriptRecordDirective implements OnChanges {
  @Input() record: TranscriptRecord;
  egpa: Observable<number>;

  constructor(private databaseService: DatabaseService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.record && this.record) {
      this.egpa = this.databaseService.grades(this.record.course)
                      .map(grades => grades.map(grade => grade.gpa))
                      .map(median);
    }
  }
}
