import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BscRestService} from '../../../shared/rest.service';
import {EmitterService} from '../../../shared/emitter.service';
import {CustomValidators} from '../../../shared/utils/custom-validator';
import {Util} from '../../../shared/utils/util';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {
  focusedElement: any;
  productGrpFrom = this.formBuilder.group({
    name: ['', []],
    unitOfMeasure: ['', [this.customValidators.required]]
  });

  constructor(private bscRestService: BscRestService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private emitterService: EmitterService,
              private customValidators: CustomValidators,
              private util: Util) {
  }

  ngOnInit() {
  }

  addProductGrp() {
    const productGroupName = this.productGrpFrom.value.name.toUpperCase();
    this.productGrpFrom.controls.name.setValue(productGroupName);
    this.bscRestService.saveProductGroup(this.productGrpFrom.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.emitterService.broadcastProductGroup(data.data['ProductGroup']);
        this.productGrpFrom.controls.name.setValue(null);
        this.productGrpFrom.controls.unitOfMeasure.setValue(null);
      } else {
        this.productGrpFrom.controls.name.setValue(null);
        this.productGrpFrom.controls.unitOfMeasure.setValue(null);
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

}
