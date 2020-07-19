import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {CorporateStructure} from '../../entities/corporateStructure';
import {FormBuilder, Validators} from '@angular/forms';
import {AppService} from '../../shared/app.service';
import {BscRestService} from '../../shared/rest.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router, ActivatedRouteSnapshot} from '@angular/router';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';

@Component({
  selector: 'app-corporate-structure',
  templateUrl: './corporate-structure.component.html',
  styleUrls: ['./corporate-structure.component.scss']
})
export class CorporateStructureComponent implements OnInit, OnDestroy {
  mission = 'The Vision statetment and mission statement are often confused, ' +
    'and many companies use the terms interchangeably. However,' +
    ' they each have a different purpose';
  editMission = false;
  editVision = false;
  editValue = false;
  missiontxt: any;
  visiontxt: any;
  valuetxt: any;
  isOrgAvailable = false;
  updateCounter = 0;
  orgId: any;
  codeAndName;
  corporateStructure: CorporateStructure;
  organizationData: any;
  focusedElement;
  errorMessage: any;
  fileAsBase64: any;
  fileName: any;
  codeAndNameSubsription: any;
  empMasterData: any;
  managerName: any;
  tooltipInfo = TOOL_TIP_INFO;

  private route: ActivatedRouteSnapshot;
  @ViewChild('myInput') myInputVariable: ElementRef;


  unitCodes = [
    {name: 'Group Company', value: 'Group Company'},
    {name: 'Corporate Unit', value: 'Corporate Unit'},
    {name: 'Corporate Department', value: 'Corporate Department'},
    {name: 'Subsidiary', value: 'SBU'},
    {name: 'Subsidiary Department', value: 'SBU Department'}
  ];

  constructor(private formBuilder: FormBuilder,
              private bscRestService: BscRestService,
              private toastrService: ToastrService,
              private router: Router,
              private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private customValidators: CustomValidators,
              private util: Util,
              private emitterService: EmitterService) {
    this.corporateStructure = new CorporateStructure();
    $(document).ready(function(){
      $("#myModal").on('shown.bs.modal', function(){
          $(this).find('#customFileLang').focus();
      });
  });
    
  }

  corporateStructureForm = this.formBuilder.group({
    code: [null, [this.customValidators.required]],
    parentCode: ['', []],
    name: ['', [this.customValidators.required]],
    managerName: [null],
    employeeCount: ['', []],
    logoUrl: ['', []],
    logoName: ['', []],
    type: [null, [this.customValidators.required]],
    location: ['', []],
    head: ['', []],
    version: [null, []],
    missionStmt: ['', []],
    visionStmt: ['', []],
    valuesStmt: ['', []],
    fileName: [null]
  });

  ngOnInit() {
    this.missiontxt = this.corporateStructureForm.controls.missionStmt.value;
    this.visiontxt = this.corporateStructureForm.controls.visionStmt.value;
    this.valuetxt = this.corporateStructureForm.controls.valuesStmt.value;
    this.getCodeAndName();
    this.getAllEmpMasterData();
    this.activatedRoute.queryParams.subscribe(params => {
      this.orgId = params['id'];
      if (!!this.orgId) {
        this.getOrganizationById(this.orgId);
      } else {
        this.corporateStructureForm.reset();
        this.orgId = null;
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

  getAllEmpMasterData() {
    this.bscRestService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getJobTitle(event: any) {
    this.managerName = event.target.value;
    this.empMasterData.forEach((val, key) => {
      if (this.managerName.toUpperCase() === val.employeeName.toUpperCase()) {
        this.corporateStructureForm.controls.head.setValue(val.jobTitle);
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

  isButtonDisabled(formName) {
    return this.util.isButtonDisabled(formName);
  }

  getOrganizationById(id) {
    this.bscRestService.getOrganizationById(id).subscribe((organizationData: any) => {
      if (!!organizationData.data['Organisation']) {
        this.organizationData = organizationData.data['Organisation'];
        this.corporateStructureForm.patchValue(this.organizationData);
        this.fileName = this.organizationData.logoName;
        this.myInputVariable.nativeElement.value = this.organizationData.logoName;
        this.corporateStructureForm.controls.fileName.setValue(this.organizationData.logoName);
        this.corporateStructureForm.controls.logoName.setValue(this.organizationData.logoName);
        this.corporateStructureForm.controls.managerName.setValue(this.organizationData.managerName);
      }
    });
  }

  editMissionText() {
    this.editMission = true;
  }

  saveMissionText() {
    this.editMission = false;
    this.missiontxt = this.corporateStructureForm.controls.missionStmt.value;
  }

  editVisionText() {
    this.editVision = true;
  }

  saveVisionText() {
    this.editVision = false;
    this.visiontxt = this.corporateStructureForm.controls.visionStmt.value;
  }

  editValueText() {
    this.editValue = true;
  }

  saveValueText() {
    this.editValue = false;
    this.valuetxt = this.corporateStructureForm.controls.valuesStmt.value;
  }

  submitOrganization() {
    this.activatedRoute.queryParams.subscribe(params => {
      const param1 = params['id'];
      if (!!param1) {
        this.isOrgAvailable = true;
        this.bscRestService.UpdateOrganization(this.corporateStructureForm.value, this.orgId).subscribe((updatedOrg: any) => {
          this.retrieveOrgCodes();
          this.myInputVariable.nativeElement.value = '';
          this.fileName = null;
          this.activatedRoute.queryParams.subscribe(params => {
            params['id'] = null;
          });
          this.corporateStructureForm.reset();
        }, error => {
        });
      } else {
        this.bscRestService.saveOrganization(this.corporateStructureForm.value).subscribe((orgData: any) => {
          if (orgData.status === '0') {
            this.isOrgAvailable = true;
            this.orgId = orgData.data['Organisation'].id;
            this.retrieveOrgCodes();
            this.corporateStructureForm.reset();
            this.myInputVariable.nativeElement.value = '';
            this.fileName = null;
          }
        }, error => {
          this.toastrService.error('Failed to save, Please Try again later');
        });
      }
    });
  }

  retrieveOrgCodes() {
    this.bscRestService.getCodeAndName().subscribe((data: any) => {
      this.codeAndName = data.data['OrganisationList'];
      this.emitterService.broadcastOrgUnitCode(data.data['OrganisationList']);
    });
  }

  getCodeAndName() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }


  routeToSummaryView() {
    this.router.navigate(['/strategy/strategyPreview'], {queryParams: {id: this.orgId}});
  }

  clearFields() {
    this.orgId = undefined;
    this.corporateStructureForm.reset();
    this.fileName = null;
    this.myInputVariable.nativeElement.value = '';
  }

  uploadLogo(event: any) {
    const reader = new FileReader();
    this.fileName = event.target.files[0].name;
    if (event.target.files[0].size >= 2097152) {
      this.errorMessage = 'File size should be less than 2 MB';
      this.toastrService.error('File size should be less than 2 MB');
    } else {
      const file = event.target.files[0];
      this.fileName = event.target.files[0].name;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileAsBase64 = reader.result;
        this.corporateStructureForm.controls['logoUrl'].setValue(this.fileAsBase64);
        this.corporateStructureForm.controls.logoName.setValue(this.fileName);
        this.corporateStructureForm.controls.fileName.setValue(this.fileName);
      };
    }
  }
  ngOnDestroy(): void {
  }
  
}
