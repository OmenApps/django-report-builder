import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';

import { ReportEffects } from './reports';
import * as Actions from '../actions/reports';
import { IRelatedField, IField } from '../api.interfaces';
import { ApiService } from '../api.service';

describe('Report Effects', () => {
  let effects: ReportEffects;
  let actions: Observable<any>;
  let service: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        ReportEffects,
        provideMockActions(() => actions),
        {
          provide: ApiService,
          // Next line mocks all the functions provided in api.service.ts
          useValue: jasmine.createSpyObj(
            'ApiService',
            Object.getOwnPropertyNames(ApiService.prototype)
          )
        }
      ]
    });

    effects = TestBed.get(ReportEffects);
    service = TestBed.get(ApiService);
  });

  it('GetFields should get fields from a related field', () => {
    const relatedField: IRelatedField = {
      field_name: 'scheduledreport',
      verbose_name: 'scheduledreport_set',
      path: '',
      help_text: '',
      model_id: 24,
      parent_model_name: 'scheduledreport',
      parent_model_app_label: false,
      included_model: true
    };
    actions = hot('a-', { a: new Actions.GetFields(relatedField) });

    const responseFields: IField[] = [
      {
        name: 'last_run_at',
        field: 'last_run_at',
        field_verbose: 'last run at',
        field_type: 'DateTimeField',
        is_default: true,
        field_choices: [],
        can_filter: true,
        path: 'scheduledreport__',
        path_verbose: 'scheduledreport',
        help_text: ''
      }
    ];
    const response = cold('-b', { b: responseFields });
    service.getFields.and.returnValue(response);

    const expected = cold('-c', {
      c: new Actions.GetFieldsSuccess(responseFields)
    });

    expect(effects.getFields$).toBeObservable(expected);
  });

  it('GetRelatedFields should get fields from a related field', () => {
    const relatedField: IRelatedField = {
      field_name: 'scheduledreport',
      verbose_name: 'scheduledreport_set',
      path: '',
      help_text: '',
      model_id: 24,
      parent_model_name: 'scheduledreport',
      parent_model_app_label: false,
      included_model: true
    };
    actions = hot('a-', { a: new Actions.GetRelatedFields(relatedField) });

    const responseFields: IRelatedField[] = [
      {
        field_name: 'last_run_at',
        verbose_name: 'last run at',
        path: 'scheduledreport__',
        help_text: '',
        model_id: 5,
        parent_model_name: 'scheduledreport__',
        parent_model_app_label: false,
        included_model: true
      }
    ];
    const response = cold('-b', { b: responseFields });
    service.getRelatedFields.and.returnValue(response);

    const expected = cold('-c', {
      c: new Actions.GetRelatedFieldsSuccess({
        parent: relatedField,
        relatedFields: responseFields
      })
    });

    expect(effects.getRelatedFields$).toBeObservable(expected);
  });

  it('DeleteReport should delete the current report', () => {
    actions = hot('a-', { a: new Actions.DeleteReport(1) });

    const response = cold('-b', { b: null });
    service.deleteReport.and.returnValue(response);

    const expected = cold('-c', { c: new Actions.DeleteReportSuccess() });
    expect(effects.deleteReport$).toBeObservable(expected);
  });

  it('EditReport should save the changes to the current report', () => {
    actions = hot('a-', { a: new Actions.EditReport() });

    // prettier-ignore
    const savedReport = {"id":4,"name":"afasdf","description":"adgsasfg","modified":"2018-01-18","root_model":5,"root_model_name":"content type","displayfield_set":[{"id":1,"path":"","path_verbose":"","field":"model","field_verbose":"python model class name","name":"model","sort":null,"sort_reverse":false,"width":15,"aggregate":"","position":0,"total":false,"group":false,"report":4,"display_format":null,"field_type":"CharField"},{"id":2,"path":"","path_verbose":"","field":"id","field_verbose":"ID","name":"id","sort":null,"sort_reverse":false,"width":15,"aggregate":"","position":1,"total":false,"group":false,"report":4,"display_format":null,"field_type":"AutoField"}],"distinct":false,"user_created":1,"user_modified":null,"filterfield_set":[],"report_file":null,"report_file_creation":null}

    const response = cold('-b', { b: savedReport });
    service.editReport.and.returnValue(response);

    const expected = cold('-c', {
      c: new Actions.EditReportSuccess(savedReport)
    });
    expect(effects.editReport$).toBeObservable(expected);
  });
});
