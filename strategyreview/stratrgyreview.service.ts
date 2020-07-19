import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class StrategyReviewService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private theme_story_url = '/themestory';
  private scorecard_url = '/scorecard';
  private initiative_by_obj = '/initiative/scorecard';

  constructor(private http: HttpService, private appService: AppService) {
  }

  getBalanceScoreCard() {
    return this.http.get(this.scorecard_url, null);
  }

  getThemeByCode(code: any) {
    return this.http.get(this.scorecard_url + '/' + code + '/theme', null);
  }

  getInitiativesByObjeciveCode(scCode, ObCode) {
    return this.http.get(this.initiative_by_obj + '/' + scCode + '/objective' + '/' + ObCode, null);
  }
}
