import {Component, OnInit, ViewChild} from '@angular/core';
import {EmitterService} from '../../shared/emitter.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {BscRestService} from '../../shared/rest.service';
import {ConfigurationService} from '../configuration.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {Util} from '../../shared/utils/util';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {ExcelService} from '../../shared/excel.service';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})

export class EmployeeMasterComponent implements OnInit {
  codeAndNameSubscription: any;
  codeAndName: any;
  orgName: any;
  deptName: any;
  reqObj: any;
  empMaterData: any = [];
  empMaterId: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['sNo', 'organizationUnitCode', 'departmentCode', 'employeeID', 'reportingManager', 'jobTitle', 'address', 'emailID', 'dateOfJoining', 'panNumber', 'phoneNumber', 'action'];
  employeeMasterTableForm = this.formBuilder.group({
    organizationUnitCode: [null, [this.customValidators.required]],
    organizationUnitName: [''],
    departmentCode: [null, [this.customValidators.required]],
    departmentName: [''],
    employeeID: ['', [this.customValidators.required]],
    employeeName: ['', [this.customValidators.required]],
    reportingManager: [''],
    jobTitle: [''],
    annualSalary: [''],
    address: [''],
    emailID: ['', [this.customValidators.required]],
    panNumber: [''],
    phoneNumber: [''],
    dateOfJoining: ['']
  });

  constructor(private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private configurationService: ConfigurationService,
              private util: Util,
              private excelService: ExcelService,
              private simpleModalService: SimpleModalService,
              private customValidators: CustomValidators,
              private bscRestService: BscRestService) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getAllEmpMater();
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getOrgUnitName() {
    this.codeAndName.forEach((val, key) => {
      if (this.employeeMasterTableForm.controls.organizationUnitCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.employeeMasterTableForm.controls.organizationUnitName.setValue(this.orgName);
      }
    });
  }

  getOrgUnitNameForDept() {
    this.codeAndName.forEach((val, key) => {
      if (this.employeeMasterTableForm.controls.departmentCode.value === val.code) {
        this.deptName = val.name.toUpperCase();
        this.employeeMasterTableForm.controls.departmentName.setValue(this.deptName);
      }
    });
  }

  saveEmpMaster() {
    this.reqObj = this.employeeMasterTableForm.value;
    if (!!this.empMaterId) {
      this.configurationService.updateEmpMasterData(this.reqObj, this.empMaterId).subscribe((data: any) => {
        if (data.status === '0') {
          this.empMaterId = null;
          this.employeeMasterTableForm.reset();
          this.getAllEmpMater();
        }
      });
    } else {
      this.configurationService.saveEmpMater(this.reqObj).subscribe((data: any) => {
        if (data.status === '0') {
          this.getAllEmpMater();
          this.employeeMasterTableForm.reset();
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  getAllEmpMater() {
    this.configurationService.getAllEmpMaster().subscribe((data: any) => {
      if (data.status === '0' && data.data['Employee'].length > 0) {
        this.empMaterData = data.data['Employee'];
        this.dataSource = new MatTableDataSource(this.empMaterData);
        this.dataSource.paginator = this.paginator;
      } else {
        this.empMaterData = [];
      }
    });
  }

  editEmpMaster(empId: any, item) {
    this.empMaterId = empId;
    this.employeeMasterTableForm.patchValue(item);
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

  clearFields() {
    this.employeeMasterTableForm.reset();
    this.empMaterId = null;
  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you want to really delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.configurationService.deleteEmpMasterData(id).subscribe((data: any) => {
            if (data.status === '0') {
              this.getAllEmpMater();
            }
          });
        }
      });
  }

  exportAsExcel() {
    this.excelService.exportAsExcelFile(this.empMaterData, 'Employee Master');
  }

  ImportAsExcel(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      const dataString = jsonData;
      if (!!dataString) {
        this.postExcelData(dataString.data);
      }
    };
    reader.readAsBinaryString(file);
  }

  postExcelData(dataString: any) {
    this.bscRestService.saveEmpExcelImportData(dataString).subscribe((data: any) => {
      if (data.status === '0') {
        this.getAllEmpMater();
      }
    }, error => {
      console.log('failed to post');
    });
  }
}
