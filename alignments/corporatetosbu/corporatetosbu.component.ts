import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AlignmentService} from '../alignments.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {SimpleModalService} from 'ngx-simple-modal';

@Component({
  selector: 'app-corporatetosbu',
  templateUrl: './corporatetosbu.component.html',
  styleUrls: ['./corporatetosbu.component.scss']
})
export class CorporatetosbuComponent implements OnInit {
  codeAndNameSubscription: any;
  codeAndName: any;
  orgName: any;
  balanceScoreCardData: any;
  corporatetoSbuScCode;
  corporateScCode: any;
  linkType: any;
  elements: any;
  elemCode: any;
  subUnitCode: any;
  sbuElements: any;
  sbuOrgCode: any;
  sbuOrgName: any;
  alignmentList: any = [];
  subElemName: any;
  subElemCode: any;
  orgCode: any;
  controlArray1: any;
  sbuLinkTypeCode: any;
  corpScCode: any;
  sbuScName: any;
  alignmentId: any;
  subElemTwoName: any;

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

  corporateToSbuForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    orgType: ['CORPORATE_UNIT'],
    year: [null],
    version: [null],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    linkType: [null, [this.customValidators.required]],
    linkTypeCode: [null, this.customValidators.required],
    linkTypeName: [null, [this.customValidators.required]],
    linkTypeCname: [null],
    toOrgType: ['SBU_DEPAR'],
    toElements: this.formBuilder.array([this.sbuForm()])
  });

  get toElements(): FormArray {
    return this.corporateToSbuForm.get('toElements') as FormArray;
  }

  linkTypes = [{id: 1, type: 'Objectives'},
    {id: 2, type: 'Measures'},
    {id: 3, type: 'Initiative'},
    {id: 4, type: 'Action Items'}];

  sbuForm(): FormGroup {
    return this.formBuilder.group({
      orgCode: [null],
      orgName: [null],
      scName: [null],
      scCode: [null],
      linkType: [null],
      linkTypeCode: [null],
      linkTypeName: [null],
      linkTypeCname: [null],
      linkTypeCode1: [null],
      linkTypeName1: [null],
      reason: [null],
      reasontwo: [null]
    });
  }

  constructor(private toasterService: ToastrService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private alienmentService: AlignmentService,
              private customValidators: CustomValidators,
              private simpleModalService: SimpleModalService) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllAlignments();
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getBalanceScoreCard() {
    this.alienmentService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.corporateToSbuForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code;
        this.corporateToSbuForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getScCode(event) {
    this.corporatetoSbuScCode = event.target.value;
    this.balanceScoreCardData.forEach((elem) => {
      if (elem.code === this.corporatetoSbuScCode) {
        this.corporateToSbuForm.controls.scName.setValue(elem.name);
        this.corporateToSbuForm.controls.scCode.setValue(elem.code);
      }
    });
  }

  getElementCode(event: any) {
    this.elemCode = event.target.value;
    this.elements.forEach((val, key) => {
      if (this.elemCode === val.code) {
        this.corporateToSbuForm.controls.linkTypeName.setValue(val.name);
        this.corporateToSbuForm.controls.linkTypeCode.setValue(val.code);
      }
    });
  }

  getSubUnitCode(event: any) {
    this.subUnitCode = event.target.value;
    this.balanceScoreCardData.forEach((elem) => {
      if (elem.code === this.subUnitCode) {
        this.corpScCode = elem.code;
        this.sbuScName = elem.name;
      }
    });
    switch (this.linkType) {
      case 'Objectives':
        this.alienmentService.getObjectivesForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.sbuElements = [];
          } else {
            this.sbuElements = data.data['Objective'];
          }
        });
        break;
      case 'Measures':
        this.alienmentService.getMeasuresForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.sbuElements = null;
          } else {
            this.sbuElements = data.data['Measures'];
          }
        });
        break;
      case 'Initiative':
        this.alienmentService.getInitiativesForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.sbuElements = null;
          } else {
            this.sbuElements = data.data['Initiative'];
          }
        });
        break;
      case 'Action Items':
        this.alienmentService.getActionItemForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.sbuElements = null;
          } else {
            this.sbuElements = data.data['ActionItem'];
          }
        });
        break;
      default:
        console.log('def');
    }
  }

  getLinkType(event) {
    if (!!this.corporatetoSbuScCode) {
      this.linkType = event.target.value;

      switch (event.target.value) {
        case 'Objectives':
          this.alienmentService.getObjectivesForSc(this.corporatetoSbuScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.elements = [];
            } else {
              this.elements = data.data['Objective'];
            }
          });
          break;
        case 'Measures':
          this.alienmentService.getMeasuresForSc(this.corporatetoSbuScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.elements = null;
            } else {
              this.elements = data.data['Measures'];
            }
          });
          break;
        case 'Initiative':
          this.alienmentService.getInitiativesForSc(this.corporatetoSbuScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.elements = null;
            } else {
              this.elements = data.data['Initiative'];
            }
          });
          break;
        case 'Action Items':
          this.alienmentService.getActionItemForSc(this.corporatetoSbuScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.elements = null;
            } else {
              this.elements = data.data['ActionItem'];
            }
          });
          break;
        default:
          console.log('def');
      }
    }
  }

  getCodeAndNameForSbu() {
    this.corporateToSbuForm.controls['toElements'].value.forEach((val, key) => {
      this.sbuOrgCode = val.orgCode;
    });
    this.codeAndName.forEach((val, key) => {
      if (this.sbuOrgCode === val.code) {
        this.sbuOrgName = val.name.toUpperCase();
        this.toElements.patchValue([{orgName: this.sbuOrgName}]);
      }
    });
  }

  getAllAlignments() {
    this.alienmentService.getSbuAlignment('CORPORATE_DEPARTMENT', 'SBU').subscribe((data: any) => {
      if (data.status === '0') {
        this.alignmentList = data.data['Alignment'];
      }
    });
  }

  getSubElementCode(event: any) {
    this.sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (this.sbuLinkTypeCode === val.code) {
        this.subElemName = val.name;
        this.subElemCode = val.code;
        this.controlArray1 = <FormArray>this.corporateToSbuForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode = this.subElemCode;
        this.controlArray1.value[0].linkTypeName = this.subElemName;
      }
    });
  }


  getSubElementTwoName(event: any) {
    const sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (sbuLinkTypeCode === val.code) {
        this.subElemTwoName = val.name;
        const subElemCode = val.code;
        this.controlArray1 = <FormArray>this.corporateToSbuForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode1 = subElemCode;
        this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
      }
    });
  }

  addAlignmentLink() {
    this.controlArray1 = <FormArray>this.corporateToSbuForm.get('toElements');
    this.controlArray1.value[0].linkType = this.linkType;
    this.controlArray1.value[0].scName = this.sbuScName;
    this.controlArray1.value[0].scCode = this.corpScCode;
    this.controlArray1.value[0].linkTypeName = this.subElemName;
    this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
    this.corporateToSbuForm.controls.orgType.setValue('CORPORATE_DEPARTMENT');
    this.corporateToSbuForm.controls.toOrgType.setValue('SBU');
    this.corporateToSbuForm.get('toElements').patchValue(this.controlArray1.value);
    if (!!this.alignmentId) {
      this.alienmentService.updateAlignment(this.corporateToSbuForm.value, this.alignmentId).subscribe((data: any) => {
        if (data.status === '0') {
          this.alignmentId = null;
          this.getAllAlignments();
          this.corporateToSbuForm.reset();
          this.corporateToSbuForm.controls.linkTypeName.setValue(null);
        }
      });
    } else {
      this.alienmentService.saveAlignment(this.corporateToSbuForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.alignmentList.push(data.data['Alignment']);
          this.alignmentId = null;
          this.getAllAlignments();
          this.corporateToSbuForm.reset();
          this.corporateToSbuForm.controls.linkTypeName.setValue(null);
        }
      }, error => {
        this.toastrService.error('Error Occured While linking, try again later');
      });
    }

  }

  showConfirm(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Confirmation',
      message: 'Are you sure'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.alienmentService.deleteAlignment(id).subscribe((data: any) => {
            if (!!data) {
              this.getAllAlignments();
            }
          }, error => {
            this.toastrService.error('Error Occured While unlinking');
          });
        }
      });
  }

  edit(item) {
    this.corporateToSbuForm.patchValue(item);
    this.linkType = item.linkType;
    this.alignmentId = item.id;
  }

  clearFields() {
    this.corporateToSbuForm.reset();
  }

}
