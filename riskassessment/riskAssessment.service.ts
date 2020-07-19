import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class RiskAssessmentService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private riskAssessment_url = '/riskassessment';
  private emp_master_url = '/employee';

  constructor(private http: HttpService, private appService: AppService) {
  }

  saveRiskAssessment(data: any) {
    return this.http.post(this.riskAssessment_url, data);
  }

  getRiskAssessment() {
    return this.http.get(this.riskAssessment_url, null);
  }

  getEmpMasterData() {
    return this.http.get(this.emp_master_url, null);
  }

  UpdateRiskAssessment(data: any, id: any) {
    return this.http.put(this.riskAssessment_url + '/' + id, data);
  }

  deleteRiskAssessment(id: any) {
    return this.http.delete(this.riskAssessment_url + '/' + id, null);
  }


}
