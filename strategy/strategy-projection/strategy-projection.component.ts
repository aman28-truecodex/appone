import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {Subject} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {EmitterService} from '../../shared/emitter.service';
import {ExcelService} from '../../shared/excel.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-strategy-projection',
  templateUrl: './strategy-projection.component.html',
  styleUrls: ['./strategy-projection.component.scss']
})
export class StrategyProjectionComponent implements OnDestroy, OnInit, OnDestroy {


  codeAndName: any;
  orgName: any;
  strategyProjectionForm: FormGroup;
  strategyProjectionTableData: any = [];
  strategyProjId: any;
  isEditDetails: any;
  prdGrp: any;
  prdGrpSubscription: any;
  unitOfMeasure: any;
  codeAndNameSubsription: any;
  currentYear: any;
  Filter: any = '';
  focusedElement: any;
  tooltipInfo = TOOL_TIP_INFO;
  projectionExcelData: any;
  dataString: any;
  resultsLength = 0;

  constructor(private formBuilder: FormBuilder,
              private bscRestService: BscRestService,
              private toastrService: ToastrService,
              private emitterService: EmitterService,
              private excelService: ExcelService,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {

    this.prdGrpSubscription = this.emitterService.productGroup$.subscribe((data: any) => {
      if (data) {
        this.getProductGrp();
      }
    });
  }

  versions = [{id: 1, version: 'v1'},
    {id: 2, version: 'v2'},
    {id: 3, version: 'v3'},
    {id: 4, version: 'v4'},
    {id: 5, version: 'v5'},
  ];

  AllYearsData = [
    {yearRef: 'Y-5', value: -5},
    {yearRef: 'Y-4', value: -4},
    {yearRef: 'Y-3', value: -3},
    {yearRef: 'Y-2', value: -2},
    {yearRef: 'Y-1', value: -1},
    {yearRef: 'Y', value: 0},
    {yearRef: 'Y+1', value: 1},
    {yearRef: 'Y+2', value: 2},
    {yearRef: 'Y+3', value: 3},
    {yearRef: 'Y+4', value: 4},
    {yearRef: 'Y+5', value: 5}
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

  currencyUnit = [
    {id: 1, type: 'USD'},
    {id: 1, type: 'GBP'},
    {id: 1, type: 'INR'},
  ];

  getYear(event) {
    this.currentYear = event;
  }

  createform() {
    const arr = [];
    for (let i = 0; i < this.AllYearsData.length; i++) {
      arr.push(this.BuildFormDynamic(this.AllYearsData[i]));
    }

    this.strategyProjectionForm = this.formBuilder.group({
      orgCode: [null, [this.customValidators.required]],
      orgName: [''],
      region: [''],
      currencyType: [null],
      productGroupName: [null],
      productGroupUnitOfMeasure: [''],
      year: [null, [this.customValidators.required]],
      version: [null, [this.customValidators.required]],
      values: this.formBuilder.array(arr)
    });
  }

  BuildFormDynamic(product): FormGroup {
    return this.formBuilder.group({
      yearRef: [product.yearRef],
      yearTerm: [product.value],
      year: [''],
      quantity: [''],
      averagePrice: [''],
      revenueAmount: ['']
    });
  }

  ngOnInit() {
    this.createform();
    this.getProjectionDataForExcel();
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 1
    // };
    this.getOrgUnitCode();
    this.getAllStrategyProjection();
    this.getProductGrp();
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

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.strategyProjectionForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.strategyProjectionForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getCodeNameForPestal() {
    this.codeAndName.forEach((val, key) => {
      if (this.strategyProjectionForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.strategyProjectionForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  submitStrategyProjection() {
    if (this.strategyProjId || this.isEditDetails) {
      this.bscRestService.UpdateStrategyProjection(this.strategyProjectionForm.value, this.strategyProjId).subscribe((data: any) => {
        if (data.status === '0') {
          this.strategyProjId = null;
          this.strategyProjectionForm.reset();
          this.getAllStrategyProjection();
          this.getProjectionDataForExcel();
        }
      });
    } else {
      this.strategyProjectionForm.value.values.forEach((ele, i) => {
        ele.yearRef = this.AllYearsData[i].yearRef;
      });
      this.strategyProjectionForm.value.values.map((ele) => {
        ele.year = Number(this.strategyProjectionForm.value.year) + Number(ele.yearTerm);
        delete ele.yearTerm;
      });
      this.bscRestService.saveStrategyProjection(this.strategyProjectionForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getAllStrategyProjection();
          this.getProjectionDataForExcel();
          this.strategyProjectionForm.reset();
        }
      });
    }
  }

  editStrategyProjection(data: any, index) {
    this.strategyProjectionForm.patchValue(data[index]);
    this.strategyProjId = data[index].id;
    this.isEditDetails = true;
  }

  getAllStrategyProjection() {
    this.bscRestService.getAllStrategyProjection().subscribe((data: any) => {
      this.strategyProjectionTableData = data.data['StrategicProjection'];
    });
  }

  getProjectionDataForExcel() {
    this.bscRestService.getAllStrategyProjectionForExcel().subscribe((data: any) => {
      if (data.status === '0') {
        this.projectionExcelData = data.data['StrategicProjection'];
      }
    });
  }


  ngOnDestroy(): void {
  }

  calRevenueAmt(index: any) {
    if (this.strategyProjectionForm.value.values[index].quantity && this.strategyProjectionForm.value.values[index].averagePrice) {
      const revAmt = this.strategyProjectionForm.value.values[index].quantity * this.strategyProjectionForm.value.values[index].averagePrice;
      this.strategyProjectionForm.controls.values['controls'][index].controls.revenueAmount.setValue(revAmt);
    }
  }

  clear() {
    this.strategyProjectionForm.reset();
    this.strategyProjId = null;
  }

  getProductGrp() {
    this.bscRestService.getAllProductGroup().subscribe((data: any) => {
      this.prdGrp = data.data['ProductGroup'];
    });
  }

  getProductUnitOfMeasure() {
    this.prdGrp.forEach((val, key) => {
      if (this.strategyProjectionForm.controls.productGroupName.value === val.name) {
        this.unitOfMeasure = val.unitOfMeasure.toUpperCase();
        this.strategyProjectionForm.controls.productGroupUnitOfMeasure.setValue(this.unitOfMeasure);
      }
    });
  }

  exportAsExcel() {
    this.excelService.exportAsExcelFile(this.projectionExcelData, 'Strategic Projection');
  }

  ImportAsExcel(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.dataString = jsonData;
      if (!!this.dataString) {
        this.postExcelData(this.dataString.data);
      }
    };
    reader.readAsBinaryString(file);
  }

  postExcelData(dataString: any) {
    this.bscRestService.saveExcelImportData(dataString).subscribe((data: any) => {
      if (!!data) {
        this.getAllStrategyProjection();
      }
    }, error => {
      console.log('failed to post');
    });
  }



  // setDownload(data) {
  //   this.willDownload = true;
  //   setTimeout(() => {
  //     const el = document.querySelector('#download');
  //     el.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(data)}`);
  //     el.setAttribute('download', 'xlsxtojson.json');
  //   }, 1000);
  // }

  //
  // deleteStrategyPorjection(id: any) {
  //   this.bscRestService.deleteStrategyProjection(id).subscribe((data) => {
  //     this.getAllStrategyProjection();
  //   });
  // }

  showConfirm(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Confirmation',
      message: 'Are you sure'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteStrategyProjection(id).subscribe((data) => {
            this.getAllStrategyProjection();
          });
        }
      });
  }

  clearFieldsForModal() {
  }
}
