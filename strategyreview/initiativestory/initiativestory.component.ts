import {Component, OnInit, ViewChild} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {FormBuilder} from '@angular/forms';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-initiativestory',
  templateUrl: './initiativestory.component.html',
  styleUrls: ['./initiativestory.component.scss']
})

export class InitiativestoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  codeAndName: any;
  codeAndNameSubsription: any;
  empMasterData: any;
  balanceScoreCardData: any;
  scCode: any;
  objectivesSc: any;
  ObjCode: any;
  initiativeList: any = [];
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  ganttChart: any = [];
  dataSource: MatTableDataSource<any>;
  displayedInitiativeColumns = ['sNo', 'name', 'owner', 'status', 'percentComplete', 'startDate', 'endDate'];
  initiativeReportsNames: any = [];


  initiativeStoryForm = this.formBuilder.group({
    orgUnit: [null, [this.customValidators.required]],
    orgName: [null],
    scoreCard: [null, [this.customValidators.required]],
    scName: [null],
    code: [null, [this.customValidators.required]],
    name: [null, []],
    objective: [null, [this.customValidators.required]],
    description: [''],
    owner: [null],
    collaborators: [null],
    analysis: [''],
    recommendation: [''],
    attachmentUrls: [''],
    initiativeList: [''],
    reportUrls: [[]],
    ganttChart: [''],
    year: [null, [this.customValidators.required]],
    period: [null, [this.customValidators.required]]
  });

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

  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
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

  getScorecardName(scCode: any) {
    this.balanceScoreCardData.forEach((val, key) => {
      if (scCode === val.code) {
        const scName = val.name.toUpperCase();
        this.initiativeStoryForm.controls.scName.setValue(scName);
      }
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.initiativeStoryForm.controls.orgUnit.value === val.code) {
        const orgName = val.name.toUpperCase();
        this.initiativeStoryForm.controls.orgName.setValue(orgName);
      }
    });
  }

  getAllEmpMasterData() {
    this.bscRestService.getEmpMasterData().subscribe((data: any) => {
      if (!!data) {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    }, error => {
      this.toastrService.error('No Scorecards exist');
    });
  }

  getAllInitiativeReportNames() {
    if (!!this.initiativeStoryForm.controls.year.value && !!this.initiativeStoryForm.controls.period.value) {
      this.bscRestService.getAllInitiativeReportNames(this.initiativeStoryForm.controls.year.value, this.initiativeStoryForm.controls.period.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.initiativeReportsNames = data.data['Reports'];
        } else {
          this.initiativeReportsNames = [];
        }
      });
    }

  }

  getScCode(event: any) {
    this.scCode = event;
    if (!!this.scCode) {
      this.bscRestService.getAllObjectivesByScCode(this.scCode).subscribe((data: any) => {
        this.objectivesSc = data.data['Objective'];
      }, error => {
        this.toastrService.error('No Objectives for' + ' ' + this.scCode);
      });
    }
    this.getScorecardName(this.scCode);
    this.getAllInitiativeReportNames();
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

  getInitiaitvesForObjective() {
    this.ObjCode = this.initiativeStoryForm.controls.objective.value;
    if (!!this.ObjCode && !!this.scCode) {
      this.getInitiativesByObjCode();
    }
  }

  getInitiativesByObjCode() {
    this.bscRestService.getInitiativesByObjectives(this.scCode, this.ObjCode).subscribe((data: any) => {
      if (data.status === '0' && data.data['Initiative'].length > 0) {
        this.initiativeList = data.data['Initiative'];
        this.dataSource = new MatTableDataSource(this.initiativeList);
        this.dataSource.paginator = this.paginator;
        this.initiativeStoryForm.controls.initiativeList.setValue(this.initiativeList);
      } else {
        this.initiativeStoryForm.controls.initiativeList.setValue(this.initiativeList);
      }
    });
  }

  saveReport() {
    this.bscRestService.saveInitiativeStory(this.initiativeStoryForm.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.clearFields();
        this.initiativeList = [];
        this.ganttChart = [];
        this.dataSource = new MatTableDataSource(this.initiativeList);
      }
    }, error => {
      this.toastrService.error('Error while saving report, Please try again later');
    });
  }

  getInitiativeName(event) {
    if (this.initiativeList.length >= 1) {
      this.initiativeList.forEach((elem) => {
        if (event === elem.code) {
          this.initiativeStoryForm.controls.name.setValue(elem.name);
          this.ganttChart = elem;
          this.initiativeStoryForm.controls.ganttChart.setValue(this.ganttChart);
        }
      });
    }
  }

  clearFields() {
    this.initiativeStoryForm.reset();
    this.initiativeList = [];
    this.ganttChart = [];
    this.dataSource = new MatTableDataSource(this.initiativeList);
  }
}
