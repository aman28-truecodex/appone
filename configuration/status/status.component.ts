import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../configuration.service';
import {FormBuilder, FormGroup, FormControl, FormArray} from '@angular/forms';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  statusForm: FormGroup;
  elementsData = [];
  focusedElement: any;

  constructor(private configurationService: ConfigurationService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  linkedItems = [
    {id: 1, element: 'Objectives'},
    {id: 2, element: 'Measures'},
    {id: 3, element: 'Initiatives'},
    {id: 4, element: 'Milestones'},
    {id: 5, element: 'Action Items'}
  ];

  ngOnInit() {
    this.statusForm = this.formBuilder.group({
      name: ['', this.customValidators.required],
      score: [''],
      description: [''],
      iconName: [''],
      customStatusIndicatorEnabled: [''],
      customIconUrl: [''],
      customIconColorCode: [''],
      allowedElements: new FormArray([])
    });
  }

  getElements(event: any) {
    console.log(event.target.value);
  }

  private addCheckboxes() {
    this.linkedItems.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.statusForm.controls.allowedElements as FormArray).push(control);
    });
  }

  saveStatus() {
    // const selectedOrderIds = this.statusForm.value.allowedElements
    //   .map((v, i) => v ? this.allowedElements[i].id : null)
    //   .filter(v => v !== null);
    // console.log(selectedOrderIds);
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


  clearFileds() {
    this.statusForm.reset();
  }
}
