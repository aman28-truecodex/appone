import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder} from '@angular/forms';
import {InitiativeService} from '../../initiatives/initiative.service';
import {ExcelService} from '../../shared/excel.service';
import {BscService} from '../../bsc/bsc.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-value-gap-closer',
  templateUrl: './value-gap-closer.component.html',
  styleUrls: ['./value-gap-closer.component.scss']
})
export class ValueGapCloserComponent implements OnInit {
  displayedColumns: string[] = ['sNo', 'year', 'organizationUnitCode',
    'organizationUnitName', 'productGroup', 'revenueGap', 'version', 'percentage', 'amount', 'scorecard',
    'objective', 'initiative', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  codeAndName: any;
  orgName: any;
  reqObj: any;
  prdGrp: any;
  valueGapCloserTableData: any = [];
  valueGapCloserId: any;
  revenueGap: any;
  amount: any;
  codeAndNameSubsription: any;
  percent: any;
  balanceScoreCardData: any;
  initiativeCode: any;
  scCode: any;
  objectives: any;
  objCode: any;
  initiatives: any;
  Filter: any = '';
  focusedElement: any;
  tooltipInfo = TOOL_TIP_INFO;

  years = [
    {id: 1, name: '2014'},
    {id: 2, name: '2015'},
    {id: 3, name: '2016'},
    {id: 4, name: '2017'},
    {id: 5, name: '2018'},
    {id: 6, name: '2019'},
    {id: 7, name: '2020'},
    {id: 8, name: '2021'},
    {id: 9, name: '2022'},
    {id: 10, name: '2023'},
    {id: 11, name: '2024'}];

  versions = [
    {id: 1, version: 'v1'},
    {id: 2, version: 'v2'},
    {id: 3, version: 'v3'},
    {id: 4, version: 'v4'},
    {id: 5, version: 'v5'},
  ];

  valueGapCloserForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    productGroupName: [null, [this.customValidators.required]],
    revenueGap: [''],
    percentage: ['', [this.customValidators.required]],
    amount: [''],
    year: [null, this.customValidators.required],
    version: [null, [this.customValidators.required]],
    scorecardCode: [null],
    scorecardName: [''],
    objectiveCode: [null],
    objectiveName: [''],
    initiativeCode: [null],
    initiativeName: ['']
  });

  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private bscService: BscService,
              private emitterService: EmitterService,
              private initiativeService: InitiativeService,
              private excelService: ExcelService,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  ngOnInit() {
    this.getAllValueGapCloser();
    this.getOrgUnitCode();
    this.getProductGrp();
    this.getBalanceScoreCard();
    this.getInitiative();
  }


  getAllValueGapCloser() {
    this.bscRestService.getValueGapCloser().subscribe((data: any) => {
      if (data.status === '0' && data.data['ValueGapCloserList'].length > 0) {
        this.valueGapCloserTableData = data.data['ValueGapCloserList'];
        this.dataSource = new MatTableDataSource(this.valueGapCloserTableData);
        this.dataSource.paginator = this.paginator;
      } else {
        this.valueGapCloserTableData = [];
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.valueGapCloserForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.valueGapCloserForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.valueGapCloserForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.valueGapCloserForm.controls.orgName.setValue(this.orgName);
      }
    });
    this.getRevenueGapAmt();
  }


  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
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

  getRevenueGapAmt() {
    this.reqObj = this.valueGapCloserForm.value;
    const prodGroupName = decodeURIComponent(this.valueGapCloserForm.value.productGroupName);
    if (!!this.reqObj.orgCode && !!prodGroupName && !!this.reqObj.year && !!this.reqObj.version) {
      this.bscRestService.getRevenueGap(this.reqObj.orgCode, prodGroupName, this.reqObj.year, this.reqObj.version).subscribe((data: any) => {
        this.revenueGap = data.data['ValueGap'];
        this.valueGapCloserForm.controls.revenueGap.setValue(this.revenueGap);
        if (this.valueGapCloserForm.controls.percentage.value !== '' && this.valueGapCloserForm.controls.revenueGap.value !== '') {
          this.amount = (this.valueGapCloserForm.controls.percentage.value * this.valueGapCloserForm.controls.revenueGap.value) / 100;
          this.valueGapCloserForm.controls.amount.setValue(this.amount);
        }
      }, error => {
        if (!!this.valueGapCloserForm.controls.revenueGap.value) {
          this.valueGapCloserForm.controls.revenueGap.setValue(null);
        }
      });
    }
  }

  calcAmount(event) {
    this.percent = event.target.value;
    if (!!this.valueGapCloserForm.controls.revenueGap.value) {
      this.amount = (this.valueGapCloserForm.controls.revenueGap.value / 100) * this.percent;
      this.valueGapCloserForm.controls.amount.setValue(this.amount);
    }
  }

  getProductGrp() {
    this.bscRestService.getAllProductGroup().subscribe((data: any) => {
      if (data.status === '0') {
        this.prdGrp = data.data['ProductGroup'];
      }
    });
  }

  saveValueGapCloser() {
    if (!!this.valueGapCloserId) {
      this.bscRestService.updateValueGapCloser(this.valueGapCloserForm.value, this.valueGapCloserId).subscribe((data: any) => {
        this.valueGapCloserId = null;
        this.getAllValueGapCloser();
        this.valueGapCloserForm.reset();
      });
    } else {
      this.bscRestService.saveValueGapCloser(this.valueGapCloserForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getAllValueGapCloser();
          this.valueGapCloserForm.reset();
        }
      });
    }

  }

  editValueGapCloser(index, data) {
    this.valueGapCloserForm.patchValue(data);
    this.valueGapCloserId = index;
    if (!!this.valueGapCloserForm.controls.scorecardCode.value && !!this.valueGapCloserForm.controls.objectiveCode.value) {
      this.getObjectivesForSc(this.valueGapCloserForm.controls.scorecardCode.value);
      this.getInitiativesForScCodeAndObjCode(this.valueGapCloserForm.controls.scorecardCode.value, this.valueGapCloserForm.controls.objectiveCode.value);
    } else {
      this.objectives = [];
      this.initiatives = [];
    }
  }

  getBalanceScoreCard() {
    this.bscService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }

  getInitiative() {
    this.initiativeService.getInitiative().subscribe((codes) => {
      this.initiativeCode = codes;
    });
  }


  getScCode(event: any) {
    if (!!event) {
      this.scCode = event;
      this.valueGapCloserForm.controls.initiativeCode.setValue('');
      this.valueGapCloserForm.controls.objectiveCode.setValue('');
      if (this.balanceScoreCardData.length > 0) {
        this.balanceScoreCardData.forEach((elem) => {
          if (event === elem.code) {
            this.valueGapCloserForm.controls.scorecardName.setValue(elem.name);
          }
        });
      }
      this.getObjectivesForSc(this.scCode);
    }
  }

  getObjectivesForSc(scCode: any) {
    this.initiativeService.getObjectivesBySc(scCode).subscribe((data: any) => {
      this.objectives = data.data['Objective'];
    });
  }

  getObjCode(event: any) {
    if (!!event) {
      this.objCode = event;
      if (!!this.scCode && !!this.objCode) {
        this.getInitiativesForScCodeAndObjCode(this.scCode, this.objCode);
      }
      if (this.objectives.length > 0) {
        this.objectives.forEach((elem) => {
          if (event === elem.code) {
            this.valueGapCloserForm.controls.objectiveName.setValue(elem.name);
          }
        });
      }
    }
  }

  setInitiativeName(event: any) {
    if (!!event && this.initiatives.length > 0) {
      this.initiatives.forEach((elem) => {
        if (event === elem.code) {
          this.valueGapCloserForm.controls.initiativeName.setValue(elem.name);
        }
      });
    }
  }

  getInitiativesForScCodeAndObjCode(scCode, objCode) {
    if (!!objCode && !!scCode) {
      this.initiativeService.getInitiativesByScAndObjCode(scCode, objCode).subscribe((data: any) => {
        if (data.status === '0') {
          this.initiatives = data.data['Initiative'];
        }
      });
    }
  }

  clearFields() {
    this.valueGapCloserForm.reset();
    this.valueGapCloserId = null;
  }

  exportAsExcel() {
    this.excelService.exportAsExcelFile(this.valueGapCloserTableData, 'Value Gap Closer');
  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you want to really delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteValueGapCloser(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getAllValueGapCloser();
            }
          });
        }
      });
  }

}
