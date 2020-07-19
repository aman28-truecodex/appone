import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';

@Component({
  selector: 'app-strategy-map-main',
  templateUrl: './strategy-map-main.component.html',
  styleUrls: ['./strategy-map-main.component.scss']
})
export class StrategyMapMainComponent implements OnInit {
  balanceScoreCardData: any;
  scCode: any;
  codeAndNameSubsription: any;
  codeAndName: any;
  orgName: any;
  initiativesList: any;
  perspectiveList: any;
  objScCode: any;
  objThemeCode: any;
  showImage: any = false;
  url: any;
  focusedElement: any;
  errorMessage: any;
  fileAsBase64: any;
  showPanel = false;

  strategyMapForm = this.formBuilder.group({
    scCode: [null, this.customValidators.required],
    scName: [''],
    orgCode: [null, this.customValidators.required],
    orgName: [''],
    strategyMapName: ['', this.customValidators.required],
    prespectiveList: [''],
    imageUrl: ['']
  });

  constructor(private bscRestService: BscRestService,
              private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {
    this.getBalanceScoreCard();
    this.getOrgUnitCode();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }

  getScCode(event) {
    this.scCode = event.target.value;
    this.balanceScoreCardData.forEach((elem) => {
      if (elem.code === this.scCode) {
        this.strategyMapForm.controls.scName.setValue(elem.name);
        this.strategyMapForm.controls.scCode.setValue(elem.code);
      }
    });
  }

  getStrategyMap() {
    if (!!this.scCode) {
      this.showImage = false;
      this.url = null;
      this.bscRestService.getInitiativesByScorecard(this.scCode).subscribe((data: any) => {
        if (data.status === '0') {
          this.showPanel = true;
          this.initiativesList = data.data['Initiative'];
        }
      });

      this.bscRestService.perspectiveWithObjective(this.scCode).subscribe((data: any) => {
        if (data.status === '0') {
          this.perspectiveList = data.data['Prespectives'];
          this.strategyMapForm.controls['prespectiveList'].setValue(this.perspectiveList);
          if (this.perspectiveList.length > 0) {
            this.perspectiveList.forEach((elem: any) => {
              if (elem['objectiveList'].length > 0) {
                elem['objectiveList'].forEach((theme: any) => {
                  const objScCode = theme.scCode;
                  const objThemeCode = theme.themeCode;
                });
              }
            });
          }
        }
      });
    }
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.strategyMapForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.strategyMapForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  showStrategyMapImage(event) {
    this.showImage = true;
    const reader = new FileReader();
    if (event.target.files[0].size >= 2097152) {
      this.errorMessage = 'File size should be less than 2 MB';
    } else {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileAsBase64 = reader.result;
        this.strategyMapForm.controls['imageUrl'].setValue(this.fileAsBase64);
      };
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

  shouldShowErrors(fieldName, formName) {
    if (this.focusedElement && this.focusedElement === fieldName) {
      return false;
    } else {
      return this.util.shouldShowErrors(fieldName, formName);
    }
  }

  saveStrategyMap() {
    if (this.strategyMapForm.valid) {
      this.bscRestService.saveStrategyMap(this.strategyMapForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.clearForm();
        }
      });
    }
  }

  clearForm() {
    this.strategyMapForm.reset();
    this.initiativesList = [];
    this.perspectiveList = [];
    this.fileAsBase64 = '';
  }
}
