import {Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import {BscService} from '../bsc.service';
import {EmitterService} from '../../shared/emitter.service';
import {BscRestService} from '../../shared/rest.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';


@Component({
  selector: 'app-objectives',
  templateUrl: './objectives.component.html',
  styleUrls: ['./objectives.component.scss']
})
export class ObjectivesComponent implements OnInit, OnDestroy {
  codeAndName: any;
  orgName: any;
  balanceScoreCardData: any;
  codeName: any;
  PerspectivesByCode: any;
  perspectives: any;
  themes: any;
  perspectiveName: any;
  ChildObjectives: any;
  AllObjectives: any;
  codeAndNameSubsription: any;
  objectiveItems: any;
  reqObj: any;
  linkedObj: any;
  objCode: any;
  perspCode: any;
  linkObjectives: any = [];
  objectiveId: any;
  scCode: any;
  empMasterData: any;
  orgCode: any;
  fileName: any;
  fileAsBase64: any;
  errorMessage: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  @ViewChild('myInput') myInputVariable: ElementRef;

  reportingFrequency = [
    {id: 1, frequency: 'WEEKLY'},
    {id: 2, frequency: 'DAILY'},
    {id: 3, frequency: 'YEARLY'},
    {id: 3, frequency: 'MONTHLY'},
    {id: 3, frequency: 'QUARTERLY'},
    {id: 3, frequency: 'HOURLY'},
  ];

  constructor(private bscService: BscService,
              private bscRestService: BscRestService,
              private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  objectiveForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, this.customValidators.required],
    scName: [''],
    name: ['', this.customValidators.required],
    code: ['', this.customValidators.required],
    description: [''],
    perspectiveCode: [''],
    additionalFields: [[]],
    perspectiveName: [null],
    themeCode: [null],
    themeName: [null],
    reportingFrequency: [null],
    collaborators: [null],
    owner: [null],
    attachmentUrls: [''],
    analysis: [''],
    recommendations: [''],
    dependentItems: [[]],
    unmapped: [null],
    measureList: [null],
    fileName: [''],
    info1: [''],
    info2: [''],
    info3: [''],
    info4: ['']
  });

  ngOnInit() {
    this.getOrgUnitCode();
    this.getAllPerspectives();
    this.getBalanceScoreCard();
    this.getAllObjectives();
    this.getAllEmpMasterData();
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

  getAllEmpMasterData() {
    this.bscRestService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  getAllPerspectives() {
    this.bscRestService.getPerspective().subscribe((codes: any) => {
      this.perspectives = codes.data['Prespectives'];
    });
  }

  getThemesByScCode() {
    this.bscRestService.getThemeByCode(this.scCode).subscribe((theme: any) => {
      this.themes = theme.data['Themes'];
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.objectiveForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code.toUpperCase();
        this.objectiveForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.objectiveForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.scCode = val.code.toUpperCase();
        this.objectiveForm.controls.scName.setValue(this.codeName);
      }
    });
    this.getPerspectivesByCode();
    this.getThemesByScCode();
  }

  getPerspectivesByCode() {
    this.perspectiveWithObjective(this.scCode);
  }

  getThemeCode() {
    this.themes.forEach((val, key) => {
      if (this.objectiveForm.controls.themeName.value === val.name) {
        this.objectiveForm.controls.themeCode.setValue(val.code);
        this.objCode = this.objectiveForm.controls.code.value;
        this.objectiveForm.get('dependentItems').patchValue(['objective::' + `${this.objCode}`, 'theme::' + `${val.code}`]);
      }
    });
  }

  getAllObjectives() {
    this.bscRestService.getAllObjectives().subscribe((data: any) => {
      this.AllObjectives = data.data['Objectives'];
    });
  }

  getPerspectiveCode(event) {
    this.perspectiveName = event;
    this.objectiveForm.controls.perspectiveCode.setValue(this.perspCode);
    this.perspectives.forEach((val, key) => {
      if (this.objectiveForm.controls.perspectiveName.value === val.name) {
        this.objectiveForm.controls.perspectiveCode.setValue(val.code);
      }
    });
  }

  saveObjective() {
    if (!!this.objectiveId) {
      this.bscRestService.updateObjective(this.objectiveId, this.objectiveForm.value).subscribe((data: any) => {
        this.perspectiveWithObjective(this.objectiveForm.controls.scCode.value);
        this.objectiveForm.reset();
        this.objectiveForm.controls.perspectiveName.setValue(null);
        this.objectiveId = null;
        this.fileName = '';
        this.myInputVariable.nativeElement.value = '';
      });
    } else {
      this.bscRestService.saveObjective(this.objectiveForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.perspectiveWithObjective(this.objectiveForm.controls.scCode.value);
          this.objectiveForm.reset();
          this.fileName = '';
          this.myInputVariable.nativeElement.value = '';
          this.objectiveForm.controls.perspectiveName.setValue(null);
        }
      });
    }
  }

  perspectiveWithObjective(scCode: any) {
    this.bscRestService.perspectiveWithObjective(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.PerspectivesByCode = data.data['Prespectives'];
      }
    });
  }

  editObjective(item: any) {
    if (!!item) {
      this.objectiveForm.patchValue(item);
      this.fileName = item.fileName;
      this.objectiveId = item.id;
      this.objectiveForm.controls.measureList.setValue(item.measureList);
    }

  }

  // deleteObjective(item: any) {
  //   this.bscRestService.deleteObjective(item.id).subscribe((data: any) => {
  //     if (!!data) {
  //       this.perspectiveWithObjective(this.scCode);
  //     }
  //   });
  // }

  confirmDelete(item: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you really want to delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteObjective(item.id).subscribe((data) => {
            this.perspectiveWithObjective(this.scCode);
          });
        }
      });
  }


  clearFields() {
    this.objectiveForm.reset();
    this.fileName = '';
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
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileAsBase64 = reader.result;
        this.objectiveForm.controls['attachmentUrls'].setValue(this.fileAsBase64);
        this.objectiveForm.controls.fileName.setValue(this.fileName);
      };
    }
  }

  ngOnDestroy(): void {
  }

}
