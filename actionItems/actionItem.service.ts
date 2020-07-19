import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class ActionItemService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private actionItem_url = '/scorecard/actionitem';

  constructor(private http: HttpService, private appService: AppService) {
  }

  saveActionItem(data: any) {
    return this.http.postFormData(this.actionItem_url, data);
  }

}
