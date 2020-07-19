import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public summaryReport: any;

  constructor() {
  }

  setSummaryReport(data: any) {
    this.summaryReport = data;
  }

  getSummary() {
    return this.summaryReport;
  }
}
