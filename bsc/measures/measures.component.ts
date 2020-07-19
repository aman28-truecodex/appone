import {Component, ElementRef, OnInit, ViewChild, OnChanges, SimpleChanges, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {EmitterService} from '../../shared/emitter.service';
import {AlignmentService} from '../../alignments/alignments.service';
import {BscService} from '../bsc.service';
import {BscRestService} from '../../shared/rest.service';
import {InitiativeService} from '../../initiatives/initiative.service';
import {Util} from '../../shared/utils/util';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {TOOL_TIP_INFO} from '../../constants/tooltipInfoConstants';
import {SimpleModalService} from 'ngx-simple-modal';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ExcelService} from '../../shared/excel.service';
import * as XLSX from 'xlsx';
import {BsDatepickerConfig} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-measures',
  templateUrl: './measures.component.html',
  styleUrls: ['./measures.component.scss']
})
export class MeasuresComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('seriesTag') seriesTag: ElementRef;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['sNo', 'frequency', 'actual', 'target', 'status'];
  codeAndNameSubscription: any;
  codeAndName: any;
  balanceScoreCardData: any;
  orgName: any;
  codeName: any;
  PerspectivesByCode: any;
  AllObjectives: any = [];
  fileName: any;
  fileAsBase64: any;
  errorMessage: any;
  objectivesList: any;
  seriesData: any;
  allMeasures: any;
  scCode: any;
  objectiveName: any;
  ObjCode: any;
  measuresByObj: any;
  showCurrency: boolean;
  allSeries: any = [];
  seriesId: any;
  initiatives: any;
  allKpis: any;
  empMasterData: any;
  kpiData: any = [];
  seriesList: any = [];
  kpiCodes: any = [];
  reqObj: any;
  orgCode: any;
  selectedKpis: any;
  selectedSeries: any;
  measureId: any;
  measureCode: any;
  modalPopUpMeasureSeries: any;
  isEditMeasure: any;
  tooltipInfo = TOOL_TIP_INFO;
  focusedElement: any;
  showPerspectiveWithObjectivesAndMeasures = true;
  @ViewChild('myInput') myInputVariable: ElementRef;
  checkedOptionInSummaryReport = false;
  checkedOptionInDataTables = false;
  strategicMeasureData: any = [];
  elem: any;
  addForm: FormGroup;
  selectedMeasureId: any;
  popUpStrategicMeasureList: any = [];
  measureName: any;
  frequency: any;

  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MM-DD-YYYY',
    showWeekNumbers: false,
    containerClass: 'theme-dark-blue'
  };

  basicMeasureForm = this.formBuilder.group({
    year: [null, this.customValidators.required],
    period: [null, this.customValidators.required],
    orgCode: [null, this.customValidators.required],
    scCode: [null, this.customValidators.required],
    objectiveCode: [null, this.customValidators.required],
    code: [null, this.customValidators.required],
    name: [null],
    description: [null],
    owner: [null],
    collaborator: [null],
    analysis: [null],
    recommendation: [null],
    linkedObjectiveScCode: [null],
    linkedObjectiveName: [''],
    linkedObjectiveCode: [''],
    initiativeList: [null],
    strategicMeasureList: [''],
    linkedKPIs: [''],
    polarity: ['']
  });


  measureDefinationForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    code: ['', [this.customValidators.required]],
    name: ['', [this.customValidators.required]],
    description: [''],
    owner: [null],
    collaborators: [null],
    analysis: [],
    recommendation: [],
    dataSourceType: ['DEFINE_DATA_SOURCE'],
    formula: [''],
    dataSource: [''],
    dataCollector: [null],
    dataQuality: [''],
    frequency: [null],
    leadOrLag: [null],
    polarity: [null, [this.customValidators.required]],
    attachmentUrls: [''],
    strategy: [''],
    linkedObjectiveCode: [null, [this.customValidators.required]],
    linkedObjectiveName: [''],
    linkedObjectiveScCode: [''],
    linkedKPIs: [''],
    allowedSeries: [[]],
    fileName: ['']
  });

  status = [
    {id: 1, status: 'In Progress'},
    {id: 2, status: 'In Transit'},
    {id: 3, status: 'Completed'}
  ];

  polarity = [
    {id: 1, polarity: 'HIGH'},
    {id: 2, polarity: 'LOW'},
    {id: 3, polarity: 'EQUAL'},
    {id: 4, polarity: 'OTHERS'}
  ];

  measureForm = this.formBuilder.group({
    orgCode: [null, [this.customValidators.required]],
    orgName: [''],
    scCode: [null, [this.customValidators.required]],
    scName: [''],
    year: [null],
    period: [null],
    objectiveCode: [null, [this.customValidators.required]],
    objectiveName: ['', [this.customValidators.required]],
    owner: [null],
    collaborators: [null],
    recommendation: [''],
    analysis: ['']
  });

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

  currencyUnit = [
    {id: 1, type: 'USD'},
    {id: 1, type: 'GBP'},
    {id: 1, type: 'INR'},
  ];

  dataType = [
    {id: 1, type: 'Number', showField: false},
    {id: 2, type: 'Text', showField: false},
    {id: 3, type: 'Currency', showField: true},
    {id: 4, type: 'Percentage', showField: false},
    {id: 5, type: 'Accounting', showField: false},
    {id: 6, type: 'Integer', showField: false},
    {id: 7, type: 'Custom', showField: false}
  ];


  seriesForm = this.formBuilder.group({
    name: ['', [this.customValidators.required]],
    dataType: [null],
    frequency: [null],
    currencyType: [''],
    displayInSummaryReports: [''],
    displayInDataTables: [''],
    alias: ['', [this.customValidators.required]],
    formula: ['']
  });

  period = [
    {id: 1, month: 'January'},
    {id: 2, month: 'February'},
    {id: 3, month: 'March'},
    {id: 4, month: 'April'},
    {id: 5, month: 'May'},
    {id: 6, month: 'June'},
    {id: 7, month: 'July'},
    {id: 8, month: 'August'},
    {id: 9, month: 'September'},
    {id: 10, month: 'October'},
    {id: 11, month: 'November'},
    {id: 12, month: 'December'}
  ];

  reportingFrequency = [
    {id: 1, frequency: 'WEEKLY'},
    {id: 2, frequency: 'DAILY'},
    {id: 3, frequency: 'YEARLY'},
    {id: 3, frequency: 'MONTHLY'},
    {id: 3, frequency: 'QUARTERLY'},
    {id: 3, frequency: 'HOURLY'},
  ];

  constructor(private toastrService: ToastrService,
              private formBuilder: FormBuilder,
              private emitterService: EmitterService,
              private alienmentService: AlignmentService,
              private bscService: BscService,
              private initiativeService: InitiativeService,
              private util: Util,
              private customValidators: CustomValidators,
              private simpleModalService: SimpleModalService,
              private renderer: Renderer2,
              private elementRef: ElementRef,
              private excelService: ExcelService,
              private bscRestService: BscRestService) {
    this.measureDefinationForm.controls.linkedKPIs.setValue(this.kpiData)

  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      rows: this.formBuilder.array([])
    });
    this.initGroup();
    this.showCurrency = false;
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllMeasures();
    this.getAllSeries();
    this.getAllKpis();
    this.getAllEmpMasterData();
    this.seriesForm.controls.displayInSummaryReports.setValue(true);
  }

  initGroup(addAdditionalSeries?: any) {
    let rows = this.addForm.get('rows') as FormArray;
    rows.push(this.formBuilder.group({
      frequency: ['', this.customValidators.required],
      actual: [null, this.customValidators.required],
      target: [null, this.customValidators.required],
      status: [null]
    }));
  }


  updateMeasure() {
    this.basicMeasureForm.controls.initiativeList.setValue(this.initiatives);
    this.basicMeasureForm.controls.strategicMeasureList.setValue(this.dataSource.data);
    let rows = this.addForm.get('rows') as FormArray;
    this.bscRestService.updateMeasure(this.selectedMeasureId, this.basicMeasureForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.basicMeasureForm.reset();
          while (rows.length !== 1) {
            rows.removeAt(0);
          }
          this.addForm.reset();
          this.initiatives = [];
          this.strategicMeasureData = [];
          this.dataSource = new MatTableDataSource(this.strategicMeasureData);
        }
      }
    );
  }

  exportSeries() {
    this.excelService.exportAsExcelFile(this.strategicMeasureData,
      `${this.basicMeasureForm.controls.orgCode.value}_${this.basicMeasureForm.controls.scCode.value}_${this.measureName}`);
  }

  addSeries() {
    if (this.addForm.valid) {
      this.strategicMeasureData = this.addForm.value.rows;
      if (!!this.strategicMeasureData && this.strategicMeasureData.length > 0) {
        this.strategicMeasureData.forEach((elem) => {
          this.strategicMeasureData.forEach((series) => {
            series.frequency = this.getDateFromMilliSec(series.frequency);
            series.actual = JSON.parse(series.actual);
            series.target = JSON.parse(series.target);
          });
        });
      }
      this.dataSource = new MatTableDataSource(this.strategicMeasureData);
      this.dataSource.paginator = this.paginator;
    }
  }

  getMeasures(event: any) {
    let kpiCodes = [];
    this.measureCode = event;
    this.measuresByObj.forEach((elem: any) => {
      if (elem.code === this.measureCode) {
        this.selectedMeasureId = elem.id;
        this.measureName = elem.name ? elem.name : 'Strategic Measure';
        this.basicMeasureForm.controls.analysis.setValue(elem.analysis);
        this.basicMeasureForm.controls.recommendation.setValue(elem.recommendation);
        this.basicMeasureForm.controls.polarity.setValue(elem.polarity);
        this.popUpStrategicMeasureList = !!elem.strategicMeasureList ? elem.strategicMeasureList : [];
        this.dataSource = new MatTableDataSource(!!this.popUpStrategicMeasureList ? this.popUpStrategicMeasureList : []);
        if (elem.linkedKPIs.length > 0) {
          elem.linkedKPIs.forEach((kpi: any) => {
            kpiCodes.push(kpi.code);
          });
        } else {
          kpiCodes = [];
        }
        this.basicMeasureForm.controls.linkedKPIs.setValue(kpiCodes);
        this.dataSource.paginator = this.paginator;
        this.basicMeasureForm.controls.name.setValue(elem.name);
      }
    });
    this.addPopUpSeriesData(this.popUpStrategicMeasureList);
  }

  ImportAsExcel(ev) {
    let workBook = null;
    let jsonData = null;
    const dataString = '';
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
      if (!!dataString.data && dataString.data.length > 0) {
        this.popUpStrategicMeasureList.push(...dataString.data);
        this.addPopUpSeriesData(this.popUpStrategicMeasureList);
      } else {
        this.toastrService.error('No records available');
      }
    };
    reader.readAsBinaryString(file);
  }

  openSeriesModalPopUp(id) {
    if (!!this.basicMeasureForm.controls.code.value) {
      this.renderer.setAttribute(this.seriesTag.nativeElement, 'data-target', id);
    } else {
      this.toastrService.error('Please select Measure to add series');
    }
  }

  resetStrategicMeasureForm() {
    this.strategicMeasureData = [];
  }

  clearFieldsForBasicMeasure() {
    this.basicMeasureForm.reset();
  }

  getOrgUnitCode() {
    this.codeAndNameSubscription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
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

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      if (data.status === '0') {
        this.balanceScoreCardData = data.data['Scorecard'];
      }
    });
  }

  onDeleteRow(rowIndex) {
    let rows = this.addForm.get('rows') as FormArray;
    rows.removeAt(rowIndex);
  }

  getCodeAndName() {
    this.codeAndName.forEach((val, key) => {
      if (this.measureDefinationForm.controls.orgCode.value === val.code) {
        this.orgName = val.name.toUpperCase();
        this.orgCode = val.code;
        this.measureDefinationForm.controls.orgName.setValue(this.orgName);
      }
    });
  }

  selectKpi(event: any, kpi, i) {
    if (!!event.target.checked) {
      this.kpiData.push(kpi.code);
      this.kpiCodes.push(kpi.code);
    } else {
      let index = this.kpiData.indexOf(kpi.code);
      this.kpiData.splice(index, 1);
    }
  }

  linkKpis() {
    this.selectedKpis = this.kpiData;
    this.measureDefinationForm.controls.linkedKPIs.setValue(this.kpiCodes);
  }

  selectSeries(event: any, series, i) {
    if (!!event.target.checked) {
      this.seriesList.push(series);
    } else {
      const index = this.seriesList.indexOf(series);
      this.seriesList.splice(index, 1);
    }
  }

  linkSeries() {
    this.selectedSeries = this.seriesList.slice();
    this.measureDefinationForm.controls.allowedSeries.setValue(this.selectedSeries);
  }

  editMeasure(measure) {
    this.kpiCodes = [];
    this.kpiData = [];
    this.measureId = measure.id;
    // this.selectedKpis = measure.linkedKPIs;
    // console.log(this.selectedKpis);
    this.selectedSeries = measure.allowedSeries;
    this.fileName = measure.fileName;
    if (!!measure) {
      if (measure.linkedKPIs.length > 0) {
        measure.linkedKPIs.forEach((kpi: any) => {
          this.kpiData.push(kpi.code);
          this.kpiCodes.push(kpi.code);
        });
      }
      measure.allowedSeries.forEach((series: any) => {
        this.seriesList.push(series);
      });
      this.selectedKpis = this.kpiCodes;
    }
    this.isEditMeasure = true;
    this.measureDefinationForm.patchValue(measure);
  }

  isSelected(value: string): boolean {
    return this.kpiData.indexOf(value) >= 0;
  }

  submitMeasures() {
    if (!!this.measureId) {
      this.measureDefinationForm.controls.linkedKPIs.setValue(this.kpiCodes);
      this.bscService.updateMeasure(this.measureId, this.measureDefinationForm.value).subscribe((data: any) => {
        if (!!data) {
          this.getObjectivesWithMeasures(this.scCode);
          this.measureDefinationForm.reset();
          this.fileName = null;
          this.selectedKpis = [];
          this.selectedSeries = [];
          this.kpiData = [];
          this.isSelected(null);
          this.measureDefinationForm.controls.linkedKPIs.setValue([]);
          this.measureDefinationForm.controls.allowedSeries.setValue([]);
          this.myInputVariable.nativeElement.value = '';
        }
      });
    } else {
      this.bscService.saveMeasureDefination(this.measureDefinationForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.getObjectivesWithMeasures(this.scCode);
          this.measureDefinationForm.reset();
          this.measureDefinationForm.controls.linkedKPIs.setValue([]);
          this.measureDefinationForm.controls.allowedSeries.setValue([]);
          this.selectedKpis = [];
          this.selectedSeries = [];
          this.kpiData = [];
          this.fileName = null;
          this.myInputVariable.nativeElement.value = '';

        }
      });
    }
  }

  getScorecardName() {
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.measureDefinationForm.controls.scCode.value === val.code) {
        this.codeName = val.name.toUpperCase();
        this.scCode = val.code;
        this.measureDefinationForm.controls.scName.setValue(this.codeName);
      }
    });
    this.getObjectivesByScCode();
  }

  getObjectivesByScCode() {
    this.getObjectivesWithMeasures(this.scCode);
  }

  getObjectivesWithMeasures(scCode: any) {
    this.bscService.perspectiveWithObjectiveAndMeasures(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.objectivesList = data.data['Prespectives'];
        this.AllObjectives = [];
        if (this.objectivesList.length > 0) {
          this.objectivesList.forEach((objectiveList: any) => {
            this.AllObjectives.push(...objectiveList['objectiveList']);
            this.showPerspectiveWithObjectivesAndMeasures = false;
          });
        }
      }
    });
  }

  getObjectiveCode(event: any) {
    this.AllObjectives.forEach((obj: any) => {
      if (event.target.value === obj.code) {
        this.measureDefinationForm.controls.linkedObjectiveName.setValue(obj.name);
        this.measureDefinationForm.controls.linkedObjectiveScCode.setValue(obj.scCode);
        this.measureDefinationForm.controls.linkedObjectiveCode.setValue((obj.code));
      }
    });
  }


  uploadLogo(event: any) {
    const reader = new FileReader();
    this.fileName = event.target.files[0].name;
    if (event.target.files[0].size >= 2097152) {
      this.errorMessage = 'File size should be less than 2 MB';
    } else {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileAsBase64 = reader.result;
        this.measureDefinationForm.controls['attachmentUrls'].setValue(this.fileAsBase64);
        this.measureDefinationForm.controls.fileName.setValue(this.fileName);
      };
    }
  }


  /*series*/

  saveSeries() {
    if (!!this.seriesId) {
      this.bscService.updateSeries(this.seriesId, this.seriesForm.value).subscribe((data: any) => {
        this.seriesId = null;
        this.checkedOptionInSummaryReport = false;
        this.checkedOptionInDataTables = false;
        this.getAllSeries();
        this.seriesForm.reset();
      });
    } else {
      this.bscService.saveSeries(this.seriesForm.value).subscribe((data: any) => {
        if (data.status === '0') {
          this.seriesData = data;
          this.seriesForm.reset();
          this.checkedOptionInSummaryReport = false;
          this.checkedOptionInDataTables = false;
          this.getAllSeries();
        }
      });
    }
  }

  getAllSeries() {
    this.bscService.getAllSeries().subscribe((data: any) => {
      if (data.status === '0') {
        this.allSeries = data.data['SeriesList'];
      }
    });
  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you really want to delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteSeries(id).subscribe((data) => {
            this.getAllSeries();
          });
        }
      });
  }

  editSeries(item: any) {
    this.seriesForm.patchValue(item);
    this.seriesId = item.id;
    this.checkedOptionInDataTables = item.displayInDataTables;
    this.checkedOptionInSummaryReport = item.displayInSummaryReports;
  }

  getAllMeasures() {
    this.bscService.getAllMeasures().subscribe((data: any) => {
      if (data.status === '0') {
        this.allMeasures = data.data['Measures'];
      }
    });
  }

  getScCode(event: any) {
    this.scCode = event;
    if (!!this.scCode) {
      this.bscService.getObjectivesByScCode(this.scCode).subscribe((data: any) => {
        if (data.status === '0') {
          this.measuresByObj = [];
          this.AllObjectives = data.data['Objective'];
        }
      });
    }
  }

  getInitiativesByObjectiveCode(objCode: any) {
    if (!!this.scCode && objCode) {
      this.bscService.getInitiativesByObjectives(this.scCode, objCode).subscribe((data: any) => {
        this.initiatives = data.data['Initiative'];
        this.basicMeasureForm.controls.initiativeList.setValue(this.initiatives);
      });
    }
  }

  getDateFromMilliSec(data, hypenSepartedDate?) {
    const date = new Date(data);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    if (hypenSepartedDate && hypenSepartedDate === true) {
      return `${month}-${day}-${year}`;
    } else {
      return `${month}/${day}/${year}`;
    }
  }

  addPopUpSeriesData(seriesData) {
    let rows = this.addForm.get('rows') as FormArray;
    if (!!seriesData && seriesData.length > 0) {
      while (rows.length !== 0) {
        rows.removeAt(0);
      }
      seriesData.forEach(series => {
        const fb = this.buildGroup();
        fb.patchValue(series);
        const freq = series.frequency.split('/').join('-');
        fb.controls.frequency.setValue(freq);
        this.strategicMeasureData = seriesData;
        rows.push(fb);
      });
    } else {
      console.log('no series found please add');
    }
  }


  buildGroup() {
    return this.formBuilder.group({
      actual: [],
      target: [],
      status: [],
      frequency: []
    });
  }

  getNameForObjective(event) {
    this.ObjCode = event;
    this.popUpStrategicMeasureList = [];
    this.dataSource = new MatTableDataSource(this.popUpStrategicMeasureList);
    this.AllObjectives.forEach((val, key) => {
      if (this.ObjCode === val.code) {
        this.objectiveName = val.name.toUpperCase();
        this.basicMeasureForm.controls.linkedObjectiveName.setValue(val.name);
        this.basicMeasureForm.controls.linkedObjectiveCode.setValue(val.code);
        this.basicMeasureForm.controls.linkedObjectiveScCode.setValue(val.scCode);
      }
    });
    if (!!this.ObjCode) {
      this.getMeasuresByObjectiveAndScCode();
      this.getInitiativesByObjectiveCode(this.ObjCode);
    }
  }

  getAllKpis() {
    this.bscService.getKPIMaster().subscribe((data: any) => {
      this.allKpis = data.data['KPIMaster'];
    });
  }

  getMeasuresByObjectiveAndScCode() {
    this.measuresByObj = [];
    this.bscService.getMeasuresByObjectives(this.ObjCode, this.basicMeasureForm.controls.scCode.value).subscribe((data: any) => {
      if (data.status === '0') {
        this.measuresByObj = data.data['Measures'];
      }
    });
  }

  showCurrencyField(event: any) {
    this.dataType.forEach((val, key) => {
      if (this.seriesForm.controls.dataType.value === val.type) {
        this.showCurrency = val.showField;
      }
    });
    this.showCurrency = this.showCurrency ? this.showCurrency : false;
  }

  //
  // deleteMeasure(measureId: any) {
  //   this.bscService.deleteMeasure(measureId).subscribe((data: any) => {
  //     if (data.status === '0') {
  //       this.getObjectivesByScCode();
  //     }
  //   });
  // }


  deleteMeasure(measureId: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you really want to delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscService.deleteMeasure(measureId).subscribe((data: any) => {
            if (data.status === '0') {
              this.getObjectivesByScCode();
            }
          });
        }
      });
  }

  getAllEmpMasterData() {
    this.bscService.getEmpMasterData().subscribe((data: any) => {
      if (data.status === '0') {
        this.empMasterData = data.data['Employee'];
      }
    });
  }

  clearFields() {
    this.measureId = null;
    this.fileName = null;
    this.measureDefinationForm.reset();
    this.selectedSeries = [];
    this.selectedKpis = [];
    this.myInputVariable.nativeElement.value = '';
  }

  clearSeriesFields() {
    this.seriesForm.reset();
    this.seriesId = null;
    this.checkedOptionInSummaryReport = false;
    this.checkedOptionInDataTables = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getMeasures(this.measureCode);
  }

}
