import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BscService} from '../bsc.service';
import {BscRestService} from '../../shared/rest.service';
import {AppService} from '../../shared/app.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';

@Component({
  selector: 'app-bsc',
  templateUrl: './bsc.component.html',
  styleUrls: ['./bsc.component.scss']
})
export class BscComponent implements OnInit, OnDestroy {
  codeAndName: any;
  orgName: any;
  perspectiveType = 'radioOpt1';
  codeAndNameSubsription: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  constructor(private formBuilder: FormBuilder,
              private bscService: BscService,
              private bscRestService: BscRestService,
              private toastrService: ToastrService,
              private router: Router,
              private appService: AppService,
              private emitterService: EmitterService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  bscForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    code: ['', [this.customValidators.required]],
    name: ['', [this.customValidators.required]],
    discription: [''],
    tag: [''],
    defaultPerspectives: [''],
  });

  projType = [
    {id: 2, name: 'Empty Project', type: 'radio', option: 'radioOpt2'},
    {id: 3, name: 'Strategy Wizard', type: 'radio', option: 'radioOpt3'},
  ];

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

  getCodeNameForPestal() {
    this.codeAndName.forEach((val, key) => {
      if (this.bscForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.bscForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  ngOnInit() {
    this.getOrgUnitCode();
  }

  saveBalanceScoreCard() {
    this.bscRestService.saveBalanceScoreCard(this.bscForm.value).subscribe((data: any) => {
      const event = {
        target: {value: 'radioOpt1'}
      };
      this.bscForm.reset();
    }, error => {
      this.toastrService.error('Error While saving score card, please try again later');
    });

  }

  clearFields() {
    this.bscForm.reset();
  }

  projectType(event: any) {
    switch (event) {
      case 'radioOpt1':
        this.router.navigate(['/bsc/perspective'], {queryParams: {defaultProjType: true}});
        this.emitterService.broadcastemptyProj(true);
        break;
      case 'radioOpt2':
        this.emitterService.broadcastemptyProj(true);
        this.appService.navigate('/bsc/perspective', null);
        break;
      case 'radioOpt3':
        console.log('3');
        break;
      default:
        console.log('4');
    }
  }

  ngOnDestroy(): void {
  }
}
