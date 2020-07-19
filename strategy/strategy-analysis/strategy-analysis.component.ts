import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import * as $ from 'jquery';
import {StrategyAnalysisService} from './strategy-analysis.service';
import {ToastrService} from 'ngx-toastr';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';

window['$'] = window['jQuery'] = $;

@Component({
  selector: 'app-strategy-analysis',
  templateUrl: './strategy-analysis.component.html',
  styleUrls: ['./strategy-analysis.component.scss']
})
export class StrategyAnalysisComponent implements OnInit {
  codeAndName: any;
  orgName: any;
  selectedIndex: number = 0;
  reqObj: any;
  strength: any;
  strengths: any;
  weaknesses: any;
  weaknessess: any;
  opportunities: any;
  opportunitiess: any;
  threats: any;
  threatss: any;
  swotTypes: any = 'Strengths';
  pestalType: any = 'Political Analysis';
  type: any;
  isEditMode = true;
  index: any;
  swotId: any;
  pestalId: any;
  politicalAnalysis: any;
  economicAnalysis: any;
  socialAnalysis: any;
  technologicalAnalysis: any;
  environmentalAnalysis: any;
  legalAnalysis: any;
  codeAndNameSubsription: any;

  constructor(private formBuilder: FormBuilder,
              private strategyAnalysisService: StrategyAnalysisService,
              private emitterService: EmitterService,
              private toastrService: ToastrService,
              private customValidators: CustomValidators) {

    jQuery(function ($) {
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


  }



  ngOnInit() {

  }
}
