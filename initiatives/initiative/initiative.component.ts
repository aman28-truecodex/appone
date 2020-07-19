import {Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import {InitiativeService} from '../initiative.service';
import {BscRestService} from '../../shared/rest.service';
import {EmitterService} from '../../shared/emitter.service';
import {FormBuilder} from '@angular/forms';
import {BscService} from '../../bsc/bsc.service';
import {ToastrService} from 'ngx-toastr';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';
import {Options} from 'ng5-slider';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {Util} from '../../shared/utils/util';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {SimpleModalService} from 'ngx-simple-modal';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-initiative',
  templateUrl: './initiative.component.html',
  styleUrls: ['./initiative.component.scss']
})
export class InitiativeComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['sNo', 'orgCode', 'scCode', 'code', 'reportingFrequency', 'budget', 'currencyType', 'owner', 'startDate', 'endDate', 'status', 'percentComplete', 'completed', 'completionDate', 'action'];
  codeAndName: any;
  orgName: any;
  codeName: any;
  balanceScoreCardData: any;
  minDate: Date;
  maxDate: Date;
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  marked: false;
  codeAndNameSubsription: any;
  AllObjectives: any = [];
  scCode: any;
  objCode: any;
  objectiveName: any;
  allInitiatives: any = [];
  initId: any;
  empMasterData: any;
  linkedObjectives: any;
  linkedObjectiveCode: any;
  linkedObjectiveName: any;
  AllObjectivesByScCode: any;
  isTextBox = false;
  fileName: any;
  fileAsBase64: any;
  errorMessage: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  value = 0;
  startDate: any;
  endDate: any;
  completionDate: any = null;

  currencyUnit = [
    {id: 1, type: 'USD'},
    {id: 1, type: 'GBP'},
    {id: 1, type: 'INR'},
  ];

  status = [
    {id: 1, status: 'In Progress'},
    {id: 1, status: 'In Transit'},
    {id: 1, status: 'Completed'}
  ];

  reportingFrequency = [
    {id: 1, frequency: 'WEEKLY'},
    {id: 2, frequency: 'DAILY'},
    {id: 3, frequency: 'YEARLY'},
    {id: 3, frequency: 'MONTHLY'},
    {id: 3, frequency: 'QUARTERLY'},
    {id: 3, frequency: 'HOURLY'},
  ];

  options: Options = {
    showTicksValues: true,
    stepsArray: [
      {value: 10},
      {value: 20},
      {value: 30},
      {value: 40},
      {value: 50},
      {value: 60},
      {value: 70},
      {value: 80},
      {value: 90},
      {value: 100}
    ]
  };

  @ViewChild('myInput') myInputVariable: ElementRef;

  constructor(private initiativeService: InitiativeService,
              private formBuilder: FormBuilder,
              private bscService: BscService,
              private toastrService: ToastrService,
              private bscRestService: BscRestService,
              private emitterService: EmitterService,
              private util: Util,
              private simpleModalService: SimpleModalService,
              private customValidators: CustomValidators) {
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate());
    this.bsConfig = Object.assign({}, {containerClass: this.colorTheme});
  }

  initiativeForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    code: ['', [this.customValidators.required]],
    name: ['', [this.customValidators.required]],
    description: [''],
    durationInHours: [''],
    durationInDays: [''],
    reportingFrequency: [null],
    budget: [''],
    currencyType: [null],
    plannedMajorExpenditure: [''],
    owner: [null],
    attachmentUrls: [''],
    analysis: [''],
    recommendations: [''],
    linkedObjectives: [],
    startDate: ['', this.customValidators.required],
    endDate: ['', this.customValidators.required],
    status: [null],
    percentComplete: [''],
    completed: [false],
    completionDate: [''],
    objectiveName: [''],
    objectiveCode: [null, this.customValidators.required],
    fileName: ['']
  });

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllObjectives();
    this.getAllInitiatives();
    this.getAllEmpMasterData();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getAllInitiatives() {
    this.bscRestService.getAllInitiatives().subscribe((data: any) => {
      if (data.status === '0' && data.data['Initiative'].length > 0) {
        this.allInitiatives = data.data['Initiative'];
        this.dataSource = new MatTableDataSource(this.allInitiatives);
        this.dataSource.paginator = this.paginator;
      } else {
        this.allInitiatives = [];
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllEmpMasterData() {
    this.bscRestService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getInitiative(event: any) {
    const initiativeId = event.target.value;
    if (!!initiativeId) {
      this.bscRestService.getInitiativeById(initiativeId).subscribe((data: any) => {
        if (data.status === '0') {
          this.initId = data.data['Initiative'].id;
          this.percentCompleted(data.data['Initiative'].percentComplete);
          this.initiativeForm.patchValue(data.data['Initiative']);
          this.fileName = data.data['Initiative'].fileName;
          this.initiativeForm.patchValue(data.data['Initiative']);
          this.value = data.data['Initiative']['percentComplete'];
        }
      });
    }
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getScorecardName(event: any) {
    this.scCode = event;
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.initiativeForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.initiativeForm.controls.scName.setValue(this.codeName);
      }
    });
    this.getObjectivesByScCode(this.scCode);
  }

  getObjectivesByScCode(scCode: any) {
    this.initiativeService.getObjectivesBySc(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.AllObjectivesByScCode = data.data['Objective'];
      }
    });
  }

  getCodeNameForPestal() {
    this.codeAndName.forEach((val, key) => {
      if (this.initiativeForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.initiativeForm.controls.orgName.setValue(this.orgName);
      }
    });
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

  getDateFormat(fullDate: any) {
    const date = new Date(fullDate);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  saveInitiative() {
    this.initiativeForm.controls.startDate.setValue(this.getDateFromMilliSec(this.startDate));
    this.initiativeForm.controls.endDate.setValue(this.getDateFromMilliSec(this.endDate));
    if (!!this.initiativeForm.controls.completionDate.value) {
      this.initiativeForm.controls.completionDate.setValue(this.getDateFromMilliSec(this.completionDate));
    }
    const reqObj = this.initiativeForm.value;
    if (!!this.initId) {
      this.initiativeService.updateInitiative(this.initId, reqObj).subscribe((data: any) => {
        if (data.status === '0') {
          this.initiativeForm.reset();
          this.getAllInitiatives();
          this.fileName = null;
          this.myInputVariable.nativeElement.value = null;
          this.initId = null;
          this.value = 0;
        }
      });
    } else {
      this.initiativeService.saveInitiative(reqObj).subscribe((data: any) => {
        if (data.status === '0') {
          this.initiativeForm.reset();
          this.getAllInitiatives();
          this.fileName = null;
          this.value = 0;
          this.myInputVariable.nativeElement.value = null;
        }
      }, error => {
        this.toastrService.error('Error While Saving please try again');
      });
    }


  }

  isCompleted(e) {
    this.marked = e.target.checked;
    this.initiativeForm.controls.completed.setValue(this.marked);
  }

  percentCompleted(event: any) {
    this.initiativeForm.controls.percentComplete.setValue(event);
  }

  getAllObjectives() {
    this.initiativeService.getAllObjectives().subscribe((data: any) => {
      if (data.status === '0') {
        this.AllObjectives = data.data['Objectives'];
      }
    });
  }

  getObj(event: any) {
    this.objCode = event;
    if (!!this.objCode && !!this.scCode) {
      this.initiativeForm.get('linkedObjectives').patchValue([`${this.scCode}::${this.objCode}`]);
    }
    this.AllObjectives.forEach((val, key) => {
      if (this.objCode === val.code) {
        this.objectiveName = val.name.toUpperCase();
        this.initiativeForm.controls.objectiveName.setValue(this.objectiveName);
      }
    });
  }

  uploadLogo(event: any) {
    const reader = new FileReader();
    this.fileName = event.target.files[0].name;
    if (event.target.files[0].size >= 2097152) {
      this.errorMessage = 'File size should be less than 2 MB';
      this.toastrService.error('File size should be less than 2 MB');
    } else {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileAsBase64 = reader.result;
        this.initiativeForm.controls['attachmentUrls'].setValue(this.fileAsBase64);
        this.initiativeForm.controls.fileName.setValue(this.fileName);
      };
    }
  }

  clearFields() {
    this.initiativeForm.reset();
    this.initId = null;
    this.fileName = null;
    this.myInputVariable.nativeElement.value = null;
    this.value = 0;
  }

  editInitiative(id, data) {
    this.initiativeForm.patchValue(data);
    this.fileName = data.fileName;
    this.value = data.percentComplete;
    this.initId = id;
  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you want to really delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteInitiaitve(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getAllInitiatives();
            }
          });
        }
      });
  }

  getDateFromMilliSec(data, hypenSepartedDate?) {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    if (hypenSepartedDate && hypenSepartedDate === true) {
      return `${month}-${day}-${year}`;
    } else {
      return `${month}/${day}/${year}`;
    }
  }

  ngOnDestroy(): void {
  }
}
