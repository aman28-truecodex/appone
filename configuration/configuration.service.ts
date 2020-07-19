import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class ConfigurationService {
  headers: HttpHeaders;
  props: Props = Props;
  private status_url = '/status';
  private employee_master = '/employee';

  constructor(private http: HttpService, private appService: AppService) {
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('rishi:bansal')
    })
  };

  saveStatus(data: any) {
    return this.http.post(this.status_url, data);
  }

  saveEmpMater(data: any) {
    return this.http.post(this.employee_master, data);
  }

  getAllEmpMaster() {
    return this.http.get(this.employee_master, null);
  }

  updateEmpMasterData(data: any, id) {
    return this.http.put(this.employee_master+ '/'+ id, data);
  }

  deleteEmpMasterData(id: any) {
    return this.http.delete(this.employee_master + '/' + id, null);
  }
}
