import {Component, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder} from '@angular/forms';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {InitiativeService} from '../initiative.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-ganntchart',
  templateUrl: './ganttchart.component.html',
  styleUrls: ['./ganttchart.component.scss'],
  providers: [DatePipe]
})
export class GanttchartComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['code', 'milestoneCode', 'milestoneName', 'status', 'completed', 'percentComplete', 'owner', 'startDate', 'endDate'];
  codeAndNameSubscription: any;
  codeAndName: any;
  orgName: any;
  codeName: any;
  balanceScoreCardData: any;
  initiativeList: any;
  initiativeName: any;
  ganttChartList: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  ganttchart: any;
  nestedArr: any = [];
  spans = [];

  constructor(private emitterService: EmitterService,
              private toasterService: ToastrService,
              private formBuilder: FormBuilder,
              private initiativeService: InitiativeService,
              private customValidators: CustomValidators,
              private datePipe: DatePipe,
              private util: Util) {
  }

  gantChartForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    initiativecode: [null, [this.customValidators.required]],
    initiativename: ['']
  });

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.gantChartForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.gantChartForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getBalanceScoreCard() {
    this.initiativeService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }


  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.gantChartForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.gantChartForm.controls.scName.setValue(this.codeName);
      }
    });

    this.initiativeService.getInitiativesAndMilestone(this.gantChartForm.controls.scCode.value).subscribe((data: any) => {
      if (data.status === '0' && data.data['Initiative'].length > 0) {
        this.initiativeList = data.data['Initiative'];
        this.nestedArr = [];
        this.dataSource = new MatTableDataSource(this.nestedArr);
        this.dataSource.paginator = this.paginator;
      } else {
        this.initiativeList = [];
        this.ganttchart = [];
      }
    });
  }

  getInitiativeName() {
    this.nestedArr = [];
    this.initiativeList.forEach((val, key) => {
      if (this.gantChartForm.controls.initiativecode.value === val.code) {
        this.ganttchart = val;
        this.initiativeName = val.name.toUpperCase();
        this.gantChartForm.controls.initiativename.setValue(this.initiativeName);
      }
    });
    console.log(this.ganttchart);

    if (
      !!this.ganttchart &&
      !!this.ganttchart.milestoneList &&
      this.ganttchart.milestoneList.length > 0
    ) {
      for (let i = 0; i < this.ganttchart.milestoneList.length; i++) {
        let obj: any = {};
        obj.name = this.ganttchart.name;
        obj.code = this.ganttchart.code;
        obj.milestoneCode = this.ganttchart.milestoneList[i]['code'];
        obj.milestoneName = this.ganttchart.milestoneList[i]['name'];
        obj.status = this.ganttchart.milestoneList[i]['status'];
        obj.percentComplete = this.ganttchart.milestoneList[i][
          'percentComplete'
          ];
        obj.completed = this.ganttchart.milestoneList[i]['completed'];
        obj.owner = this.ganttchart.milestoneList[i]['owner'];
        obj.startDate = this.ganttchart.milestoneList[i]['startDate'] ? this.datePipe.transform(this.ganttchart.milestoneList[i]['startDate'], 'yyyy-MM-dd') : 'NA';
        obj.endDate = this.ganttchart.milestoneList[i]['endDate'] ? this.datePipe.transform(this.ganttchart.milestoneList[i]['endDate'], 'yyyy-MM-dd') : 'NA';
        this.nestedArr.push(obj);
      }
    } else {
      let obj: any = {};
      obj.name = this.ganttchart.name;
      obj.code = this.ganttchart.code;
      obj.milestoneCode = 'NA';
      obj.milestoneName = 'NA';
      obj.status = 'NA';
      obj.percentComplete = 'NA';
      obj.owner = 'NA';
      obj.startDate = 'NA';
      obj.completed = 'NA';
      obj.endDate = 'NA';
      this.nestedArr.push(obj);
    }
    this.dataSource = new MatTableDataSource(this.nestedArr);
    this.dataSource.paginator = this.paginator;
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

  shouldShowErrors(fieldName, formName) {
    if (this.focusedElement && this.focusedElement === fieldName) {
      return false;
    } else {
      return this.util.shouldShowErrors(fieldName, formName);
    }
  }

  onFocusForElement(element) {
    if (this.focusedElement !== element) {
      this.focusedElement = element;
    }
  }

  onFocusOutForElement() {
    this.focusedElement = undefined;
  }

  clearFields() {
    this.gantChartForm.reset();
    this.nestedArr = [];
    this.dataSource = new MatTableDataSource(this.nestedArr);
  };
}
