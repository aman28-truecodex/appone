import {Component, OnInit, ViewChild} from '@angular/core';
import {BscService} from '../../bsc/bsc.service';
import {FormBuilder, Validators} from '@angular/forms';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-themestory',
  templateUrl: './themestory.component.html',
  styleUrls: ['./themestory.component.scss']
})

export class ThemestoryComponent implements OnInit {
  @ViewChild('paginator1') tableOne: MatPaginator;
  dataSource: MatTableDataSource<any>;
  @ViewChild('paginator2') tableTwo: MatPaginator;
  dataSource1: MatTableDataSource<any>;


  displayedColumns = ['objective' ,'measure','frequency', 'actual', 'target', 'status'];
  displayedInitiativeColumns = ['sNo', 'name', 'owner', 'status', 'percentComplete', 'startDate', 'endDate'];
  nestedArr: any = [];
  spans = [];
  codeAndNameSubsription: any;
  codeAndName: any;
  balanceScoreCardData: any;
  themes: any;
  objectivesList: any = [];
  initiativeList: any = [];
  scCode: any;
  empMasterData: any;
  initiativeAndMileStoneList: any = [];
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  orgName: any;
  scName: any;
  themeName: any;
  themeReportsNames = [];

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


  themeStoryForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    code: [null, [this.customValidators.required]],
    name: [''],
    description: [''],
    period: [null, [this.customValidators.required]],
    owner: [null],
    collaborators: [null],
    analysis: [''],
    recommendation: [''],
    attachmentUrls: [''],
    reportUrls: [[]],
    initiativeList: [''],
    objective: [''],
    year: [null, [this.customValidators.required]]
  });

  constructor(private bscService: BscService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private customValidators: CustomValidators,
              private util: Util) {

  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllEmpMasterData();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.themeStoryForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.themeStoryForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getAllEmpMasterData() {
    this.bscService.getEmpMasterData().subscribe((data: any) => {
      if (!!data) {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getBalanceScoreCard() {
    this.bscService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getAllObjectivesforAScorecard() {
    if (this.themes.length > 0) {
      this.themes.forEach((val, key) => {
        if (this.themeStoryForm.controls.code.value === val.code) {
          this.themeName = val.name;
          this.themeStoryForm.controls.name.setValue(this.themeName);
        }
      });
    }
    this.getAllThemeReportNames();
    if (!!this.themeStoryForm.controls.code.value) {
      this.nestedArr = [];
      this.bscService.getAllObjectivesforAScorecard(this.themeStoryForm.controls.scCode.value, this.themeStoryForm.controls.code.value).subscribe((data: any) => {
        if (data.status === '0' && !!data.data['Objective'] && data.data['Objective'].length > 0) {
          this.objectivesList = data.data['Objective'];
          this.themeStoryForm.controls.objective.setValue(this.objectivesList);
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
        this.dataSource.paginator = this.tableOne;
        this.cacheSpan('name', d => d.name);
        this.cacheSpan('measureName', d => d.name + d.measureName);
      });
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  getAllThemeReportNames() {
    this.bscService.getAllThemeReportNames(this.themeStoryForm.controls.year.value, this.themeStoryForm.controls.period.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.themeReportsNames = data.data['Reports'];
      } else {
        this.themeReportsNames = [];
      }
    });
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

  getThemeName($event) {
    if (this.themes.length >= 1) {
      this.themes.forEach((elem) => {
        if (event === elem.code) {
          this.themeStoryForm.controls.name.setValue(elem.name);
        }
      });
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

  getInitiaitvesAndMileStones() {
    this.bscService.getInitiativesAndMilestone(this.themeStoryForm.controls.scCode.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.initiativeAndMileStoneList = data.data['Initiative'];
      }
    });
  }

  getAllInitiativesForAScorecard() {
    this.initiativeList = [];
    if (!!this.themeStoryForm.controls.code.value) {
      this.bscService.getAllInitiativesforAScorecard(this.themeStoryForm.controls.scCode.value, this.themeStoryForm.controls.code.value).subscribe((data: any) => {
        if (data.status === '0' && data.data['Initiative'].length > 0) {
          this.initiativeList = data.data['Initiative'];
          this.themeStoryForm.controls.initiativeList.setValue(this.initiativeList);
        } else {
          this.themeStoryForm.controls.initiativeList.setValue(this.initiativeList);
        }
        this.dataSource1 = new MatTableDataSource(this.initiativeList);
        this.dataSource1.paginator = this.tableTwo;
      });
    }
  }

  getScCode(event: any) {
    this.scCode = event;
    if (!!this.scCode) {
      this.balanceScoreCardData.forEach((val, key) => {
        if (this.themeStoryForm.controls.scCode.value === val.code) {
          this.scName = val.name;
          this.themeStoryForm.controls.scName.setValue(this.scName);
        }
      });
      this.bscService.getThemesByScCode(this.scCode).subscribe((data: any) => {
        if (data.status === '0') {
          this.themes = data.data['Themes'];
        }
      }, error => {
        this.toastrService.error('No Themes exist for' + ' ' + this.scCode);
      });
    }
  }

  clearFields() {
    this.themeStoryForm.reset();
    this.initiativeAndMileStoneList = [];
    this.initiativeList = [];
    this.objectivesList = [];
  }


  saveReport() {
    this.bscService.saveThemeStory(this.themeStoryForm.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.clearFields();
        this.initiativeList = [];
        this.objectivesList = [];
        this.themeReportsNames = [];
        this.nestedArr = [];
        this.dataSource = new MatTableDataSource(this.nestedArr);
        this.dataSource1 = new MatTableDataSource(this.initiativeList);
      }
    });
  }


}
