import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AlignmentService} from '../alignments.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';

@Component({
  selector: 'app-hralignments',
  templateUrl: './hralignments.component.html',
  styleUrls: ['./hralignments.component.scss']
})
export class HralignmentsComponent implements OnInit {
  codeAndNameSubscription: any;
  codeAndName: any;
  orgName: any;
  corporatetoBoardScCode: any;
  balanceScoreCardData: any;
  alignmentList: any = [];
  linkType: any = 'Select link type';
  sbuOrgCode: any;
  sbuOrgName: any;
  corporateScCode: any;
  corpScCode: any;
  subUnitCode: any;
  sbuElements: any;
  sbuScName: any;
  elements: any = [];
  elemCode: any;
  subElemName: any;
  subElemCode: any;
  controlArray1: any;
  sbuLinkTypeCode: any;
  orgCode: any;
  subElemTwoName: any;

  constructor(private toasterService: ToastrService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private alienmentService: AlignmentService,
              private customValidators: CustomValidators,
              private simpleModalService: SimpleModalService) {
  }


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

  versions = [{id: 1, version: 'v1'},
    {id: 2, version: 'v2'},
    {id: 3, version: 'v3'},
    {id: 4, version: 'v4'},
    {id: 5, version: 'v5'},
  ];

  linkTypes = [{id: 1, type: 'Objectives'},
    {id: 2, type: 'Measures'},
    {id: 3, type: 'Initiative'},
    {id: 4, type: 'Action Items'}];

  hrAlignmentForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    orgType: ['CORPORATE_DEPARTMENT'],
    year: [null],
    version: [null],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    linkType: [null, [this.customValidators.required]],
    linkTypeCode: ['', [this.customValidators.required]],
    linkTypeName: [null],
    linkTypeCname: [null],
    toOrgType: ['SBU'],
    toElements: this.formBuilder.array([this.sbuForm()])
  });

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

  ngOnInit() {
    this.getOrgUnitCode();
    this.getAllAlignments();
    this.getBalanceScoreCard();
  }

  get toElements(): FormArray {
    return this.hrAlignmentForm.get('toElements') as FormArray;
  }

  get employees(): FormArray {
    return this.hrAlignmentForm.get('toElements') as FormArray;
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.hrAlignmentForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code;
        this.hrAlignmentForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getCodeAndNameForSbu() {
    this.hrAlignmentForm.controls['toElements'].value.forEach((val, key) => {
      this.sbuOrgCode = val.orgCode;
    });
    this.codeAndName.forEach((val, key) => {
      if (this.sbuOrgCode === val.code) {
        this.sbuOrgName = val.name.toUpperCase();
        this.toElements.patchValue([{orgName: this.sbuOrgName}]);
      }
    });
  }


  getBalanceScoreCard() {
    this.alienmentService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }


  getScCode(event: any) {
    this.corporateScCode = event.target.value;
    this.balanceScoreCardData.forEach((elem) => {
      if (elem.code === this.corporateScCode) {
        this.corpScCode = elem.name;
        this.hrAlignmentForm.controls.scName.setValue(elem.name);
        this.hrAlignmentForm.controls.scCode.setValue(elem.code);
      }
    });
  }

  getSubUnitCode(event?: any) {
    this.subUnitCode = event.target.value;
    this.balanceScoreCardData.forEach((elem: any) => {
      if (elem.code === this.subUnitCode) {
        this.corpScCode = elem.code;
        this.sbuScName = elem.name;
      }
    });
    switch (this.linkType) {
      case 'Objectives':
        this.alienmentService.getObjectivesForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
            this.sbuElements = [];
          } else {
            this.sbuElements = data.data['Objective'];
          }
        });
        break;
      case 'Measures':
        this.alienmentService.getMeasuresForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
            this.sbuElements = null;
          } else {
            this.sbuElements = data.data['Measures'];
          }
        });
        break;
      case 'Initiative':
        this.alienmentService.getInitiativesForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
            this.sbuElements = null;
          } else {
            this.sbuElements = data.data['Initiative'];
          }
        });
        break;
      case 'Action Items':
        this.alienmentService.getActionItemForSc(this.subUnitCode).subscribe((data: any) => {
          if (data.status === '1') {
            this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
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
    if (!!this.corporateScCode) {
      this.linkType = event.target.value;
      this.hrAlignmentForm.controls.linkType.setValue(this.linkType);
      switch (event.target.value) {
        case 'Objectives':
          this.alienmentService.getObjectivesForSc(this.corporateScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
              this.elements = [];
            } else {
              this.elements = data.data['Objective'];
            }
          });
          break;
        case 'Measures':
          this.alienmentService.getMeasuresForSc(this.corporateScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
              this.elements = null;
            } else {
              this.elements = data.data['Measures'];
            }
          });
          break;
        case 'Initiative':
          this.alienmentService.getInitiativesForSc(this.corporateScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
              this.elements = null;
            } else {
              this.elements = data.data['Initiative'];
            }
          });
          break;
        case 'Action Items':
          this.alienmentService.getActionItemForSc(this.corporateScCode).subscribe((data: any) => {
            if (data.status === '1') {
              this.toastrService.error('No Elements found for type' + ' ' + this.linkType);
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

  getElementCode(event: any) {
    this.elemCode = event.target.value;
    this.elements.forEach((val, key) => {
      if (this.elemCode === val.code) {
        this.hrAlignmentForm.controls.linkTypeName.setValue(val.name);
        this.hrAlignmentForm.controls.linkTypeCode.setValue(val.code);
      }
    });
  }

  getSubElementTwoName(event: any) {
    const sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (sbuLinkTypeCode === val.code) {
        this.subElemTwoName = val.name;
        const subElemCode = val.code;
        this.controlArray1 = <FormArray>this.hrAlignmentForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode1 = subElemCode;
        this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
      }
    });
  }

  getSubElementCode(event: any) {
    this.sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (this.sbuLinkTypeCode === val.code) {
        this.subElemName = val.name;
        this.subElemCode = val.code;
        this.controlArray1 = <FormArray>this.hrAlignmentForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode = this.subElemCode;
        this.controlArray1.value[0].linkTypeName = this.subElemName;
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

  addAlignmentLink() {
    this.controlArray1 = <FormArray>this.hrAlignmentForm.get('toElements');
    this.controlArray1.value[0].linkType = this.linkType;
    this.controlArray1.value[0].scName = this.sbuScName;
    this.controlArray1.value[0].scCode = this.corpScCode;
    this.controlArray1.value[0].linkTypeName = this.subElemName;
    this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
    this.hrAlignmentForm.controls.orgType.setValue('CORPORATE_DEPARTMENT');
    this.hrAlignmentForm.controls.toOrgType.setValue('SBU');
    this.hrAlignmentForm.get('toElements').patchValue(this.controlArray1.value);
    this.alienmentService.saveAlignment(this.hrAlignmentForm.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.getAllAlignments();
        this.hrAlignmentForm.reset();
      }
    }, error => {
      this.toastrService.error('Error Occured While Linking, try again later');
    });
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
    this.hrAlignmentForm.patchValue(item);
  }

  clearFields() {
    this.hrAlignmentForm.reset();
  }

}
