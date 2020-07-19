import {Component, OnInit, OnChanges} from '@angular/core';
import {FormBuilder, Validators, FormControl, FormGroup, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EmitterService} from '../../shared/emitter.service';
import {BscService} from '../../bsc/bsc.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {CommonService} from '../../shared/common.service';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {Router} from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  codeAndNameSubsription: any;
  codeAndName: any;
  orgName: any;
  balanceScoreCardData: any;
  scCodeName: any;
  focusedElement: any;
  reportType: any;
  reportElements: any;
  elemList: any;
  type: any;
  reportData: any;
  scCode: any;
  tooltipInfo = TOOL_TIP_INFO;
  element: any;
  reportElement: any;
  bscReportFlag = true;
  shwoPopUp: any = false;
  yearAndPeriod: any;

  constructor(private toasterService: ToastrService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private bscService: BscService,
              private customValidators: CustomValidators,
              private commonService: CommonService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private util: Util) {
  }

  reportTypes = [
    {name: 'Theme'},
    {name: 'objectives'},
    {name: 'initiatives'},
    {name: 'measures'},
    {name: 'initiative Summary'},
    {name: 'theme Summary'},
    {name: 'balance Scorecard'},
    {name: 'objective Summary'},

    // {name: 'measure Summary'}
  ];

  generateReportForm = this.formBuilder.group({
    year: [null, [this.customValidators.required]],
    period: [null, [this.customValidators.required]],
    organisationUnitCode: [null],
    orgName: [''],
    scorecardCode: [null, [this.customValidators.required]],
    scorecardName: [''],
    reportCode: ['', [this.customValidators.required]],
    reportName: ['', [this.customValidators.required]],
    reportType: [null, [this.customValidators.required]],
    elements: [null, [Validators.required]]
  });

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

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.generateReportForm.controls.organisationUnitCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.generateReportForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getBalanceScoreCard() {
    this.bscService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getScorecardName(event: any) {
    this.scCode = event;
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.generateReportForm.controls.scorecardCode.value === val.code) {
        this.scCodeName = val.name.toUpperCase();
        this.generateReportForm.controls.scorecardName.setValue(this.scCodeName);
      }
    });
    this.checkScCodeAndReportType(this.scCode, this.reportType);
  }

  checkScCodeAndReportType(scCode, type) {
    if (!!scCode && !!type) {
      this.bscService.getReports(this.generateReportForm.value).subscribe((data: any) => {
        this.reportElements = data;
        switch (this.reportType) {
          case 'bsc':
            this.bscReportFlag = true;
            break;
          case 'Theme':
            this.bscReportFlag = false;
            this.type = 'Theme';
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['theme'];
            break;
          case 'objectives':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['objectives'];
            this.type = 'objectives';
            this.bscReportFlag = true;
            break;
          case 'initiatives':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['initiatives'];
            this.type = 'initiatives';
            this.bscReportFlag = true;
            break;
          case 'measures':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['balanceScorecardBasicMeasure'];
            this.type = 'measures';
            this.bscReportFlag = true;
            break;
          case 'initiative Summary':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['initiativeStory'];
            this.type = 'initiativeStory';
            this.bscReportFlag = true;
            break;
          case 'objective Summary':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['objectiveStory'];
            this.type = 'objectiveStory';
            this.bscReportFlag = true;
            break;
          case 'theme Summary':
            this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['themeStory'];
            this.type = 'themeStory';
            this.bscReportFlag = true;
            break;
          case 'balance Scorecard':
            this.elemList = this.reportElements.data['balanceScorecardReportCustomDTO'];
            this.type = 'balanceScoreCard';
            this.bscReportFlag = false;
            this.generateReportForm.controls['elements'].setErrors({'incorrect': true});
            break;
          case 'measure Summary':

            break;
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

  shouldShowErrors(fieldName, formName) {
    if (this.focusedElement && this.focusedElement === fieldName) {
      return false;
    } else {
      return this.util.shouldShowErrors(fieldName, formName);
    }
  }

  getReportType(event: any) {
    this.bscReportFlag = true;
    this.reportType = event.target.value;
    if (!!this.reportType && !!this.scCode) {
      const reportType = this.generateReportForm.controls.reportType.value;
      this.generateReportForm.value.reportType = reportType.replace(/ +/g, '');
      this.bscService.getReports(this.generateReportForm.value).subscribe((data: any) => {
        this.reportElements = data;
        switch (this.reportType) {
          case 'Theme':
            this.type = 'Theme';
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['theme']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['theme'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'Theme';
            this.bscReportFlag = true;
            break;
          case 'objectives':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['objectives']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['objectives'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'objectives';
            this.bscReportFlag = true;
            break;
          case 'initiatives':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['initiatives']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['initiatives'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'initiatives';
            this.bscReportFlag = true;
            break;
          case 'measures':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['measures']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['measures'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'measures';
            this.bscReportFlag = true;
            break;
          case 'initiative Summary':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['initiativeStory']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['initiativeStory'];
            } else {
              this.elementsFieldEnable();

            }
            this.type = 'initiativeStory';
            this.bscReportFlag = true;
            break;
          case 'objective Summary':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['objectiveStory']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['objectiveStory'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'objectiveStory';
            this.bscReportFlag = true;
            break;
          case 'theme Summary':
            if (!!this.reportElements.data['BalanceScorecardReportDTO']['themeStory']) {
              this.elemList = this.reportElements.data['BalanceScorecardReportDTO']['themeStory'];
            } else {
              this.elementsFieldEnable();
            }
            this.type = 'themeStory';
            this.bscReportFlag = true;
            break;
          case 'balance Scorecard':
            this.bscReportFlag = false;
            this.bscService.getObjectivesByScCode(this.scCode).subscribe((data: any) => {
              this.elemList = data.data['Objective'];
              if (!!this.elemList) {
                this.elemList = data.data['Objective'];
              } else {
                this.toasterService.error('No Reports Available');
                this.elemList = [];
              }
              let formControl = this.generateReportForm.get('elements') as FormControl;
              formControl.clearValidators();
              formControl.updateValueAndValidity();
              this.type = 'balanceScoreCard';
            });
            break;
        }
      });
    } else {
      this.toasterService.error('Please Select Scorecard');
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getReportForElement(event: any) {
    this.element = event;
    if (!!this.generateReportForm.controls.year.value && !!this.generateReportForm.controls.period.value) {
      this.yearAndPeriod = {
        year: this.generateReportForm.controls.year.value,
        period: this.generateReportForm.controls.period.value
      };
    }
    if (!!this.element) {
      switch (this.type) {
        case 'bsc':
          break;
        case 'Theme':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = elem.name;
              this.reportData = elem;
            }
          });
          break;
        case 'objectives':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = elem.name;
              this.reportData = elem;
            }
          });
          break;
        case 'initiatives':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = this.element.name;
              this.reportData = elem;
            }
          });
          break;
        case 'measures':
          if (!!this.elemList) {
            this.elemList.forEach((elem) => {
              if (this.element.code === elem.code) {
                this.reportElement = this.element.name;
                this.reportData = elem;
              }
            });
          }
          break;
        case 'initiativeStory':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = this.element.name;
              this.reportData = elem;
            }
          });
          break;
        case 'objectiveStory':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = this.element.name;
              this.reportData = elem;
            }
          });
          break;
        case 'measureStory':
          break;
        case 'themeStory':
          this.elemList.forEach((elem) => {
            if (this.element.code === elem.code) {
              this.reportElement = this.element.name;
              this.reportData = elem;
            }
          });
          break;
      }
    }
  }


  elementsFieldEnable() {
    let formControl = this.generateReportForm.get('elements') as FormControl;
    this.toasterService.error('No Reports Available');
    formControl.setValue('');
    formControl.setValidators([Validators.required]);
    formControl.updateValueAndValidity();
    this.elemList = [];
  }

  openModalPopUp() {
    switch (this.type) {
      case 'initiativeStory':
        this.shwoPopUp = false;
        this.commonService.setSummaryReport(this.reportData);
        localStorage.setItem('InitiativeSummaryData', JSON.stringify(this.reportData));
        this.router.navigate(['/reporting/InitiativeSummary']);
        break;
      case 'objectiveStory':
        this.shwoPopUp = false;
        this.commonService.setSummaryReport(this.reportData);
        localStorage.setItem('objectiveSummaryData', JSON.stringify(this.reportData));
        this.router.navigate(['/reporting/objectiveSummary']);
        break;
      case 'themeStory':
        this.shwoPopUp = false;
        this.commonService.setSummaryReport(this.reportData);
        localStorage.setItem('themeSummaryData', JSON.stringify(this.reportData));
        this.router.navigate(['/reporting/themeSummary']);
        break;
      case 'balanceScoreCard':
        this.shwoPopUp = false;
        this.commonService.setSummaryReport(this.elemList);
        localStorage.setItem('balanceScoreCardData', JSON.stringify(this.elemList));
        this.router.navigate(['/reporting/balanceScorecard']);
        break;
      default:
        this.shwoPopUp = true;
    }

  }
}
