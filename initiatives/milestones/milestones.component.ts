import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Options} from 'ng5-slider';
import {BscService} from '../../bsc/bsc.service';
import {InitiativeService} from '../initiative.service';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {BscRestService} from '../../shared/rest.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {SimpleModalService} from 'ngx-simple-modal';
import {MatPaginator, MatTableDataSource} from '@angular/material';


@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss']
})
export class MilestonesComponent implements OnInit, OnDestroy {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['sNo', 'orgCode', 'initiativeCode', 'code', 'owner', 'collaborators', 'startDate', 'endDate', 'status', 'percentComplete', 'completed', 'completionDate', 'action'];
  codeAndName: any;
  orgName: any;
  value = 0;
  initiativeCode: any = [];
  initiativeName: any;
  focusedElement = '';
  codeAndNameSubsription: any;
  empMasterData: any;
  tooltipInfo = TOOL_TIP_INFO;
  milestone: any = [];
  milestoneId: any;
  balanceScoreCardData: any;
  startDate: any;
  endDate: any;
  completionDate: any = null;

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

  status = [
    {id: 1, status: 'In Progress'},
    {id: 1, status: 'In Transit'},
    {id: 1, status: 'Completed'}
  ];

  constructor(private initiativeService: InitiativeService,
              private formBuilder: FormBuilder,
              private bscService: BscService,
              private toastrService: ToastrService,
              private bscRestService: BscRestService,
              private emitterService: EmitterService,
              private customValidators: CustomValidators,
              private simpleModalService: SimpleModalService,
              private util: Util) {
  }

  milestoneForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    initiativeCode: [null, [this.customValidators.required]],
    initiativeName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    code: ['', [this.customValidators.required]],
    name: ['', [this.customValidators.required]],
    description: [''],
    owner: [null],
    collaborators: [null],
    parentCode: [''],
    parentName: [''],
    startDate: [null, [this.customValidators.required]],
    endDate: [null, [this.customValidators.required]],
    analysis: [''],
    recommendation: [''],
    status: [null],
    percentComplete: [null],
    completed: [false],
    completionDate: [null]
  });

  ngOnInit() {
    this.getOrgUnitCode();
    // this.getInitiative();
    this.getAllEmpMasterData();
    this.getAllMileStones();
    this.getBalanceScoreCard();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getScCode(code) {
    const scCode = code;
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.milestoneForm.controls.scCode.value === val.code) {
        this.milestoneForm.controls.scName.setValue(val.name);
        this.milestoneForm.controls.scCode.setValue(val.code);
      }
    });
  }

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.milestoneForm.controls.scCode.value === val.code) {
        this.milestoneForm.controls.scName.setValue(val.name);
        this.milestoneForm.controls.scCode.setValue(val.code);
      }
    });
    this.getInitiativesByScCode(this.milestoneForm.controls.scCode.value);
  }

  getInitiativesByScCode(scCode) {
    this.bscRestService.getInitiativesByScorecard(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.initiativeCode = data.data['Initiative'];
      }
    });
  }

  getAllMileStones() {
    this.bscRestService.getMilestone().subscribe((data: any) => {
      if (data.status === '0' && data.data['InitiativeMilestone'].length > 0) {
        this.milestone = data.data['InitiativeMilestone'];
        this.dataSource = new MatTableDataSource(this.milestone);
        this.dataSource.paginator = this.paginator;
      } else {
        this.milestone = [];
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  editMilestone(id: any, data: any) {
    console.log(data);
    this.getInitiativesByScCode(data.scCode);
    this.getInitiatives(data);

    this.milestoneForm.patchValue(data);
    this.milestoneForm.controls.completed.setValue(data.completed);
    this.value = data.percentComplete;
    this.milestoneId = id;
  }

  async getInitiatives(data) {
   await this.initiativeCode.forEach((elem, index) => {
      if(data.initiativeCode === elem.code) {
        this.milestoneForm.controls.initiativeCode.setValue(elem.initiativeCode);
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

  getInitiativeName() {
    this.initiativeCode.forEach((val, key) => {
      if (this.milestoneForm.controls.initiativeCode.value === val.code) {
        this.initiativeName = val.name.toUpperCase();
        this.milestoneForm.controls.initiativeName.setValue(this.initiativeName);
      }
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.milestoneForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.milestoneForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  saveMilestone() {
    this.milestoneForm.controls.startDate.setValue(this.getDateFromMilliSec(this.startDate));
    this.milestoneForm.controls.endDate.setValue(this.getDateFromMilliSec(this.endDate));
    if (!!this.milestoneForm.controls.completionDate.value) {
      this.milestoneForm.controls.completionDate.setValue(this.getDateFromMilliSec(this.completionDate));
    }
    if (!!this.milestoneId) {
      this.bscRestService.updateMilestone(this.milestoneId, this.milestoneForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.milestoneForm.reset();
          this.milestoneId = null;
          this.getAllMileStones();
          this.value = 0;
        }
      });
    } else {
      this.initiativeService.saveMilestone(this.milestoneForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.milestoneForm.reset();
          this.getAllMileStones();
          this.value = 0;
        }
      });
    }
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

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you want to really delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteMilestone(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getAllMileStones();
            }
          });
        }
      });
  }

  percentCompleted(event: any) {
    this.milestoneForm.controls.percentComplete.setValue(parseInt(event));
  }

  isChecked(e) {
    const completed = e.target.checked;
    this.milestoneForm.controls.completed.setValue(completed);
  }

  clearField() {
    this.milestoneForm.reset();
    this.milestoneId = null;
    this.value = 0;
  }

  ngOnDestroy(): void {
  }

}
