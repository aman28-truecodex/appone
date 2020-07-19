import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmitterService} from '../../shared/emitter.service';
import {RiskAssessmentService} from './../riskAssessment.service';
import {ToastrService} from 'ngx-toastr';
import {SimpleModalService} from 'ngx-simple-modal';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';

@Component({
  selector: 'app-riskassessment',
  templateUrl: './riskassessment.component.html',
  styleUrls: ['./riskassessment.component.scss']
})
export class RiskassessmentComponent implements OnInit {
  riskAssessmentForm: FormGroup;
  codeAndNameSubsription: any;
  codeAndName: any;
  orgName: any;
  riskAssessmentTableDataSource: any = [];
  riskAssessmentId: any;
  emptyTableDataMesg: any;
  empMasterData: any;
  empDesignation: any;
  Filter = '';

  constructor(private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private riskAssessmentService: RiskAssessmentService,
              private toastrService: ToastrService,
              private simpleModalService: SimpleModalService,
              private customValidators: CustomValidators) {
  }

  ngOnInit() {
    this.riskAssessmentForm = this.formBuilder.group({
      riskId: ['', this.customValidators.required],
      riskName: ['', this.customValidators.required],
      orgCode: [null, []],
      orgName: [''],
      description: [''],
      details: this.formBuilder.array([this.createItem()])
    });

    this.getOrgUnitCode();
    this.getAllRiskAssessment();
    this.getAllEmpMasterData();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      objectiveCode: '',
      objectiveName: '',
      outcomes: '',
      riskIndicators: '',
      likelihood: '',
      consequence: '',
      managementControl: '',
      accountableManager: [null],
      accountableManagerDesignation: ''
    });
  }

  get toElements(): FormArray {
    return this.riskAssessmentForm.get('details') as FormArray;
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.riskAssessmentForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.riskAssessmentForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getAllRiskAssessment() {
    this.riskAssessmentService.getRiskAssessment().subscribe((data: any) => {
      if(data.status === '0' && data.data['RiskAssessmentList'].length > 0) {
        this.riskAssessmentTableDataSource = data.data['RiskAssessmentList'];
      } else {
        this.riskAssessmentTableDataSource = [];
      }
    });
  }

  saveRiskAssessment() {
    if (!!this.riskAssessmentId) {
      this.riskAssessmentService.UpdateRiskAssessment(this.riskAssessmentForm.value, this.riskAssessmentId).subscribe((data: any) => {
        if (data.status === '0') {
          this.getAllRiskAssessment();
          this.riskAssessmentForm.reset();
          this.riskAssessmentId = null;
        }
      });
    } else {
      this.riskAssessmentService.saveRiskAssessment(this.riskAssessmentForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getAllRiskAssessment();
          this.riskAssessmentForm.reset();
        }
      });
    }
  }

  editRiskAssessment(item: any) {
    if (!!item) {
      this.riskAssessmentId = item.id;
      this.riskAssessmentForm.patchValue(item);
    }
  }

  showConfirm(item: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Confirmation',
      message: 'Are you sure'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.riskAssessmentService.deleteRiskAssessment(item.id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getAllRiskAssessment();
            }
          });
        }
      });
  }

  getAllEmpMasterData() {
    this.riskAssessmentService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getEmpDesignation(event: any) {
    this.empMasterData.forEach((val, key) => {
      if (this.riskAssessmentForm.get('details').value[0].accountableManager === val.employeeName) {
        this.empDesignation = val.jobTitle.toUpperCase();
        this.toElements.patchValue([{accountableManagerDesignation: this.empDesignation}]);
      }
    });
  }

  clearFields() {
    this.riskAssessmentForm.reset();
    this.riskAssessmentId = null;
  }

}
