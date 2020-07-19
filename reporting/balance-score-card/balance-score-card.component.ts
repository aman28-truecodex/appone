import {Component, OnInit, ViewChild} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-balance-score-card',
  templateUrl: './balance-score-card.component.html',
  styleUrls: ['./balance-score-card.component.scss']
})
export class BalanceScoreCardComponent implements OnInit {
  summaryReport: any;
  balanceScorecardInfo: any;
  nestedArr: any = [];
  spans: any = [];
  // @ViewChild('paginator') tableOne: MatPaginator;
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['perspective', 'objective', 'measure', 'actual', 'target', 'status'];


  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
    this.getSummaryReportData();
    this.formatBscReportData();
  }

  getSummaryReportData() {
    this.summaryReport = this.commonService.getSummary();
    if (!!this.summaryReport) {
      this.summaryReport = this.commonService.getSummary();
    } else {
      this.summaryReport = JSON.parse(localStorage.getItem('balanceScoreCardData'));
    }
    if (this.summaryReport.length > 0) {
      this.balanceScorecardInfo = this.summaryReport[0];
    }
    console.log(this.summaryReport);
  }

  makePdf() {
    window.print();
  }

  formatBscReportData() {
    console.log(this.summaryReport);
    this.nestedArr = [];
    if (this.summaryReport.length > 0) {
      for (let i = 0; i < this.summaryReport.length; i++) {
        if (!!this.summaryReport[i] && !!this.summaryReport[i].measureList && this.summaryReport[i].measureList.length) {
          for (let j = 0; j < this.summaryReport[i].measureList.length; j++) {
            if (!!this.summaryReport[i].measureList[j] && this.summaryReport[i].measureList[j].strategicMeasureList) {
              this.summaryReport[i].measureList[j].strategicMeasureList.map((ele: any) => {
                let obj: any = {};
                obj.name = this.summaryReport[i].name;
                obj.measureName = this.summaryReport[i].measureList[j].name;
                obj.perspectiveCode = this.summaryReport[i].perspectiveCode;
                obj.perspectiveName = this.summaryReport[i].perspectiveName;
                obj.frequency = ele.frequency ? ele.frequency : 'NA';
                obj.actual = ele.actual ? ele.actual : 'NA';
                obj.target = ele.target ? ele.target : 'NA';
                obj.status = ele.status ? ele.status : 'NA';
                this.nestedArr.push(obj);
              });
            } else {
              let obj: any = {};
              obj.name = this.summaryReport[i].name;
              obj.measureName = this.summaryReport[i].measureList[j].name;
              obj.perspectiveCode = this.summaryReport[i].perspectiveCode;
              obj.perspectiveName = this.summaryReport[i].perspectiveName;
              obj.frequency = 'NA';
              obj.target = 'NA';
              obj.status = 'NA';
              obj.actual = 'NA';
              this.nestedArr.push(obj);
            }
          }
        } else {
          let obj: any = {};
          obj.name = this.summaryReport[i].name;
          obj.perspectiveCode = this.summaryReport[i].perspectiveCode;
          obj.perspectiveName = this.summaryReport[i].perspectiveName;
          obj.measureName = 'NA';
          obj.frequency = 'NA';
          obj.target = 'NA';
          obj.status = 'NA';
          obj.actual = 'NA';
          this.nestedArr.push(obj);
        }
      }
    } else {
      this.nestedArr = [];
    }
    this.dataSource = new MatTableDataSource(this.nestedArr);
    // this.dataSource.paginator = this.tableOne;
    this.cacheSpan('name', d => d.name);
    this.cacheSpan('measureName', d => d.name + d.measureName);
    console.log(this.nestedArr);
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.nestedArr.length;) {
      let currentValue = accessor(this.nestedArr[i]);
      let count = 1;
      for (let j = i + 1; j < this.nestedArr.length; j++) {
        if (currentValue != accessor(this.nestedArr[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      this.spans[i][key] = count;
      i += count;
    }
  }
}
