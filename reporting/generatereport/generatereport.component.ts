import {Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import jsPDF from 'jspdf';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'app-generatereport',
  templateUrl: './generatereport.component.html',
  styleUrls: ['./generatereport.component.scss']
})
export class GeneratereportComponent implements OnInit, OnChanges {
  @Input() YearAndPeriod: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['code', 'frequency', 'actual', 'target', 'status'];
  displayedThemeColumns = ['objective', 'measure', 'actual', 'target', 'status'];
  @Input() InputData = '';
  @Input() type;
  @Input() reportElement;
  nestedArr: any = [];
  spans: any = [];
  @ViewChild('content') content: ElementRef;
  reportData: any;
  objectiveReportData: any;
  allowedSeries: any;
  showObjReport: boolean = false;
  showInitiatives: boolean = false;
  showMeasures: boolean = false;
  showTheme: boolean = false;
  reportElementName: any;
  showInitiativeReport = false;
  reportFileName: any;
  bscReport: any;
  objectiveStory: any;
  objectivesList: any;
  pageSize = 2;
  constructor() {
  }

  ngOnInit() {
  }

  makePdf() {
    const doc = new jsPDF();
    doc.addHTML(this.content.nativeElement, 10, 10, () => {
      doc.save(this.reportFileName + '.pdf');
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.reportElementName = this.reportElement;
    if (!!this.type && !!this.InputData && !!changes.InputData) {
      this.reportData = changes.InputData.currentValue;
      switch (this.type) {
        case 'objectives':
          this.nestedArr = [];
          this.showObjReport = true;
          this.showTheme = false;
          this.showInitiatives = false;
          this.showMeasures = false;
          this.reportFileName = 'objective_Report';
          if (!!this.reportData && !!this.reportData.measureList && this.reportData.measureList.length) {
            for (let j = 0; j < this.reportData.measureList.length; j++) {
              if (!!this.reportData.measureList[j] && this.reportData.measureList[j].strategicMeasureList) {
                this.reportData.measureList[j].strategicMeasureList.map((ele: any) => {
                  let obj: any = {};
                  obj.name = this.reportData.measureList[j].name;
                  obj.code = this.reportData.measureList[j].code;
                  obj.frequency = ele.frequency ? ele.frequency : 'NA';
                  obj.actual = ele.actual ? ele.actual : 'NA';
                  obj.target = ele.target ? ele.target : 'NA';
                  obj.status = ele.status ? ele.status : 'NA';
                  this.nestedArr.push(obj);
                });
              } else {
                let obj: any = {};
                obj.name = this.reportData.measureList[j].name;
                obj.code = this.reportData.measureList[j].code;
                obj.frequency = 'NA';
                obj.target = 'NA';
                obj.status = 'NA';
                obj.actual = 'NA';
                this.nestedArr.push(obj);
              }
            }
          } else {
            let obj: any = {};
            obj.name = 'NA';
            obj.code = 'NA';
            obj.frequency = 'NA';
            obj.target = 'NA';
            obj.status = 'NA';
            obj.actual = 'NA';
            this.nestedArr.push(obj);
          }
          this.dataSource = new MatTableDataSource(this.nestedArr);
          this.dataSource.paginator = this.paginator;
          this.cacheSpan('name', d => d.name);
          break;
        case 'initiatives':
          this.showObjReport = false;
          this.showInitiatives = true;
          this.showMeasures = false;
          this.showTheme = false;
          this.reportFileName = 'initiative_Report';
          break;
        case 'Theme':
          this.nestedArr = [];
          this.showObjReport = false;
          this.showInitiatives = false;
          this.showMeasures = false;
          this.showTheme = true;
          this.reportFileName = 'Theme_Report';
          if (!!this.reportData.objectiveList && this.reportData.objectiveList.length > 0) {
            this.objectivesList = this.reportData.objectiveList;
            for (let i = 0; i < this.objectivesList.length; i++) {
              if (!!this.objectivesList[i] && !!this.objectivesList[i].measureList && this.objectivesList[i].measureList.length) {
                for (let j = 0; j < this.objectivesList[i].measureList.length; j++) {
                  if (!!this.objectivesList[i].measureList[j] && this.objectivesList[i].measureList[j].strategicMeasureList) {
                    this.objectivesList[i].measureList[j].strategicMeasureList.map((ele: any) => {
                      let obj: any = {};
                      obj.name = this.objectivesList[i].name;
                      obj.measureName = this.objectivesList[i].measureList[j].name;
                      obj.frequency = ele.frequency ? ele.frequency : 'NA';
                      obj.actual = ele.actual ? ele.actual : 'NA';
                      obj.target = ele.target ? ele.target : 'NA';
                      obj.status = ele.status ? ele.status : 'NA';
                      this.nestedArr.push(obj);
                    });
                  } else {
                    let obj: any = {};
                    obj.name = this.objectivesList[i].name;
                    obj.measureName = this.objectivesList[i].measureList[j].name;
                    obj.frequency = 'NA';
                    obj.target = 'NA';
                    obj.status = 'NA';
                    obj.actual = 'NA';
                    this.nestedArr.push(obj);
                  }
                }
              } else {
                let obj: any = {};
                obj.name = this.objectivesList[i].name;
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
          this.dataSource.paginator = this.paginator;
          this.cacheSpan('name', d => d.name);
          this.cacheSpan('measureName', d => d.name + d.measureName);
          break;
        case 'measures':
          this.nestedArr = [];
          if (
            !!this.reportData &&
            !!this.reportData.strategicMeasureList &&
            this.reportData.strategicMeasureList.length > 0
          ) {
            for (let i = 0; i < this.reportData.strategicMeasureList.length; i++) {
              let obj: any = {};
              obj.name = this.reportData.name;
              obj.code = this.reportData.code;
              obj.frequency = this.reportData.strategicMeasureList[i]['frequency'];
              obj.actual = this.reportData.strategicMeasureList[i]['actual'];
              obj.target = this.reportData.strategicMeasureList[i]['target'];
              obj.status = this.reportData.strategicMeasureList[i]['status'];
              this.nestedArr.push(obj);
            }
          } else {
            let obj: any = {};
            obj.name = this.reportData.name;
            obj.code = this.reportData.code;
            obj.frequency = 'NA';
            obj.actual = 'NA';
            obj.target = 'NA';
            obj.status = 'NA';
            this.nestedArr.push(obj);
          }
          this.showObjReport = false;
          this.showInitiatives = false;
          this.showMeasures = true;
          this.showTheme = false;
          this.reportFileName = 'measure_Report';
          this.dataSource = new MatTableDataSource(this.nestedArr);
          this.dataSource.paginator = this.paginator;
          this.cacheSpan('name', d => d.name);
          break;
      }
    }
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

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }
}
