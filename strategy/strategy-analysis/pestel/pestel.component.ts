import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {BscRestService} from '../../../shared/rest.service';
import {EmitterService} from '../../../shared/emitter.service';
import {StrategyAnalysisService} from '../strategy-analysis.service';
import {ToastrService} from 'ngx-toastr';
import * as $ from 'jquery';
import {CustomValidators} from '../../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../../constants/tooltipInfoConstants';
import {Util} from '../../../shared/utils/util';


@Component({
  selector: 'app-pestel',
  templateUrl: './pestel.component.html',
  styleUrls: ['./pestel.component.scss']
})
export class PestelComponent implements OnInit, OnDestroy {
  codeAndName: any;
  orgName: any;
  reqObj: any;
  politicalAnalysis: any;
  economicAnalysis: any;
  technologicalAnalysis: any;
  socialAnalysis: any;
  environmentalAnalysis: any;
  legalAnalysis: any;
  pestalType: any = 'Political Analysis';
  pestalId: any;
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
  pestalAnalysis = [
    {id: 1, name: 'Political Analysis'},
    {id: 2, name: 'Economic Analysis'},
    {id: 3, name: 'Social Analysis'},
    {id: 4, name: 'Technological Analysis'},
    {id: 5, name: 'Environmental Analysis'},
    {id: 6, name: 'Legal Analysis'}
  ];

  pestalAnalysisFrom = this.formBuilder.group({
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
              private toasterService: ToastrService,
              private emitterService: EmitterService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {

    $('#angleup2').click(function () {
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
    }); */
    this.getOrgUnitCode();
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getCodeName() {
    this.codeAndName.forEach((val, key) => {
      if (this.pestalAnalysisFrom.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.pestalAnalysisFrom.controls.orgName.setValue(this.orgName);
        if (this.pestalAnalysisFrom.controls.version.value !== '' && this.pestalAnalysisFrom.controls.year.value !== '') {
          this.getPestelAnalysis('PESTEL');
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

  getPestelAnalysis(type: any) {
    this.reqObj = this.pestalAnalysisFrom.value;
    if (!!this.reqObj.orgCode && !!this.reqObj.year && !!this.reqObj.version) {
      this.bscRestService.getStretegyAnalysis(this.reqObj.orgCode, this.reqObj.year, this.reqObj.version, type)
        .subscribe((data: any) => {
          if (data.status === '0' && !!data.data['StrategyAnalysis'].id) {
            this.pestalId = data.data['StrategyAnalysis'].id;
            this.strategyAnalysisService.pestalAnalysis = Object.assign({}, data.data['StrategyAnalysis']);
            this.pestalAnalysisFrom.patchValue(data.data['StrategyAnalysis']);
            if (!!this.strategyAnalysisService.pestalAnalysis.details) {
              this.strategyAnalysisService.pestalAnalysis.details.forEach((key, i) => {
                const pestelDetails = this.strategyAnalysisService.pestalAnalysis;
                switch (this.strategyAnalysisService.pestalAnalysis.details[i].title) {
                  case 'Political Analysis':
                    this.politicalAnalysis = pestelDetails.details[i].criterias;
                    this.activateClass(this.pestalType, 0);
                    break;
                  case 'Economic Analysis':
                    this.economicAnalysis = pestelDetails.details[i].criterias;
                    break;
                  case 'Social Analysis':
                    this.socialAnalysis = pestelDetails.details[i].criterias;
                    break;
                  case 'Technological Analysis':
                    this.technologicalAnalysis = pestelDetails.details[i].criterias;
                    break;
                  case 'Environmental Analysis':
                    this.environmentalAnalysis = pestelDetails.details[i].criterias;
                    break;
                  case 'Legal Analysis':
                    this.legalAnalysis = pestelDetails.details[i].criterias;
                    break;
                }
              });
            }
          } else {
            this.pestalId = null;
            this.politicalAnalysis = [];
            this.economicAnalysis = [];
            this.socialAnalysis = [];
            this.technologicalAnalysis = [];
            this.environmentalAnalysis = [];
            this.legalAnalysis = [];
            this.pestalAnalysisFrom.controls.info1.setValue('');
            this.pestalAnalysisFrom.controls.info2.setValue('');
            this.pestalAnalysisFrom.controls.info3.setValue('');
            this.pestalAnalysisFrom.controls.info4.setValue('');
            this.strategyAnalysisService.pestalAnalysis.details = null;
            this.activateClass('Political Analysis', 0);
          }
        });
    }
  }

  activateClass(name: string, index) {
    this.pestalType = name;
    this.selectedIndex = index;
    if (!!this.strategyAnalysisService.pestalAnalysis.details) {
      this.strategyAnalysisService.pestalAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysis.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.politicalAnalysis);
              break;
            case 'Economic Analysis':
              this.economicAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.economicAnalysis);
              break;
            case 'Social Analysis':
              this.socialAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.socialAnalysis);
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.technologicalAnalysis);
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.environmentalAnalysis);
              break;
            case 'Legal Analysis':
              this.legalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.pestalAnalysisFrom.controls.details.setValue(this.legalAnalysis);
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.pestalAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysisUndefined.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.politicalAnalysis);
              break;
            case 'Economic Analysis':
              this.economicAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.economicAnalysis);
              break;
            case 'Social Analysis':
              this.socialAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.socialAnalysis);
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.technologicalAnalysis);
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.environmentalAnalysis);
              break;
            case 'Legal Analysis':
              this.legalAnalysis = null;
              this.pestalAnalysisFrom.controls.details.setValue(this.legalAnalysis);
              break;
          }
        }
      });
    }
  }

  savePestelAnalysis(type: any) {
    if (!!this.strategyAnalysisService.pestalAnalysis.details) {
      this.strategyAnalysisService.pestalAnalysis.orgCode = this.pestalAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.pestalAnalysis.description = this.pestalAnalysisFrom.value.description;
      this.strategyAnalysisService.pestalAnalysis.orgName = this.pestalAnalysisFrom.value.orgName;
      this.strategyAnalysisService.pestalAnalysis.type = type;
      this.strategyAnalysisService.pestalAnalysis.year = this.pestalAnalysisFrom.value.year;
      this.strategyAnalysisService.pestalAnalysis.version = this.pestalAnalysisFrom.value.version;
      this.pestalAnalysisFrom.value.details = this.strategyAnalysisService.pestalAnalysis.details;
    } else {
      this.strategyAnalysisService.pestalAnalysisUndefined.orgCode = this.pestalAnalysisFrom.value.orgCode;
      this.strategyAnalysisService.pestalAnalysisUndefined.description = this.pestalAnalysisFrom.value.description;
      this.strategyAnalysisService.pestalAnalysisUndefined.orgName = this.pestalAnalysisFrom.value.orgName;
      this.strategyAnalysisService.pestalAnalysisUndefined.type = type;
      this.strategyAnalysisService.pestalAnalysisUndefined.year = this.pestalAnalysisFrom.value.year;
      this.strategyAnalysisService.pestalAnalysisUndefined.version = this.pestalAnalysisFrom.value.version;
      this.pestalAnalysisFrom.value.details = this.strategyAnalysisService.pestalAnalysisUndefined.details;
    }
    this.pestalAnalysisFrom.value.type = 'PESTEL';
    if (!!this.pestalId) {
      this.pestalAnalysisFrom.value.id = this.pestalId;
      this.bscRestService.UpdateAnalysis(this.pestalAnalysisFrom.value, this.pestalId).subscribe((data: any) => {
        this.pestalId = null;
        this.clearFields();
      }, error => {
        this.toasterService.error('Unable to update, Please try again later');
      });
    } else {
      this.bscRestService.savePestelAnalysis(this.pestalAnalysisFrom.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.pestalId = data.data['StrategyAnalysis'].id;
          this.clearFields();
        }
      }, error => {
        this.toasterService.error('Error While saving Pestel Analysis');
      });
    }
  }

  addPestel(event: any) {
    if (!!this.strategyAnalysisService.pestalAnalysis.details) {
      this.strategyAnalysisService.pestalAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysis.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.politicalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Economic Analysis':
              this.economicAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.economicAnalysis.push(event.value ? event.value : event);
              break;
            case 'Social Analysis':
              this.socialAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.socialAnalysis.push(event.value ? event.value : event);
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.technologicalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.environmentalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Legal Analysis':
              this.legalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.legalAnalysis.push(event.value ? event.value : event);
              break;
          }

        }
      });
    } else {
      this.strategyAnalysisService.pestalAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysisUndefined.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.politicalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Economic Analysis':
              this.economicAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.economicAnalysis.push(event.value ? event.value : event);
              break;
            case 'Social Analysis':
              this.socialAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.socialAnalysis.push(event.value ? event.value : event);
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.technologicalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.environmentalAnalysis.push(event.value ? event.value : event);
              break;
            case 'Legal Analysis':
              this.legalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.legalAnalysis.push(event.value ? event.value : event);
              break;
          }

        }
      });
    }
  }

  deletePestel(event: any) {
    if (!!this.strategyAnalysisService.pestalAnalysis.details) {
      this.strategyAnalysisService.pestalAnalysis.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysis.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.politicalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.politicalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Economic Analysis':
              this.economicAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.economicAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.economicAnalysis.splice(this.index, 1);
              }
              break;
            case 'Social Analysis':
              this.socialAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.socialAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.socialAnalysis.splice(this.index, 1);
              }
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.technologicalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.technologicalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.environmentalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.environmentalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Legal Analysis':
              this.legalAnalysis = this.strategyAnalysisService.pestalAnalysis.details[i].criterias;
              this.index = this.legalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.legalAnalysis.splice(this.index, 1);
              }
              break;
          }
        }
      });
    } else {
      this.strategyAnalysisService.pestalAnalysisUndefined.details.forEach((key, i) => {
        if (key.title.toUpperCase() === this.pestalType.toUpperCase()) {
          switch (this.strategyAnalysisService.pestalAnalysisUndefined.details[i].title) {
            case 'Political Analysis':
              this.politicalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.politicalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.politicalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Economic Analysis':
              this.economicAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.economicAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.economicAnalysis.splice(this.index, 1);
              }
              break;
            case 'Social Analysis':
              this.socialAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.socialAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.socialAnalysis.splice(this.index, 1);
              }
              break;
            case 'Technological Analysis':
              this.technologicalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.technologicalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.technologicalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Environmental Analysis':
              this.environmentalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.environmentalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.environmentalAnalysis.splice(this.index, 1);
              }
              break;
            case 'Legal Analysis':
              this.legalAnalysis = this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias;
              this.index = this.legalAnalysis.indexOf(event.value ? event.value : event);
              if (this.index !== -1) {
                this.legalAnalysis.splice(this.index, 1);
              }
              break;
          }
        }
      });
    }
  }

  clearFields() {
    this.politicalAnalysis = [];
    this.economicAnalysis = [];
    this.socialAnalysis = [];
    this.technologicalAnalysis = [];
    this.environmentalAnalysis = [];
    this.legalAnalysis = [];
    this.pestalAnalysisFrom.controls.details.setValue(null);
    if (!!this.strategyAnalysisService.pestalAnalysis.details) {
      this.strategyAnalysisService.pestalAnalysis.details.forEach((key, i) => {
        this.strategyAnalysisService.pestalAnalysis.details[i].criterias = [];
      });
    } else {
      this.strategyAnalysisService.pestalAnalysisUndefined.details.forEach((key, i) => {
        this.strategyAnalysisService.pestalAnalysisUndefined.details[i].criterias = [];
      });
    }
    this.pestalAnalysisFrom.reset();
  }

  ngOnDestroy(): void {
  }
}
