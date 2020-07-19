import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EmitterService} from '../../shared/emitter.service';
import {InitiativeService} from '../../initiatives/initiative.service';
import {StrategyReviewService} from '../stratrgyreview.service';
import {BscService} from '../../bsc/bsc.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {MatPaginator, MatTableDataSource} from '@angular/material';


@Component({
  selector: 'app-objectivestory',
  templateUrl: './objectivestory.component.html',
  styleUrls: ['./objectivestory.component.scss']
})
export class ObjectivestoryComponent implements OnInit {
  @ViewChild('paginator1') tableOne: MatPaginator;
  measureDataSource: MatTableDataSource<any>;

  @ViewChild('paginator2') tableTwo: MatPaginator;
  dataSource: MatTableDataSource<any>;


  displayedInitiativeColumns = ['sNo', 'name', 'owner', 'status', 'percentComplete', 'startDate', 'endDate'];
  displayMeasureColumns = ['name', 'frequency', 'actual', 'target', 'status'];


  codeAndNameSubsription: any;
  codeAndName: any;
  balanceScoreCardData: any;
  AllObjectives: any;
  objectiveStoryScCode: any;
  initiatives: any = [];
  objCode: any;
  objName: any;
  measureByObj: any = [];
  empMasterData: any;
  focusedElement: any;
  tooltipInfo = TOOL_TIP_INFO;
  scName: any;
  spans = [];
  nestedArr: any = [];
  objectiveReportsNames: any = [];

  years = [
    {id: 1, name: '2014'},
    {id: 1, name: '2015'},
    {id: 1, name: '2016'},
    {id: 1, name: '2017'},
    {id: 1, name: '2018'},
    {id: 1, name: '2019'},
    {id: 1, name: '2020'},
    {id: 1, name: '2021'},
    {id: 1, name: '2022'},
    {id: 1, name: '2023'},
    {id: 1, name: '2024'}];

  period = [
    {id: 1, month: 'January'},
    {id: 2, month: 'February'},
    {id: 3, month: 'March'},
    {id: 4, month: 'April'},
    {id: 5, month: 'May'},
    {id: 6, month: 'June'},
    {id: 7, month: 'July'},
    {id: 8, month: 'August'},
    {id: 9, month: 'September'},
    {id: 10, month: 'October'},
    {id: 11, month: 'November'},
    {id: 12, month: 'December'}
  ];

  objectiveStoryForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    code: [''],
    name: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    objectiveCode: [null, [this.customValidators.required]],
    objectiveName: [''],
    description: [''],
    period: [null, [this.customValidators.required]],
    owner: [null],
    collaborators: [null],
    initiativeList: [''],
    year: [null, [this.customValidators.required]],
    analysis: [''],
    recommendation: [''],
    attachmentUrls: [''],
    reportUrls: [[]],
    measureList: ['']
  });

  constructor(private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private emitterService: EmitterService,
              private bscService: BscService,
              private initiativeService: InitiativeService,
              private strategyReviewService: StrategyReviewService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllEmpMasterData();
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.objectiveStoryForm.controls.orgCode.value === val.code) {
        const orgName = val.name.toUpperCase();
        this.objectiveStoryForm.controls.orgName.setValue(orgName);
      }
    });
  }

  getScCode(event) {
    this.objectiveStoryScCode = event;
    if (!!this.objectiveStoryScCode) {
      this.balanceScoreCardData.forEach((val, key) => {
        if (this.objectiveStoryForm.controls.scCode.value === val.code) {
          this.scName = val.name;
          this.objectiveStoryForm.controls.scName.setValue(this.scName);
        }
      });
      this.getObjectivesByScCode(this.objectiveStoryScCode);
    }

  }

  getAllEmpMasterData() {
    this.bscService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getBalanceScoreCard() {
    this.bscService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });

  }

  getObjectivesByScCode(scCode: any) {
    this.initiativeService.getObjectivesBySc(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.AllObjectives = data.data['Objective'];
      }
    }, error => {
      this.toastrService.error('Error while fetching Objectives for ' + ' ' + scCode);
    });
  }

  getObjectiveCode(event: any) {
    this.nestedArr = [];
    this.objCode = event;
    this.AllObjectives.forEach((val, key) => {
      if (this.objCode === val.code) {
        this.objName = val.name;
        this.objectiveStoryForm.controls.objectiveName.setValue(this.objName);
        this.objectiveStoryForm.controls.code.setValue(val.code);
        this.objectiveStoryForm.controls.name.setValue(val.name);
      }
    });
    this.getInitiativesByObjectiveCode();
    if (!!this.objCode && !!this.objectiveStoryScCode) {
      this.initiativeService.getMeasuresByObjAndScCode(this.objectiveStoryForm.controls.scCode.value, this.objCode).subscribe((data: any) => {
        if (data.status === '0' && data.data['Measures'].length > 0) {
          this.measureByObj = data.data['Measures'];
          this.objectiveStoryForm.controls.measureList.setValue(this.measureByObj);
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
                    obj.frequency = this.measureByObj[i].strategicMeasureList[j].frequency;
                    obj.target = this.measureByObj[i].strategicMeasureList[j].target;
                    obj.status = this.measureByObj[i].strategicMeasureList[j].status;
                    this.nestedArr.push(obj);
                  }
                }
              } else {
                let obj: any = {};
                obj.name = this.measureByObj[i].name;
                obj.frequency = 'NA';
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
      });
    }
    this.getAllObjectiveReportNames();
  }


  getAllObjectiveReportNames() {
    if (!!this.objectiveStoryForm.controls.year.value && !!this.objectiveStoryForm.controls.period.value) {
      this.bscService.getAllObjectiveReportNames(this.objectiveStoryForm.controls.year.value, this.objectiveStoryForm.controls.period.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.objectiveReportsNames = data.data['Reports'];
        } else {
          this.objectiveReportsNames = [];
        }
      });
    }
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

  getInitiativesByObjectiveCode() {
    if (!!this.objectiveStoryScCode && !!this.objCode) {
      this.bscService.getInitiativesByObjectives(this.objectiveStoryScCode, this.objCode).subscribe((data: any) => {
        if (data.status === '0' && data.data['Initiative'].length > 0) {
          this.initiatives = data.data['Initiative'];
        } else {
          this.initiatives = [];
        }
        this.dataSource = new MatTableDataSource(this.initiatives);
        this.dataSource.paginator = this.tableTwo;
        this.objectiveStoryForm.controls.initiativeList.setValue(this.initiatives);
      });
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

  saveReport() {
    this.bscService.saveObjectiveStory(this.objectiveStoryForm.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.clearFields();
        this.objName = null;
        this.initiatives = [];
        this.nestedArr = [];
        this.objectiveReportsNames = [];
        this.measureDataSource = new MatTableDataSource(this.nestedArr);
        this.dataSource = new MatTableDataSource(this.initiatives);
      }
    }, error => {
      this.toastrService.error('Error while saving report, Please try again later');
    });
  }

  clearFields() {
    this.objectiveStoryForm.reset();
    this.measureByObj = null;
    this.objName = null;
    this.initiatives = null;
  }
}
