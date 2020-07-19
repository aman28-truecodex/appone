import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BscRestService} from '../../../shared/rest.service';
import {StrategyAnalysisService} from '../strategy-analysis.service';
import {EmitterService} from '../../../shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import * as $ from 'jquery';
import {CustomValidators} from '../../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../../constants/tooltipInfoConstants';
import {Util} from '../../../shared/utils/util';


@Component({
  selector: 'app-porterfiveforce',
  templateUrl: './porterfiveforce.component.html',
  styleUrls: ['./porterfiveforce.component.scss']
})
export class PorterfiveforceComponent implements OnInit, OnDestroy {

  codeAndName: any;
  orgName: any;
  reqObj: any;
  supplierPower: any = [];
  buyerPower: any = [];
  competativeRivalry: any = [];
  threatsofSubstitution: any = [];
  threatsofnewentry: any = [];
  threatsofnewentrys: any = [];
  portersType: any = 'Supplier Power';
  portersId: any;
  index: any;
  codeAndNameSubsription: any;
  selectedIndex = 0;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

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
  portersFiveAnalysis = [
    {id: 1, name: 'Supplier Power'},
    {id: 2, name: 'Buyer Power'},
    {id: 3, name: 'Competative Rivalry'},
    {id: 4, name: 'Threats of Substitution'},
    {id: 6, name: 'Threats of new entry'}
  ];

  portersAnalysisFrom = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    description: [''],
    version: [null, [this.customValidators.required]],
    details: [''],
    info1: [''],
    info2: [''],
    info3: [''],
    info4: [''],
    year: [null, [this.customValidators.required]],
    type: ['']
  });

  constructor(private formBuilder: FormBuilder,
              private bscRestService: BscRestService,
              private strategyAnalysisService: StrategyAnalysisService,
              private emitterService: EmitterService,
              private toasterService: ToastrService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {
    $('#angleup1').click(function () {
      $(this).find('span.fa').toggleClass('fa fa-angle-up fa fa-angle-down');
     if($(this).hasClass('fa fa-angle-up')){
        $(this).removeClass('fa fa-angle-up');
        $(this).addClass('fa fa-angle-down');
      }
      else if($(this).hasClass('fa fa-angle-down')){
          $(this).removeClass('fa fa-angle-down');
          $(this).addClass('fa fa-angle-up');
      }
      
    });
    /* jQuery(function ($) {
      // Add minus icon for collapse element which is open by default
      $('.collapse.show').each(function () {
        $(this).prev('.criteriaTitle,.strategryAnalysisTitle').find('.fa').addClass('fa-angle-up').removeClass('fa-angle-down');
      });

      // Toggle plus minus icon on show hide of collapse element
      $('.collapse').on('show.bs.collapse', function () {
        $(this).prev('.criteriaTitle,.strategryAnalysisTitle').find('.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
      }).on('hide.bs.collapse', function () {
        $(this).prev('.criteriaTitle,.strategryAnalysisTitle').find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
      });
    });
 */
    this.getOrgUnitCode();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
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

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.portersAnalysisFrom.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.portersAnalysisFrom.controls.orgName.setValue(this.orgName);
        if (this.portersAnalysisFrom.controls.version.value !== '' && this.portersAnalysisFrom.controls.year.value !== '') {
          this.getPosterAnalysis('SWOT');
        }
      }
    });
  }

  getPosterAnalysis(type: any) {
    this.reqObj = this.portersAnalysisFrom.value;
    if (!!this.reqObj.orgCode && !!this.reqObj.year && !!this.reqObj.version) {
      this.bscRestService.getStretegyAnalysis(this.reqObj.orgCode, this.reqObj.year, this.reqObj.version, type)
        .subscribe((data: any) => {
          if (data.status === '0' && !!data.data['StrategyAnalysis'].id) {
            this.portersId = data.data['StrategyAnalysis'].id;
            this.strategyAnalysisService.PorterFiveForce = Object.assign({}, data.data['StrategyAnalysis']);
            this.portersAnalysisFrom.patchValue(this.strategyAnalysisService.PorterFiveForce);
            if (!!this.strategyAnalysisService.PorterFiveForce.details) {
              this.strategyAnalysisService.PorterFiveForce.details.forEach((key, i) => {
                const strategyDetails = this.strategyAnalysisService.PorterFiveForce;
                switch (this.strategyAnalysisService.PorterFiveForce.details[i].title) {
                  case 'Supplier Power':
                    this.supplierPower = strategyDetails.details[i].criterias;
                    this.activateClass(this.portersType, 0);
                    break;
                  case 'Buyer Power':
                    this.buyerPower = strategyDetails.details[i].criterias;
                    break;
                  case 'Competative Rivalry':
                    this.competativeRivalry = strategyDetails.details[i].criterias;
                    break;
                  case 'Threats of Substitution':
                    this.threatsofSubstitution = strategyDetails.details[i].criterias;
                    break;
                  case 'Threats of new entry':
                    this.threatsofnewentry = strategyDetails.details[i].criterias;
                    break;
                }
              });
            }
          } else {
            this.portersId = null;
            this.supplierPower = [];
            this.buyerPower = [];
            this.competativeRivalry = [];
            this.threatsofSubstitution = [];
            this.threatsofnewentry = [];
            this.portersAnalysisFrom.controls.info1.setValue('');
            this.portersAnalysisFrom.controls.info2.setValue('');
            this.portersAnalysisFrom.controls.info3.setValue('');
            this.portersAnalysisFrom.controls.info4.setValue('');
            this.strategyAnalysisService.PorterFiveForce.details = null;
            this.activateClass('Supplier Power', 0);
          }
        });
    }
  }

  activateClass(name: string, index) {
    this.portersType = name;
    this.selectedIndex = index;
    if (!!this.strategyAnalysisService.PorterFiveForce.details) {
      this.strategyAnalysisService.PorterFiveForce.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForce.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.supplierPower);
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.buyerPower);
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.competativeRivalry);
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.threatsofSubstitution);
              break;
            case 'Threats of new entry':
              this.threatsofnewentry = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.threatsofnewentry);
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.PorterFiveForceUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForceUndefined.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.supplierPower);
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.buyerPower);
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.competativeRivalry);
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.threatsofSubstitution);
              break;
            case 'Threats of new entry':
              this.threatsofnewentry = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.portersAnalysisFrom.controls.details.setValue(this.threatsofnewentry);
              break;
          }
        }
      });
    }
  }

  savePortersAnalysis(type: any) {
    if (!!this.strategyAnalysisService.PorterFiveForce.details) {
      this.strategyAnalysisService.PorterFiveForce.orgCode = this.portersAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.PorterFiveForce.description = this.portersAnalysisFrom.value.description;
      this.strategyAnalysisService.PorterFiveForce.orgName = this.portersAnalysisFrom.value.orgName;
      this.strategyAnalysisService.PorterFiveForce.type = type;
      this.strategyAnalysisService.PorterFiveForce.year = this.portersAnalysisFrom.value.year;
      this.strategyAnalysisService.PorterFiveForce.version = this.portersAnalysisFrom.value.version;
      this.portersAnalysisFrom.value.details = this.strategyAnalysisService.PorterFiveForce.details;
    } else {
      this.strategyAnalysisService.PorterFiveForceUndefined.orgCode = this.portersAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.PorterFiveForceUndefined.description = this.portersAnalysisFrom.value.description;
      this.strategyAnalysisService.PorterFiveForceUndefined.orgName = this.portersAnalysisFrom.value.orgName;
      this.strategyAnalysisService.PorterFiveForceUndefined.type = type;
      this.strategyAnalysisService.PorterFiveForceUndefined.year = this.portersAnalysisFrom.value.year;
      this.strategyAnalysisService.PorterFiveForceUndefined.version = this.portersAnalysisFrom.value.version;
      this.portersAnalysisFrom.value.details = this.strategyAnalysisService.PorterFiveForceUndefined.details;
    }

    this.portersAnalysisFrom.value.type = 'PORTERSFIVEFORCE';
    if (!!this.portersId) {
      this.portersAnalysisFrom.value.id = this.portersId;
      this.bscRestService.UpdateAnalysis(this.portersAnalysisFrom.value, this.portersId).subscribe((data: any) => {
        this.portersId = null;
        this.clearFields();
      }, error => {
        this.toasterService.error('Unable to update, Please try again later');
      });
    } else {
      this.bscRestService.saveSwotAnalysis(this.portersAnalysisFrom.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.portersId = data.data['StrategyAnalysis'].id;
          this.clearFields();
        }
      }, error => {
        this.toasterService.error('Error While saving Posters Five Analysis Analysis');
      });
    }
  }

  onItemAdded(event: any) {
    if (!!this.strategyAnalysisService.PorterFiveForce.details) {
      this.strategyAnalysisService.PorterFiveForce.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForce.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.supplierPower.push(event.value ? event.value : event);
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.buyerPower.push(event.value ? event.value : event);
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.competativeRivalry.push(event.value ? event.value : event);
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.threatsofSubstitution.push(event.value ? event.value : event);
              break;
            case 'Threats of new entry':
              this.threatsofnewentrys = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.threatsofnewentrys.push(event.value ? event.value : event);
              break;
          }

        }
      });
    } else {
      this.strategyAnalysisService.PorterFiveForceUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForceUndefined.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.supplierPower.push(event.value ? event.value : event);
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.buyerPower.push(event.value ? event.value : event);
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.competativeRivalry.push(event.value ? event.value : event);
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.threatsofSubstitution.push(event.value ? event.value : event);
              break;
            case 'Threats of new entry':
              this.threatsofnewentrys = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.threatsofnewentrys.push(event.value ? event.value : event);
              break;
          }

        }
      });
    }
  }

  onItemRemoved(event: any) {
    if (!!this.strategyAnalysisService.PorterFiveForce.details) {
      this.strategyAnalysisService.PorterFiveForce.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForce.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.index = this.supplierPower.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.supplierPower.splice(this.index, 1);
              }
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.index = this.buyerPower.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.buyerPower.splice(this.index, 1);
              }
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.index = this.competativeRivalry.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.competativeRivalry.splice(this.index, 1);
              }
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.index = this.threatsofSubstitution.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threatsofSubstitution.splice(this.index, 1);
              }
              break;
            case 'Threats of new entry':
              this.threatsofnewentry = this.strategyAnalysisService.PorterFiveForce.details[i].criterias;
              this.index = this.threatsofnewentry.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threatsofnewentry.splice(this.index, 1);
              }
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.PorterFiveForceUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.portersType.toUpperCase()) {
          switch (this.strategyAnalysisService.PorterFiveForceUndefined.details[i].title) {
            case 'Supplier Power':
              this.supplierPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.index = this.supplierPower.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.supplierPower.splice(this.index, 1);
              }
              break;
            case 'Buyer Power':
              this.buyerPower = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.index = this.buyerPower.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.buyerPower.splice(this.index, 1);
              }
              break;
            case 'Competative Rivalry':
              this.competativeRivalry = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.index = this.competativeRivalry.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.competativeRivalry.splice(this.index, 1);
              }
              break;
            case 'Threats of Substitution':
              this.threatsofSubstitution = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.index = this.threatsofSubstitution.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threatsofSubstitution.splice(this.index, 1);
              }
              break;
            case 'Threats of new entry':
              this.threatsofnewentry = this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias;
              this.index = this.threatsofnewentry.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threatsofnewentry.splice(this.index, 1);
              }
              break;
          }
        }
      });
    }
  }

  clearFields() {
    this.supplierPower = [];
    this.buyerPower = [];
    this.competativeRivalry = [];
    this.threatsofSubstitution = [];
    this.threatsofnewentry = [];
    if (!!this.strategyAnalysisService.PorterFiveForce.details) {
      this.strategyAnalysisService.PorterFiveForce.details.forEach((key, i) => {
        this.strategyAnalysisService.PorterFiveForce.details[i].criterias = [];
      });
    } else {
      this.strategyAnalysisService.PorterFiveForceUndefined.details.forEach((key, i) => {
        this.strategyAnalysisService.PorterFiveForceUndefined.details[i].criterias = [];
      });
    }
    this.portersAnalysisFrom.reset();
  }

  ngOnDestroy(): void {
  }
}
