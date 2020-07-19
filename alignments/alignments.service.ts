import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class AlignmentService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private scorecard_url = '/scorecard';
  private alignment_url = '/alignment';
  private initiative_scorecard_url = '/initiative/scorecard';
  private measure_scorecard_url = '/scorecard/measure/sccode';
  private objective_scorecard_url = '/scorecard/objective/sccode';
  private actionItem_scorecard_url = '/scorecard/actionitem/sccode';
  private corp_sbu = '/alignment/orgtype';

  constructor(private http: HttpService, private appService: AppService) {
  }

  getBalanceScoreCard() {
    return this.http.get(this.scorecard_url, null);
  }

  saveAlignment(data: any) {
    return this.http.post(this.alignment_url, data);
  }

  updateAlignment(data: any, id) {
    return this.http.put(this.alignment_url +'/'+id, data);
  }

  getSbuAlignment(orgTypeName: any, toOrgTypeName: any) {
    return this.http.get(this.corp_sbu + '/' + orgTypeName + '/' + 'toorgtype' + '/' + toOrgTypeName, null);
  }

  deleteAlignment(id: any) {
    return this.http.delete(this.alignment_url + '/' + id, null);
  }


  getInitiativesForSc(code) {
    return this.http.get(this.initiative_scorecard_url + '/' + code, null);
  }

  getMeasuresForSc(code) {
    return this.http.get(this.measure_scorecard_url + '/' + code, null);
  }

  getActionItemForSc(code) {
    return this.http.get(this.actionItem_scorecard_url + '/' + code, null);
  }

  getObjectivesForSc(code) {
    return this.http.get(this.objective_scorecard_url + '/' + code, null);
  }
}
