import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class InitiativeService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private scorecard_url = '/scorecard';
  private initiative_url = '/initiative';
  private milestone_url = '/initiative/milestone';
  private all_objectives = '/scorecard/objective';
  private get_inititiative_by_sc = '/initiative/scorecard';
  private get_object_by_sc = '/scorecard/objective/sccode';
  private get_measures_by_obj_scCode = '/scorecard/measure/sccode';

  constructor(private http: HttpService, private appService: AppService) {
  }

  saveInitiative(data: any) {
    return this.http.post(this.initiative_url, data);
  }

  saveMilestone(data: any) {
    return this.http.post(this.milestone_url, data);
  }

  updateInitiative(id: any, data?: any) {
    return this.http.put(this.initiative_url + '/' + id, data);
  }

  getInitiative() {
    return this.http.get(this.initiative_url, null);
  }

  getMilestone() {
    return this.http.get(this.milestone_url, null);
  }

  deleteInitiative(id: any) {
    return this.http.delete(this.initiative_url + '/' + id, null);
  }

  getBalanceScoreCard() {
    return this.http.get(this.scorecard_url, null);
  }

  getAllObjectives() {
    return this.http.get(this.all_objectives, null);
  }

  getInitiativesBySc(code) {
    return this.http.get(this.get_inititiative_by_sc + '/' + code, null);
  }

  getInitiativesAndMilestone(code) {
    return this.http.get(this.get_inititiative_by_sc + '/' + code + '?initiativeWithMilestone=true', null);
  }


  getObjectivesBySc(code) {
    return this.http.get(this.get_object_by_sc + '/' + code, null);
  }

  getMeasuresByObjAndScCode(scCode, objCode) {
    return this.http.get(`${this.get_measures_by_obj_scCode}/${scCode}/objectivecode/${objCode}`, null);
  }

  getInitiativesByScAndObjCode(scCode, objCode) {
    return this.http.get(this.get_inititiative_by_sc + '/' + scCode + '/' + 'objective' + '/' + objCode, null);
  }
}
