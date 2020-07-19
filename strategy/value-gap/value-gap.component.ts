import {Component, OnInit} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {EmitterService} from '../../shared/emitter.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ExcelService} from '../../shared/excel.service';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';

@Component({
  selector: 'app-value-gap',
  templateUrl: './value-gap.component.html',
  styleUrls: ['./value-gap.component.scss']
})
export class ValueGapComponent implements OnInit {
  valueGapForm: FormGroup;
  codeAndName: any;
  orgName: any;
  valueGapTableData: any = [];
  reqObj: any;
  unitOfMeasure: any;
  prdGrp: any;
  revenueAmt: any;
  codeAndNameSubsription: any;
  data: any;
  Filter: any = '';
  focusedElement: any;
  tooltipInfo = TOOL_TIP_INFO;
  valueGapExcelData: any;

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
  valueGapId: any;
  currencyUnit = [
    {id: 1, type: 'USD'},
    {id: 1, type: 'GBP'},
    {id: 1, type: 'INR'},
  ];

  createform() {
    const arr = [];
    for (let i = 0; i < this.AllYearsData.length; i++) {
      arr.push(this.BuildFormDynamic(this.AllYearsData[i]));

    }

    this.valueGapForm = this.formBuilder.group({
      orgCode: [null, [this.customValidators.required]],
      orgName: [''],
      region: ['', [this.customValidators.required]],
      currencyType: [null, []],
      productGroupName: [null, [this.customValidators.required]],
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
      revenueGap: [''],
      revenueAmount: ['']
    });
  }


  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private emitterService: EmitterService,
              private excelService: ExcelService,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  ngOnInit() {
    this.createform();
    this.getOrgUnitCode();
    this.getValueGap();
    this.getProductGrp();
    this.getValueGapExcelData();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.valueGapForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.valueGapForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getValueGapExcelData() {
    this.bscRestService.getValueGapExcelData().subscribe((data: any) => {
      this.valueGapExcelData = data.data['ValueGapList'];
    });
  }

  getCodeNameForPestal() {
    this.codeAndName.forEach((val, key) => {
      if (this.valueGapForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.valueGapForm.controls.orgName.setValue(this.orgName);
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

  saveValueGap() {
    if (!!this.valueGapId) {
      this.valueGapForm.value.values.forEach((ele, i) => {
        ele.yearRef = this.AllYearsData[i].yearRef;
      });
      this.valueGapForm.value.values.map((ele) => {
        ele.year = Number(this.valueGapForm.value.year) + Number(ele.yearTerm);
        delete ele.yearTerm;
      });
      this.bscRestService.updateValueGap(this.valueGapForm.value, this.valueGapId).subscribe((data: any) => {
        this.getValueGap();
        this.getValueGapExcelData();
        this.valueGapForm.reset();
        this.valueGapId = null;
      });
    } else {
      this.valueGapForm.value.values.forEach((ele, i) => {
        ele.yearRef = this.AllYearsData[i].yearRef;
      });
      this.valueGapForm.value.values.map((ele) => {
        ele.year = Number(this.valueGapForm.value.year) + Number(ele.yearTerm);
        delete ele.yearTerm;
      });
      this.bscRestService.saveValueGap(this.valueGapForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getValueGap();
          this.getValueGapExcelData();
          this.valueGapForm.reset();
          this.valueGapId = data.data['ValueGapList'].id;
        }
      });
    }
  }

  getValueGap() {
    this.bscRestService.getValueGap().subscribe((data: any) => {
      if (data.status === '0') {
        this.valueGapTableData = data.data['ValueGapList'];
        const object = this.valueGapTableData.reduce(
          (obj, item) => Object.assign(obj, {[item.yearRef]: item.year}), {});
      }
    });
  }

  editValueGap(data: any, index) {
    this.valueGapForm.patchValue(data[index]);
    this.valueGapId = data[index].id;
  }

  getRevenueAmt() {
    this.reqObj = this.valueGapForm.value;
    if (!!this.valueGapForm.controls.orgCode.value && !!this.valueGapForm.controls.version.value && !!this.valueGapForm.controls.productGroupName.value && !!this.valueGapForm.controls.year.value) {
      this.bscRestService.getRevenueAmount(this.reqObj.orgCode, this.reqObj.productGroupName, this.reqObj.year, this.reqObj.version).subscribe((data: any) => {
        if (data.status === '0') {
          this.revenueAmt = data.data['StrategicProjection'];
          if (this.revenueAmt.length > 0) {
            this.revenueAmt.forEach((val, index) => {
              this.valueGapForm.controls.values['controls'][index].controls.revenueAmount.setValue(val.revenueAmount);
            });
          } else {
            this.valueGapForm.controls['values'].reset();
          }
        }
      });
    }
  }

  getProductGrp() {
    this.bscRestService.getAllProductGroup().subscribe((data: any) => {
      if (data.status === '0') {
        this.prdGrp = data.data['ProductGroup'];
      }
    });
  }

  getProductUnitOfMeasure() {
    this.prdGrp.forEach((val, key) => {
      if (this.valueGapForm.controls.productGroupName.value === val.name) {
        this.unitOfMeasure = val.unitOfMeasure.toUpperCase();
        this.valueGapForm.controls.productGroupUnitOfMeasure.setValue(this.unitOfMeasure);
      }
    });
  }

  clear() {
    this.valueGapForm.reset();
    this.valueGapId = null;
  }

  exportAsExcel() {
    this.excelService.exportAsExcelFile(this.valueGapExcelData, 'Value Gap');
  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Confirmation',
      message: 'Are you sure'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteValueGap(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getValueGap();
            }
          });
        }
      });
  }

}
