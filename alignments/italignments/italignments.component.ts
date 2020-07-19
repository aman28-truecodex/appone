import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AlignmentService} from '../alignments.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';


@Component({
  selector: 'app-italignments',
  templateUrl: './italignments.component.html',
  styleUrls: ['./italignments.component.scss']
})
export class ItalignmentsComponent implements OnInit {
  codeAndNameSubscription: any;
  codeAndName: any;
  orgName: any;
  balanceScoreCardData: any;
  fields: any;
  subElemTwoName: any;
  sbuOrgName: any;
  sbuOrgCode: any;
  corporateScCode: any;
  elements: any;
  linkType: any = 'Objectives';
  alignmentList: any = [];
  corpScCode: any;
  subUnitCode: any;
  sbuScName: any;
  sbuElements: any;
  elemCode: any;
  sbuLinkTypeCode: any;
  subElemName: any;
  subElemCode: any;
  controlArray1: any;
  orgCode: any;

  itAlignmentForm = this.formBuilder.group({
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
    toOrgType: ['SBU'],
    linkTypeCname: [null],
    toElements: this.formBuilder.array([this.sbuForm()])
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

  get toElements(): FormArray {
    return this.itAlignmentForm.get('toElements') as FormArray;
  }

  get employees(): FormArray {
    return this.itAlignmentForm.get('toElements') as FormArray;
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.itAlignmentForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code;
        this.itAlignmentForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getCodeAndNameForSbu() {
    this.itAlignmentForm.controls['toElements'].value.forEach((val, key) => {
      this.sbuOrgCode = val.orgCode;
    });
    this.codeAndName.forEach((val, key) => {
      if (this.sbuOrgCode === val.code) {
        this.sbuOrgName = val.name.toUpperCase();
        this.toElements.patchValue([{orgName: this.sbuOrgName}]);
      }
    });
  }

  getScCode(event: any) {
    this.corporateScCode = event.target.value;
    this.balanceScoreCardData.forEach((elem) => {
      if (elem.code === this.corporateScCode) {
        this.corpScCode = elem.name;
        this.itAlignmentForm.controls.scName.setValue(elem.name);
        this.itAlignmentForm.controls.scCode.setValue(elem.code);
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
      this.itAlignmentForm.controls.linkType.setValue(this.linkType);
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
        this.itAlignmentForm.controls.linkTypeName.setValue(val.name);
        this.itAlignmentForm.controls.linkTypeCode.setValue(val.code);
      }
    });
  }

  getSubElementCode(event: any) {
    this.sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (this.sbuLinkTypeCode === val.code) {
        this.subElemName = val.name;
        this.subElemCode = val.code;
        this.controlArray1 = <FormArray>this.itAlignmentForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode = this.subElemCode;
        this.controlArray1.value[0].linkTypeName = this.subElemName;
      }
    });
  }

  getBalanceScoreCard() {
    this.alienmentService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getAllAlignments() {
    this.alienmentService.getSbuAlignment('CORPORATE_DEPARTMENT', 'SBU').subscribe((data: any) => {
      if (data.status === "0") {
        this.alignmentList = data.data['Alignment'];
      }
    });
  }


  getSubElementTwoName(event: any) {
    const sbuLinkTypeCode = event.target.value;
    this.sbuElements.forEach((val, key) => {
      if (sbuLinkTypeCode === val.code) {
        this.subElemTwoName = val.name;
        const subElemCode = val.code;
        this.controlArray1 = <FormArray>this.itAlignmentForm.get('toElements');
        this.controlArray1.value[0].linkTypeCode1 = subElemCode;
        this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
      }
    });
  }

  addAlignmentLink() {
    this.controlArray1 = <FormArray>this.itAlignmentForm.get('toElements');
    this.controlArray1.value[0].linkType = this.linkType;
    this.controlArray1.value[0].scName = this.sbuScName;
    this.controlArray1.value[0].scCode = this.corpScCode;
    this.controlArray1.value[0].linkTypeName = this.subElemName;
    this.controlArray1.value[0].linkTypeName1 = this.subElemTwoName;
    this.itAlignmentForm.controls.orgType.setValue('CORPORATE_DEPARTMENT');
    this.itAlignmentForm.controls.toOrgType.setValue('SBU');
    this.itAlignmentForm.get('toElements').patchValue(this.controlArray1.value);
    this.alienmentService.saveAlignment(this.itAlignmentForm.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.getAllAlignments();
        this.itAlignmentForm.reset();
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
    this.itAlignmentForm.patchValue(item);
  }

  clearFields() {
    this.itAlignmentForm.reset();
  }

}
