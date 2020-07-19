import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as $ from 'jquery';
import {BscRestService} from '../../../shared/rest.service';
import {EmitterService} from '../../../shared/emitter.service';
import {StrategyAnalysisService} from '../strategy-analysis.service';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../../constants/tooltipInfoConstants';
import {Util} from '../../../shared/utils/util';


@Component({
  selector: 'app-swot',
  templateUrl: './swot.component.html',
  styleUrls: ['./swot.component.scss']
})
export class SwotComponent implements OnInit, OnDestroy {
  swotTypes: any = 'Strengths';
  codeAndName: any;
  orgName: any;
  strength: any = [];
  strengths: any = [];
  weaknesses: any = [];
  opportunities: any = [];
  threats: any;
  swotId: any;
  reqObj: any;
  index: any;
  codeAndNameSubsription: any;
  selectedIndex = 0;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  swot = [
    {id: 1, name: 'Strengths', active: true},
    {id: 2, name: 'Weaknesses', active: true},
    {id: 3, name: 'Opportunities', active: true},
    {id: 4, name: 'Threats', active: true}
  ];

  versions = [{id: 1, version: 'v1'},
    {id: 2, version: 'v2'},
    {id: 3, version: 'v3'},
    {id: 4, version: 'v4'},
    {id: 5, version: 'v5'},
  ];

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

  swotAnalysisFrom = this.formBuilder.group({
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
              private toastrService: ToastrService,
              private emitterService: EmitterService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {
    
    $('#angleup').click(function () {
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

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.swotAnalysisFrom.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.swotAnalysisFrom.controls.orgName.setValue(this.orgName);
        if (this.swotAnalysisFrom.controls.version.value !== '' && this.swotAnalysisFrom.controls.year.value !== '') {
          this.getStrategyAnalysis('SWOT');
        }
      }
    });
  }

  getStrategyAnalysis(type: any) {
    this.reqObj = this.swotAnalysisFrom.value;
    if (!!this.reqObj.orgCode && !!this.reqObj.year && !!this.reqObj.version) {
      this.bscRestService.getStretegyAnalysis(this.reqObj.orgCode, this.reqObj.year, this.reqObj.version, type)
        .subscribe((data: any) => {
          if (data.status === '0' && !!data.data['StrategyAnalysis'].id) {
            this.swotId = data.data['StrategyAnalysis'].id;
            this.strategyAnalysisService.strategyAnalysis = Object.assign({}, data.data['StrategyAnalysis']);
            this.swotAnalysisFrom.patchValue(this.strategyAnalysisService.strategyAnalysis);
            if (!!this.strategyAnalysisService.strategyAnalysis.details) {
              this.strategyAnalysisService.strategyAnalysis.details.forEach((key, i) => {
                const strategyDetails = this.strategyAnalysisService.strategyAnalysis;
                switch (this.strategyAnalysisService.strategyAnalysis.details[i].title) {
                  case 'Strengths':
                    this.strength = strategyDetails.details[i].criterias;
                    this.activateClass(this.swotTypes, 0);
                    break;
                  case 'Weaknesses':
                    this.weaknesses = strategyDetails.details[i].criterias;
                    break;
                  case 'Opportunities':
                    this.opportunities = strategyDetails.details[i].criterias;
                    break;
                  case 'Threats':
                    this.threats = strategyDetails.details[i].criterias;
                    break;
                }
              });
            }
          } else {
            this.swotId = null;
            this.strength = [];
            this.weaknesses = [];
            this.opportunities = [];
            this.threats = [];
            this.swotAnalysisFrom.controls.info1.setValue('');
            this.swotAnalysisFrom.controls.info2.setValue('');
            this.swotAnalysisFrom.controls.info3.setValue('');
            this.swotAnalysisFrom.controls.info4.setValue('');
            this.strategyAnalysisService.strategyAnalysis.details = null;
            this.activateClass('strengths', 0);
          }
        });
    }
  }

  activateClass(name: string, index) {
    this.swotTypes = name;
    this.selectedIndex = index;
    if (!!this.strategyAnalysisService.strategyAnalysis.details) {
      this.strategyAnalysisService.strategyAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysis.details[i].title) {
            case 'Strengths':
              this.strength = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.swotAnalysisFrom.controls.details.setValue(this.strength);
              break;
            case 'Weaknesses':
              this.weaknesses = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.swotAnalysisFrom.controls.details.setValue(this.weaknesses);
              break;
            case 'Opportunities':
              this.opportunities = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.swotAnalysisFrom.controls.details.setValue(this.opportunities);
              break;
            case 'Threats':
              this.threats = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.swotAnalysisFrom.controls.details.setValue(this.threats);
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.strategyAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysisUndefined.details[i].title) {
            case 'Strengths':
              this.strength = null;
              this.swotAnalysisFrom.controls.details.setValue(this.strength);
              break;
            case 'Weaknesses':
              this.weaknesses = null;
              this.swotAnalysisFrom.controls.details.setValue(this.weaknesses);
              break;
            case 'Opportunities':
              this.opportunities = null;
              this.swotAnalysisFrom.controls.details.setValue(this.opportunities);
              break;
            case 'Threats':
              this.threats = null;
              this.swotAnalysisFrom.controls.details.setValue(this.threats);
              break;
          }
        }
      });
    }
  }

  saveStrategiySwotAnalysis(type: any) {
    if (!!this.strategyAnalysisService.strategyAnalysis.details) {
      this.strategyAnalysisService.strategyAnalysis.orgCode = this.swotAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.strategyAnalysis.description = this.swotAnalysisFrom.value.description;
      this.strategyAnalysisService.strategyAnalysis.orgName = this.swotAnalysisFrom.value.orgName;
      this.strategyAnalysisService.strategyAnalysis.type = type;
      this.strategyAnalysisService.strategyAnalysis.year = this.swotAnalysisFrom.value.year;
      this.strategyAnalysisService.strategyAnalysis.version = this.swotAnalysisFrom.value.version;
      this.swotAnalysisFrom.value.details = this.strategyAnalysisService.strategyAnalysis.details;
    } else {
      this.strategyAnalysisService.strategyAnalysisUndefined.orgCode = this.swotAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.strategyAnalysisUndefined.description = this.swotAnalysisFrom.value.description;
      this.strategyAnalysisService.strategyAnalysisUndefined.orgName = this.swotAnalysisFrom.value.orgName;
      this.strategyAnalysisService.strategyAnalysisUndefined.type = type;
      this.strategyAnalysisService.strategyAnalysisUndefined.year = this.swotAnalysisFrom.value.year;
      this.strategyAnalysisService.strategyAnalysisUndefined.version = this.swotAnalysisFrom.value.version;
      this.swotAnalysisFrom.value.details = this.strategyAnalysisService.strategyAnalysisUndefined.details;
    }
    this.swotAnalysisFrom.value.type = 'SWOT';
    if (!!this.swotId) {
      this.swotAnalysisFrom.value.id = this.swotId;
      this.bscRestService.UpdateAnalysis(this.swotAnalysisFrom.value, this.swotId).subscribe((data: any) => {
        this.swotId = null;
        this.clearFileds();
      }, error => {
        this.toastrService.error('Unable to update, Please try again later');
      });
    } else {
      this.bscRestService.saveSwotAnalysis(this.swotAnalysisFrom.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.swotId = data.data['StrategyAnalysis'].id;
          this.clearFileds();
        }
      }, error => {
        this.toastrService.error('Error While saving Swot Analysis');
      });
    }
  }

  onItemAdded(event: any) {
    if (!!this.strategyAnalysisService.strategyAnalysis.details) {
      this.strategyAnalysisService.strategyAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysis.details[i].title) {
            case 'Strengths':
              this.strength = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.strength.push(event.value ? event.value : event);
              break;
            case 'Weaknesses':
              this.weaknesses = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.weaknesses.push(event.value ? event.value : event);
              break;
            case 'Opportunities':
              this.opportunities = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.opportunities.push(event.value ? event.value : event);
              break;
            case 'Threats':
              this.threats = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.threats.push(event.value ? event.value : event);
              break;
          }

        }
      });
    } else {
      this.strategyAnalysisService.strategyAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysisUndefined.details[i].title) {
            case 'Strengths':
              this.strength = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.strength.push(event.value ? event.value : event);
              break;
            case 'Weaknesses':
              this.weaknesses = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.weaknesses.push(event.value ? event.value : event);
              break;
            case 'Opportunities':
              this.opportunities = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.opportunities.push(event.value ? event.value : event);
              break;
            case 'Threats':
              this.threats = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.threats.push(event.value ? event.value : event);
              break;
          }

        }
      });
    }
  }

  onItemRemoved(event: any) {
    if (!!this.strategyAnalysisService.strategyAnalysis.details) {
      this.strategyAnalysisService.strategyAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysis.details[i].title) {
            case 'Strengths':
              this.strength = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.index = this.strength.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.strength.splice(this.index, 1);
              }
              break;
            case 'Weaknesses':
              this.weaknesses = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.index = this.weaknesses.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.weaknesses.splice(this.index, 1);
              }
              break;
            case 'Opportunities':
              this.opportunities = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.index = this.opportunities.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.opportunities.splice(this.index, 1);
              }
              break;
            case 'Threats':
              this.threats = this.strategyAnalysisService.strategyAnalysis.details[i].criterias;
              this.index = this.threats.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threats.splice(this.index, 1);
              }
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.strategyAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.swotTypes.toUpperCase()) {
          switch (this.strategyAnalysisService.strategyAnalysisUndefined.details[i].title) {
            case 'Strengths':
              this.strength = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.index = this.strength.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.strength.splice(this.index, 1);
              }
              break;
            case 'Weaknesses':
              this.weaknesses = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.index = this.weaknesses.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.weaknesses.splice(this.index, 1);
              }
              break;
            case 'Opportunities':
              this.opportunities = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.index = this.opportunities.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.opportunities.splice(this.index, 1);
              }
              break;
            case 'Threats':
              this.threats = this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias;
              this.index = this.threats.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.threats.splice(this.index, 1);
              }
              break;
          }
        }
      });
    }

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

  ngOnDestroy(): void {
  }

  clearFileds() {
    this.strength = [];
    this.weaknesses = [];
    this.opportunities = [];
    this.threats = [];
    if (!!this.strategyAnalysisService.strategyAnalysis.details) {
      this.strategyAnalysisService.strategyAnalysis.details.forEach((key, i) => {
        this.strategyAnalysisService.strategyAnalysis.details[i].criterias = [];
      });
    } else {
      this.strategyAnalysisService.strategyAnalysisUndefined.details.forEach((key, i) => {
        this.strategyAnalysisService.strategyAnalysisUndefined.details[i].criterias = [];
      });
    }
    this.swotAnalysisFrom.reset();
  }

}
