import { Component, OnInit } from '@angular/core';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {FormBuilder, Validators} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {BscService} from '../../bsc/bsc.service';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {Util} from '../../shared/utils/util';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';

@Component({
  selector: 'app-industry-kpi',
  templateUrl: './industry-kpi.component.html',
  styleUrls: ['./industry-kpi.component.scss']
})
export class IndustryKpiComponent implements OnInit {
  orgName: any;
  codeAndNameSubsription: any;
  codeAndName: any;
  kpiMaters = [];
  kpiId: any;
  fileName: any;
  fileAsBase64: any;
  errorMessage: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  polarity = [
    {id: 1, polarity: 'HIGH'},
    {id: 2, polarity: 'LOW'},
    {id: 3, polarity: 'EQUAL'},
    {id: 4, polarity: 'OTHERS'}
  ];

  kpiMaterForm = this.formBuilder.group({
    orgCode: [''],
    orgName: [''],
    description: [''],
    owner: [''],
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
    additionalFields: [[]],
    collaborators: [''],
    formula: [''],
    dataSource: [''],
    dataCollector: [''],
    dataQuality: [''],
    frequency: [null],
    leadOrLag: [''],
    polarity: [null, [Validators.required]],
    attachmentUrls: [''],
    strategy: [''],
    fileName: ['']
  });

  reportingFrequency = [
    {id: 1, frequency: 'WEEKLY'},
    {id: 2, frequency: 'DAILY'},
    {id: 3, frequency: 'YEARLY'},
    {id: 3, frequency: 'MONTHLY'},
    {id: 3, frequency: 'QUARTERLY'},
    {id: 3, frequency: 'HOURLY'},
  ];

  constructor(private bscRestService: BscRestService,
              private bscService: BscService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getAllKPIMaster();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
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

  editKPI(item: any) {
    this.kpiId = item.id;
    this.kpiMaterForm.patchValue(item);
    this.fileName = item.fileName;
  }

  saveKpiMater() {
    if (!!this.kpiId) {
      this.bscRestService.updateKPIMaster(this.kpiId, this.kpiMaterForm.value).subscribe((data: any) => {
        if (!!data) {
          this.kpiId = null;
          this.getAllKPIMaster();
          this.fileName = null;
          this.kpiMaterForm.reset();
        }
      });
    } else {
      this.bscRestService.saveKpiMaster(this.kpiMaterForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.kpiMaters.push(data.data['KPIMaster']);
          this.fileName = null;
          this.kpiMaterForm.reset();
        }
      });
    }
  }

  getAllKPIMaster() {
    this.bscRestService.getKPIMaster().subscribe((data: any) => {
      if (data.status === '0') {
        this.kpiMaters = data.data['KPIMaster'];
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
        this.kpiMaterForm.controls['attachmentUrls'].setValue(this.fileAsBase64);
        this.kpiMaterForm.controls.fileName.setValue(this.fileName);
      };
    }
  }

  showConfirm(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Confirmation',
      message: 'Are you sure'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteKPIMaster(id).subscribe((data) => {
            this.getAllKPIMaster();
          });
        }
      });
  }

  clearFields() {
    this.kpiMaterForm.reset();
    this.fileName = null;
    this.kpiId = null;
  }


}
