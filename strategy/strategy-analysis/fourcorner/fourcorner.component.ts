import {Component, OnInit, OnDestroy} from '@angular/core';
import {BscRestService} from '../../../shared/rest.service';
import {EmitterService} from '../../../shared/emitter.service';
import {FormBuilder} from '@angular/forms';
import * as $ from 'jquery';
import {StrategyAnalysisService} from '../strategy-analysis.service';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../../constants/tooltipInfoConstants';
import {Util} from '../../../shared/utils/util';

@Component({
  selector: 'app-fourcorner',
  templateUrl: './fourcorner.component.html',
  styleUrls: ['./fourcorner.component.scss']
})
export class FourCornerComponent implements OnInit, OnDestroy {
  codeAndName: any;
  orgName: any;
  reqObj: any;
  driver: any = [];
  currentStrategy: any = [];
  managementAssumtion: any = [];
  capability: any = [];
  fourCornerType: any = 'Driver';
  fourCornerId: any;
  index: any;
  codeAndNameSubsription: any;
  selectedIndex = 0;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  fourCorners = [
    {id: 1, name: 'Driver', active: true},
    {id: 2, name: 'Current Strategy', active: true},
    {id: 3, name: 'Management Assumtions', active: true},
    {id: 4, name: 'Capabilities', active: true}
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

  fourCornersFrom = this.formBuilder.group({
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

    $('#angleup4').click(function () {
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
   /*  jQuery(function ($) {
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
      if (this.fourCornersFrom.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.fourCornersFrom.controls.orgName.setValue(this.orgName);
        if (this.fourCornersFrom.controls.version.value !== '' && this.fourCornersFrom.controls.year.value !== '') {
          this.getFourCornersAnalysis('FOURCORNERS');
        }
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

  getFourCornersAnalysis(type: any) {
    this.reqObj = this.fourCornersFrom.value;
    if (!!this.reqObj.orgCode && !!this.reqObj.year && !!this.reqObj.version) {
      this.bscRestService.getStretegyAnalysis(this.reqObj.orgCode, this.reqObj.year, this.reqObj.version, type)
        .subscribe((data: any) => {
          if (data.status === '0' && !!data.data['StrategyAnalysis'].id) {
            this.fourCornerId = data.data['StrategyAnalysis'].id;
            this.strategyAnalysisService.FourCornersAnalysis = Object.assign({}, data.data['StrategyAnalysis']);
            this.fourCornersFrom.patchValue(this.strategyAnalysisService.FourCornersAnalysis);
            this.strategyAnalysisService.FourCornersAnalysis.details.forEach((key, i) => {
              const strategyDetails = this.strategyAnalysisService.FourCornersAnalysis;
              switch (this.strategyAnalysisService.FourCornersAnalysis.details[i].title) {
                case 'Driver':
                  this.driver = strategyDetails.details[i].criterias;
                  this.activateClass(this.fourCornerType, 0);
                  break;
                case 'Current Strategy':
                  this.currentStrategy = strategyDetails.details[i].criterias;
                  break;
                case 'Management Assumtions':
                  this.managementAssumtion = strategyDetails.details[i].criterias;
                  break;
                case 'Capabilities':
                  this.capability = strategyDetails.details[i].criterias;
                  break;
              }
            });
          } else {
            this.fourCornerId = null;
            this.driver = [];
            this.currentStrategy = [];
            this.managementAssumtion = [];
            this.capability = [];
            this.fourCornersFrom.controls.info1.setValue('');
            this.fourCornersFrom.controls.info2.setValue('');
            this.fourCornersFrom.controls.info3.setValue('');
            this.fourCornersFrom.controls.info4.setValue('');
            this.strategyAnalysisService.FourCornersAnalysis.details = null;
            this.activateClass('Driver', 0);
          }
        });
    }
  }

  activateClass(name: string, index) {
    this.fourCornerType = name;
    this.selectedIndex = index;
    if (!!this.strategyAnalysisService.FourCornersAnalysis.details) {
      this.strategyAnalysisService.FourCornersAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysis.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.driver);
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.currentStrategy);
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.managementAssumtion);
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.capability);
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.FourCornersAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.driver);
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.currentStrategy);
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.managementAssumtion);
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.fourCornersFrom.controls.details.setValue(this.capability);
              break;
          }
        }
      });
    }
  }

  saveFourCornerAnalysis(type: any) {
    if (!!this.strategyAnalysisService.FourCornersAnalysis.details) {
      this.strategyAnalysisService.FourCornersAnalysis.orgCode = this.fourCornersFrom.value.orgCode;
      this.strategyAnalysisService.FourCornersAnalysis.description = this.fourCornersFrom.value.description;
      this.strategyAnalysisService.FourCornersAnalysis.orgName = this.fourCornersFrom.value.orgName;
      this.strategyAnalysisService.FourCornersAnalysis.type = type;
      this.strategyAnalysisService.FourCornersAnalysis.year = this.fourCornersFrom.value.year;
      this.strategyAnalysisService.FourCornersAnalysis.version = this.fourCornersFrom.value.version;
      this.fourCornersFrom.value.details = this.strategyAnalysisService.FourCornersAnalysis.details;
    } else {
      this.strategyAnalysisService.FourCornersAnalysisUndefined.orgCode = this.fourCornersFrom.value.orgCode;
      this.strategyAnalysisService.FourCornersAnalysisUndefined.description = this.fourCornersFrom.value.description;
      this.strategyAnalysisService.FourCornersAnalysisUndefined.orgName = this.fourCornersFrom.value.orgName;
      this.strategyAnalysisService.FourCornersAnalysisUndefined.type = type;
      this.strategyAnalysisService.FourCornersAnalysisUndefined.year = this.fourCornersFrom.value.year;
      this.strategyAnalysisService.FourCornersAnalysisUndefined.version = this.fourCornersFrom.value.version;
      this.fourCornersFrom.value.details = this.strategyAnalysisService.FourCornersAnalysisUndefined.details;
    }

    this.fourCornersFrom.value.type = 'FOURCORNERS';
    if (!!this.fourCornerId) {
      this.fourCornersFrom.value.id = this.fourCornerId;
      this.bscRestService.UpdateAnalysis(this.fourCornersFrom.value, this.fourCornerId).subscribe((data: any) => {
        this.fourCornerId = null;
        this.clearFields();
      }, error => {
        this.toastrService.error('Unable to update, Please try again later');
      });
    } else {
      this.bscRestService.saveSwotAnalysis(this.fourCornersFrom.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.fourCornerId = data.data['StrategyAnalysis'].id;
          this.clearFields();
        }
      }, error => {
        this.toastrService.error('Error While saving Four Corners Analysis');
      });
    }
  }

  onItemAdded(event: any) {
    if (!!this.strategyAnalysisService.FourCornersAnalysis.details) {
      this.strategyAnalysisService.FourCornersAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysis.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.driver.push(event.value ? event.value : event);
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.currentStrategy.push(event.value ? event.value : event);
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.managementAssumtion.push(event.value ? event.value : event);
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.capability.push(event.value ? event.value : event);
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.FourCornersAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.driver.push(event.value ? event.value : event);
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.currentStrategy.push(event.value ? event.value : event);
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.managementAssumtion.push(event.value ? event.value : event);
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.capability.push(event.value ? event.value : event);
              break;
          }

        }
      });
    }
  }

  onItemRemoved(event: any) {
    if (!!this.strategyAnalysisService.FourCornersAnalysis.details) {
      this.strategyAnalysisService.FourCornersAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysis.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.index = this.driver.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.driver.splice(this.index, 1);
              }
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.index = this.currentStrategy.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.currentStrategy.splice(this.index, 1);
              }
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.index = this.managementAssumtion.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.managementAssumtion.splice(this.index, 1);
              }
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias;
              this.index = this.capability.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.capability.splice(this.index, 1);
              }
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.FourCornersAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.fourCornerType.toUpperCase()) {
          switch (this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].title) {
            case 'Driver':
              this.driver = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.index = this.driver.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.driver.splice(this.index, 1);
              }
              break;
            case 'Current Strategy':
              this.currentStrategy = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.index = this.currentStrategy.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.currentStrategy.splice(this.index, 1);
              }
              break;
            case 'Management Assumtions':
              this.managementAssumtion = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.index = this.managementAssumtion.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.managementAssumtion.splice(this.index, 1);
              }
              break;
            case 'Capabilities':
              this.capability = this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias;
              this.index = this.capability.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.capability.splice(this.index, 1);
              }
              break;
          }
        }
      });
    }
  }

  clearFields() {
    this.driver = [];
    this.currentStrategy = [];
    this.managementAssumtion = [];
    this.capability = [];
    if (!!this.strategyAnalysisService.FourCornersAnalysis.details) {
      this.strategyAnalysisService.FourCornersAnalysis.details.forEach((key, i) => {
        this.strategyAnalysisService.FourCornersAnalysis.details[i].criterias = [];
      });
    } else {
      this.strategyAnalysisService.FourCornersAnalysisUndefined.details.forEach((key, i) => {
        this.strategyAnalysisService.FourCornersAnalysisUndefined.details[i].criterias = [];
      });
    }
    this.fourCornersFrom.reset();
  }

  ngOnDestroy(): void {
  }
}
