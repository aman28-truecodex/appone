import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/common.service';

@Component({
  selector: 'app-theme-summary',
  templateUrl: './theme-summary.component.html',
  styleUrls: ['./theme-summary.component.scss']
})
export class ThemeSummaryComponent implements OnInit {
  summaryReport: any;

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.getSummaryReportData();
  }

  getSummaryReportData() {
    this.summaryReport = this.commonService.getSummary();
    if (!!this.summaryReport) {
      this.summaryReport = this.commonService.getSummary();
    } else {
      this.summaryReport = JSON.parse(localStorage.getItem('themeSummaryData'));
    }
  }

  makePdf() {
    window.print();
  }
}
