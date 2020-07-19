import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-objective-summary',
  templateUrl: './objective-summary.component.html',
  styleUrls: ['./objective-summary.component.scss']
})
export class ObjectiveSummaryComponent implements OnInit {
  @ViewChild('paginator1') tableOne: MatPaginator;
  measureDataSource: MatTableDataSource<any>;

  @ViewChild('paginator2') tableTwo: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedInitiativeColumns = ['sNo', 'name', 'owner', 'status', 'percentComplete', 'startDate', 'endDate'];
  displayMeasureColumns = ['name', 'actual', 'target', 'status'];
  summaryReport: any;
  measureByObj: any;
  nestedArr: any;
  spans: any = [];

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
      this.summaryReport = JSON.parse(localStorage.getItem('objectiveSummaryData'));
    }
    this.dataSource = new MatTableDataSource(this.summaryReport.initiativeList);
    this.dataSource.paginator = this.tableTwo;
    this.getMeasureKpiPerformance();
  }

  makePdf() {
    window.print();
  }

  getMeasureKpiPerformance() {
    this.nestedArr = [];
    if (this.summaryReport.measureList.length > 0) {
      this.measureByObj = this.summaryReport.measureList;
      if (!!this.measureByObj && this.measureByObj.length > 0) {
        for (let i = 0; i < this.measureByObj.length; i++) {
          if (!!this.measureByObj[i] && !!this.measureByObj[i].strategicMeasureList && this.measureByObj[i].strategicMeasureList.length
          ) {
            for (
              let j = 0; j < this.measureByObj[i].strategicMeasureList.length; j++) {
              let obj: any = {};
              obj.name = this.measureByObj[i].name;
              if (!!this.measureByObj[i].strategicMeasureList[j] && this.measureByObj[i].strategicMeasureList) {
                obj.actual = this.measureByObj[i].strategicMeasureList[j].actual;
                obj.target = this.measureByObj[i].strategicMeasureList[j].target;
                obj.status = this.measureByObj[i].strategicMeasureList[j].status;
                this.nestedArr.push(obj);
              }
            }
          } else {
            let obj: any = {};
            obj.name = this.measureByObj[i].name;
            obj.actual = 'NA';
            obj.target = 'NA';
            obj.status = 'NA';
            this.nestedArr.push(obj);
          }
        }
      }
    } else {
      this.nestedArr = [];
    }
    this.measureDataSource = new MatTableDataSource(this.nestedArr);
    this.measureDataSource.paginator = this.tableOne;
    this.cacheSpan('name', d => d.name);
  }


  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.nestedArr.length;) {
      let currentValue = accessor(this.nestedArr[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.nestedArr.length; j++) {
        if (currentValue != accessor(this.nestedArr[j])) {
          break;
        }
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }
}
