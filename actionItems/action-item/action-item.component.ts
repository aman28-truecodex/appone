import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {EmitterService} from '../../shared/emitter.service';
import {BscService} from '../../bsc/bsc.service';
import {ActionItemService} from '../actionItem.service';
import {Options} from 'ng5-slider';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ToastrService} from 'ngx-toastr';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss']
})
export class ActionItemComponent implements OnInit {

  @ViewChild('fruitInputTo') fruitInputTo: ElementRef<HTMLInputElement>;
  @ViewChild('fruitInputCc') fruitInputCc: ElementRef<HTMLInputElement>;
  @ViewChild('autoTo') matAutocompleteTo: MatAutocomplete;
  @ViewChild('autoCc') matAutocompleteCc: MatAutocomplete;
  value = 0;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  empEmailToCtrl = new FormControl();
  empEmailCcCtrl = new FormControl();
  filteredToEmails: Observable<string[]>;
  filteredCcEmails: Observable<string[]>;
  empTo: any = [];
  empCc: any = [];
  empEmailList: any = [];
  errorMessage: any;
  fileName: any;
  codeAndNameSubsription: any;
  balanceScoreCardData: any;
  codeAndName: any;
  orgName: any;
  codeName: any;
  empMasterData: any;
  fileAsBase64: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;

  options: Options = {
    showTicksValues: true,
    stepsArray: [
      {value: 10},
      {value: 20},
      {value: 30},
      {value: 40},
      {value: 50},
      {value: 60},
      {value: 70},
      {value: 80},
      {value: 90},
      {value: 100}
    ]
  };

  actionItemForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    code: ['', [this.customValidators.required]],
    name: ['', [this.customValidators.required]],
    description: [''],
    reportingFrequency: [''],
    evaluationMasterMeasure: [''],
    owner: [null, []],
    collaborators: [null, []],
    attachmentUrls: [''],
    status: [null],
    percentComplete: [null],
    completed: [true],
    completionDate: [''],
    comments: [''],
    scheduledMeetingStartDate: [''],
    scheduledMeetingEndDate: [''],
    mailToEmailIds: [''],
    mailCcEmailIds: [''],
    mailSubject: [''],
    meetingLocation: [''],
    startDate: [''],
    startTime: [''],
    endDate: [''],
    endTime: [''],
    dayEvent: [''],
    reminderFrequency: ['']

  });

  linkTypes = [{id: 1, type: 'Objectives'},
    {id: 2, type: 'Measures'},
    {id: 3, type: 'Initiative'},
    {id: 4, type: 'Action Items'}];

  reportingFrequency = [
    {id: 1, frequency: 'WEEKLY'},
    {id: 2, frequency: 'DAILY'},
    {id: 3, frequency: 'YEARLY'},
    {id: 4, frequency: 'MONTHLY'},
    {id: 5, frequency: 'QUARTERLY'},
    {id: 6, frequency: 'HOURLY'},
  ];

  status = [
    {id: 1, status: 'In Progress'},
    {id: 1, status: 'In Transit'},
    {id: 1, status: 'Completed'}
  ];

  constructor(private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private bscService: BscService,
              private actionItemService: ActionItemService,
              private toastrService: ToastrService,
              private customValidators: CustomValidators,
              private http: HttpClient,
              private util: Util) {
    const arr = ['tharundillikar@gmail.com', 'tharundillikar@gmail.com'];

    this.filteredToEmails = this.empEmailToCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.empEmailList.slice()));

    this.filteredCcEmails = this.empEmailToCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.empEmailList.slice()));
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllEmpMasterData();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.empEmailList.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  addCc(event: MatChipInputEvent): void {
    if (!this.matAutocompleteCc.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.empCc.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.empEmailCcCtrl.setValue(null);
    }
  }

  addTo(event: MatChipInputEvent): void {

    if (!this.matAutocompleteTo.isOpen) {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        this.empTo.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.empEmailToCtrl.setValue(null);

    }
  }

  removeTo(fruit: string): void {
    const index = this.empTo.indexOf(fruit);

    if (index >= 0) {
      this.empTo.splice(index, 1);
    }
  }

  removeCc(fruit: string): void {
    const index = this.empCc.indexOf(fruit);

    if (index >= 0) {
      this.empCc.splice(index, 1);
    }
  }

  selectedCc(event: MatAutocompleteSelectedEvent): void {
    this.empCc.push(event.option.viewValue);
    this.fruitInputCc.nativeElement.value = '';
    this.empEmailCcCtrl.setValue(null);
  }

  selectedTo(event: MatAutocompleteSelectedEvent): void {
    this.empTo.push(event.option.viewValue);
    this.fruitInputTo.nativeElement.value = '';
    this.empEmailToCtrl.setValue(null);
  }

  getAllEmpMasterData() {
    this.bscService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
        this.empEmailList = this.empMasterData.map(a => a.emailID);
      }
    });
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.actionItemForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.actionItemForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  getBalanceScoreCard() {
    this.bscService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.actionItemForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.actionItemForm.controls.scName.setValue(this.codeName);
      }
    });
  }

  getScCode(event) {
    console.log(event.target.value);
  }

  percentCompleted(event: any) {
    this.actionItemForm.controls.percentComplete.setValue(parseInt(event));
  }

  saveActionItem() {
    this.actionItemForm.controls.mailToEmailIds.setValue(this.empTo);
    this.actionItemForm.controls.mailCcEmailIds.setValue(this.empCc);

    const formData: any = new FormData();
    if (this.actionItemForm.valid) {
      const ccEmails = this.actionItemForm.get('mailCcEmailIds').value;

      formData.append('file', this.actionItemForm.get('attachmentUrls').value);
      this.actionItemForm.controls.mailToEmailIds.setValue(this.empTo);
      this.actionItemForm.controls.mailCcEmailIds.setValue(this.empCc);
      formData.append('orgCode', this.actionItemForm.get('orgCode').value);
      formData.append('orgName', this.actionItemForm.get('orgName').value);
      formData.append('scCode', this.actionItemForm.get('scCode').value);
      formData.append('scName', this.actionItemForm.get('scName').value);
      formData.append('code', this.actionItemForm.get('code').value);
      formData.append('name', this.actionItemForm.get('name').value);
      formData.append('description', this.actionItemForm.get('description').value);
      formData.append('reportingFrequency', this.actionItemForm.get('reportingFrequency').value);
      formData.append('evaluationMasterMeasure', this.actionItemForm.get('evaluationMasterMeasure').value);
      formData.append('owner', this.actionItemForm.get('owner').value);
      formData.append('collaborators', this.actionItemForm.get('collaborators').value);
      formData.append('status', this.actionItemForm.get('status').value);
      formData.append('percentComplete', this.actionItemForm.get('percentComplete').value);
      // formData.append('completed', this.actionItemForm.get('completed').value);
      formData.append('completionDate', this.actionItemForm.get('completionDate').value);
      formData.append('comments', this.actionItemForm.get('comments').value);
      formData.append('scheduledMeetingStartDate', this.actionItemForm.get('scheduledMeetingStartDate').value);
      formData.append('scheduledMeetingEndDate', this.actionItemForm.get('scheduledMeetingEndDate').value);
      formData.append('mailToEmailIds', this.actionItemForm.get('mailToEmailIds').value.join(','));
      formData.append('mailCcEmailIds', this.actionItemForm.get('mailCcEmailIds').value.join(','));
      formData.append('mailSubject', this.actionItemForm.get('mailSubject').value);
      formData.append('meetingLocation', this.actionItemForm.get('meetingLocation').value);
      formData.append('startDate', this.actionItemForm.get('startDate').value);
      formData.append('startTime', this.actionItemForm.get('startTime').value);
      formData.append('endDate', this.actionItemForm.get('endDate').value);
      formData.append('endTime', this.actionItemForm.get('endTime').value);

      this.http.post('https://dev.fruisce.in/bsc/api/scorecard/actionitem', formData).subscribe((data: any) => {
        if (data.status === '0') {
          this.empCc = [];
          this.empTo = [];
          this.fileName = '';
          this.actionItemForm.reset();
          this.value = 0;
        }
      });
    }
  }

  uploadLogo(event: any) {
    // const reader = new FileReader();

    // if (event.target.files[0].size >= 2097152) {
    //   this.errorMessage = 'File size should be less than 2 MB';
    //   this.toastrService.error('File size should be less than 2 MB');
    // } else {
    //   const file = event.target.files[0];
    //   reader.readAsDataURL(file);
    //   reader.onload = () => {
    //     this.fileAsBase64 = reader.result;
    //     this.actionItemForm.controls['attachmentUrls'].setValue(this.fileAsBase64);
    //     this.actionItemForm.controls.fileName.setValue(this.fileName);
    //   };
    // }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.fileName = file.name;
      this.actionItemForm.get('attachmentUrls').setValue(file);
      // this.actionItemForm.controls.fileName.setValue(this.fileName);
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

  clearFields() {
    this.actionItemForm.reset();
    this.empCc = [];
    this.empTo = [];
    this.fileName = '';
  }

}
