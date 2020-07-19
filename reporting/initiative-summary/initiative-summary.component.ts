import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-initiative-summary',
  templateUrl: './initiative-summary.component.html',
  styleUrls: ['./initiative-summary.component.scss']
})
export class InitiativeSummaryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedInitiativeColumns = ['sNo', 'name', 'owner', 'status', 'percentComplete', 'startDate', 'endDate'];
  @ViewChild('content') content: ElementRef;
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
      this.summaryReport = JSON.parse(localStorage.getItem('InitiativeSummaryData'));
    }
    this.dataSource = new MatTableDataSource(this.summaryReport.initiativeList);
    console.log(this.summaryReport);
    this.dataSource.paginator = this.paginator;
  }

  makePdf() {
    window.print();
  }
}
