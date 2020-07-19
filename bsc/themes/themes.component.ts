import {Component, OnInit} from '@angular/core';
import {BscService} from '../bsc.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {InitiativeService} from '../../initiatives/initiative.service';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {Util} from '../../shared/utils/util';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent implements OnInit {
  codeAndName: any;
  orgName: any;
  codeName: any;
  balanceScoreCardData: any;
  themeByScCode = [];
  themeId;
  AllObjectives: any = [];
  objCode: any;
  orgCode: any;
  scCode: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  constructor(private bscService: BscService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private bscRestService: BscRestService,
              private initiativeService: InitiativeService,
              private customValidators: CustomValidators,
              private util: Util,
              private simpleModalService: SimpleModalService) {
  }

  themeForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, this.customValidators.required],
    scName: [''],
    name: ['', [this.customValidators.required]],
    code: ['', [this.customValidators.required]],
    additionalFields: [[]],
    info1: [''],
    info2: [''],
    info3: [''],
    info4: [''],
  });

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllObjectives();
  }

  getOrgUnitCode() {
    this.bscRestService.getCodeAndName().subscribe((codes: any) => {
      this.codeAndName = codes.data['OrganisationList'];
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.themeForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code.toUpperCase();
        this.themeForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
      // this.getBscCodeAndName(this.balanceScoreCardData);
    });
  }

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.themeForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.scCode = val.code.toUpperCase();
        this.themeForm.controls.scName.setValue(this.codeName);
      }
    });
    this.getThemeByCode();
  }

  getThemeByCode() {
    this.bscRestService.getThemeByCode(this.scCode).subscribe((data: any) => {
      if (data.status === '0' && data.data['Themes'].length > 0) {
        this.themeByScCode = data.data['Themes'];
      } else {
        this.themeByScCode = [];
      }
    });
  }

  saveTheme() {
    if (!!this.themeId) {
      this.themeForm.value.id = this.themeId;
      this.bscRestService.updateTheme(this.themeForm.value, this.themeId).subscribe((data: any) => {
        this.getThemeByCode();
        this.themeForm.reset();
        this.themeId = null;
      });
    } else {
      this.bscRestService.saveScoreCardTheme(this.themeForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getThemeByCode();
          this.themeForm.reset();
        }
      });
    }
  }

  editTheme(theme: any) {
    this.themeId = theme.id;
    this.themeForm.patchValue(theme);
  }

  // deleteTheme(id: any) {
  //   this.bscService.deleteTheme(id).subscribe((data: any) => {
  //     if (data) {
  //       this.getThemeByCode();
  //     } else {
  //       this.toastrService.error('unable to delete themes');
  //     }
  //   }, error => {
  //     this.toastrService.error('Internal server error');
  //   });
  // }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you really want to delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteTheme(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getThemeByCode();
            }
          });
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

  getAllObjectives() {
    this.initiativeService.getAllObjectives().subscribe((data: any) => {
      this.AllObjectives = data.data['Objectives'];
    });
  }

  clearFields() {
    this.themeForm.reset();
    this.themeId = null;
  }

  //
  // getObj(event: any) {
  //   this.objCode = event.target.value;
  //   this.themeForm.get('dependentItems').patchValue([`objective::${this.objCode}`, `theme::${this.themeForm.controls.code.value}`]);
  // }

}
