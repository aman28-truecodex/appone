import {Component, OnInit, OnDestroy} from '@angular/core';
import {BscRestService} from '../../shared/rest.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {BscService} from '../bsc.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EmitterService} from '../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';


@Component({
  selector: 'app-perspective',
  templateUrl: './perspective.component.html',
  styleUrls: ['./perspective.component.scss']
})
export class PerspectiveComponent implements OnInit, OnDestroy {
  codeAndName: any;
  orgName: any;
  balanceScoreCardData: any;
  codeName: any;
  PerspectivesByCode: any = [];
  perspectiveId: any;
  isEmptyProject: any;
  orgCode: any;
  scCode: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  perspectiveForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    name: ['', [this.customValidators.required]],
    code: ['', [this.customValidators.required]],
    info1: [''],
    info2: [''],
    info3: [''],
    info4: [''],
  });
  showDefaultProjType;
  codeAndNameSubsription: any;

  constructor(private bscRestService: BscRestService,
              private bscService: BscService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private activatedRoute: ActivatedRoute,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.activatedRoute.queryParams.subscribe(params => {
      this.showDefaultProjType = params['defaultProjType'];
    });
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.perspectiveForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code.toUpperCase();
        this.perspectiveForm.controls.orgName.setValue(this.orgName);
      }
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

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.perspectiveForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.scCode = val.code.toUpperCase();
        this.perspectiveForm.controls.scName.setValue(this.codeName);
      }
    });
    this.getPerspectivesByCode();
  }

  getPerspectivesByCode() {
    this.bscRestService.getPerspectivesByCode(this.scCode).subscribe((data: any) => {
      if (data.status === '0' && data.data['Prespectives'].length > 0) {
        this.PerspectivesByCode = data.data['Prespectives'];
      } else {
        this.PerspectivesByCode = [];
      }
    });
  }


  savePerspective() {
    if (!!this.perspectiveId) {
      this.perspectiveForm.value.id = this.perspectiveId;
      this.bscRestService.updatePerspective(this.perspectiveForm.value, this.perspectiveId).subscribe((data: any) => {
        this.getPerspectivesByCode();
        this.perspectiveForm.reset();
        this.perspectiveId = null;
      });
    } else {
      this.bscRestService.savePerspective(this.perspectiveForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getPerspectivesByCode();
          this.perspectiveForm.reset();
        }
      }, error => {
        this.toastrService.error('Internal Server Error');
      });
    }
  }

  editPerspective(perspective: any) {
    this.perspectiveId = perspective.id;
    this.perspectiveForm.patchValue(perspective);
  }

  // deletePerspective(id: any) {
  //   if (!!this.scCode) {
  //     this.bscRestService.deletePerspective(id).subscribe((data: any) => {
  //       if (!!data) {
  //         this.getPerspectivesByCode();
  //       }
  //     }, error => {
  //       this.toastrService.error('Unable to Delete, Please try again later.');
  //     });
  //   }
  //
  // }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you really want to delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deletePerspective(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getPerspectivesByCode();
            }
          });
        }
      });
  }

  clearFields() {
    this.perspectiveForm.reset();
    this.perspectiveId = null;
  }

  ngOnDestroy(): void {
  }

}
