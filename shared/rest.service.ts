import {Injectable} from '@angular/core';
import {AppService} from './app.service';
import {HttpService} from './http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class BscRestService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private security_url = '/oauth/token';
  private forgotPassword_url = '/user/forgotPassword';
  private resetPassword_url = '/user/reset';
  private balanceScoreCard_url = '/scorecard';
  private strategy_map_url = '/strategymap';
  private perspective_url = '/scorecard/perspective';
  private theme_url = '/scorecard/theme';
  private objective_url = '/scorecard/objective';
  private get_objectives_by_theme_url = '/scorecard/objective/sccode';
  private initiatives_scorecard = '/initiative/scorecard';
  private kpi_master = '/kpimaster';
  private measure_defination = '/scorecard/measure';
  private series_url = '/series';
  private measures_by_obj = '/scorecard/measure/objectivecode';
  private get_all_initiatives = '/initiative';
  private emp_master_url = '/employee';
  private objective_story = '/objectivestory';
  private theme_story = '/themestory';
  private initiative_story = '/initiativestory';
  private report = '/report/balancescorecard';
  private organization_url = '/organization';
  private organizationTree_url = '/organization/tree';
  private organizationByCode_url = '/organization/code';
  private organizationCodeAndName_url = '/organization/codeAndName';
  private strategyAnalysis_url = '/strategy/analysis';
  private strategyProjection_url = '/strategicprojection';
  private import_excel = '/strategicprojection/import';
  private import_emp_excel = '/employee/import';
  private valueGap_url = '/valuegap';
  private valueGapCloser_url = '/valuegapcloser';
  private productGroup_url = '/productgroup';
  private projection_Excel_data = '/strategicprojection/export';
  private valuegap_excel_data = '/valuegap/export';
  private create_user = '/user';
  private create_default_user = '/user/defaultcreation';
  private milestone_url = '/initiative/milestone';
  private getAllReportNames = '/report/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('client:secret')
    })
  };

  constructor(private http: HttpService, private appService: AppService) {
  }

  /*auth apis*/

  login(data: any) {
    return this.http.postSecurity(this.security_url, data);
  }

  createUser(data: any) {
    return this.http.post(this.create_user, data);
  }

  createDefaultUser(data: any) {
    return this.http.post(this.create_default_user, data);
  }

  sendForgotPasswordEmail(email: any) {
    return this.http.post(`${this.forgotPassword_url}?email=${email}`, null);
  }

  resetPassword(password: any, token: any) {
    return this.http.post(`${this.resetPassword_url}?newPassword=${password}&resetToken=${token}`, null);
  }

  updateUser(data: any, id?: any) {
    return this.http.put(this.create_user + '/' + id, data);
  }


  getUsers() {
    return this.http.get(this.create_user, null);
  }

  deleteUserData(id: any) {
    return this.http.delete(this.create_user + '/' + id, null);
  }

  /*auth apis ends*/

  /*common apis*/

  getEmpMasterData() {
    return this.http.get(this.emp_master_url, null);
  }

  /*common apis end*/


  /*organization structure*/

  saveOrganization(data: any) {
    return this.http.post(this.organization_url, data);
  }

  UpdateOrganization(data: any, id?: any) {
    return this.http.put(this.organization_url + '/' + id, data);
  }

  deleteOrganization(id: any) {
    return this.http.delete(this.organization_url + '/' + id, null);
  }

  getOrganizationTree() {
    return this.http.get(this.organizationTree_url, null);
  }

  getCodeAndName() {
    return this.http.get(this.organizationCodeAndName_url, null);
  }

  getOrganizationByCode(data: any) {
    return this.http.get(this.organizationByCode_url, data);
  }

  getOrganizationById(id: any) {
    return this.http.getById(this.organization_url + '/' + id);
  }

  getParentOrganizationByCode(id: any) {
    return this.http.getById(this.organizationByCode_url + '/' + id);
  }

  getSubUnitById(id) {
    return this.http.getById(this.organization_url + '/' + id);
  }

  saveSwotAnalysis(data: any) {
    return this.http.post(this.strategyAnalysis_url, data);
  }

  savePestelAnalysis(data: any) {
    return this.http.post(this.strategyAnalysis_url, data);
  }

  getStretegyAnalysis(code: any, year: any, version: any, type: any) {
    return this.http.get(this.strategyAnalysis_url + '/' + code + '/' + year + '/' + version + '/' + type, null);
  }

  UpdateAnalysis(data: any, id: any) {
    return this.http.put(this.strategyAnalysis_url + '/' + id, data);
  }

  UpdatePestelAnalysis(data: any, id: any) {
    return this.http.put(this.strategyAnalysis_url + '/' + id, data);
  }

  getRevenueAmount(code: any, productgrp: any, year: any, version: any) {
    return this.http.get(this.strategyProjection_url + '/' + code + '/' + productgrp + '/' + year + '/' + version, null);
  }

  getRevenueGap(code: any, productgrp: any, year: any, version: any) {
    return this.http.get(this.valueGap_url + '/' + code + '/' + productgrp + '/' + year + '/' + version, null);
  }

  saveStrategyProjection(data: any) {
    return this.http.post(this.strategyProjection_url, data);
  }

  saveExcelImportData(data: any) {
    return this.http.post(this.import_excel, data);
  }

  saveEmpExcelImportData(data: any) {
    return this.http.post(this.import_emp_excel, data);
  }


  UpdateStrategyProjection(data: any, id: any) {
    return this.http.put(this.strategyProjection_url + '/' + id, data);
  }

  getAllStrategyProjection() {
    return this.http.get(this.strategyProjection_url, null);
  }

  getAllStrategyProjectionForExcel() {
    return this.http.get(this.projection_Excel_data, null);
  }

  deleteStrategyProjection(id: any) {
    return this.http.delete(this.strategyProjection_url + '/' + id, null);
  }

  getValueGap() {
    return this.http.get(this.valueGap_url, null);
  }


  saveValueGap(data: any) {
    return this.http.post(this.valueGap_url, data);
  }

  deleteValueGap(id: any) {
    return this.http.delete(this.valueGap_url + '/' + id, null);
  }

  updateValueGap(data: any, id: any) {
    return this.http.put(this.valueGap_url + '/' + id, data);
  }

  getValueGapCloser() {
    return this.http.get(this.valueGapCloser_url, null);
  }

  getValueGapExcelData() {
    return this.http.get(this.valuegap_excel_data, null);
  }

  saveValueGapCloser(data: any) {
    return this.http.post(this.valueGapCloser_url, data);
  }

  updateValueGapCloser(data: any, id: any) {
    return this.http.put(this.valueGapCloser_url + '/' + id, data);
  }

  deleteValueGapCloser(id: any) {
    return this.http.delete(this.valueGapCloser_url + '/' + id, null);
  }

  deleteInitiaitve(id: any) {
    return this.http.delete(this.get_all_initiatives + '/' + id, null);
  }

  deleteMilestone(id: any) {
    return this.http.delete(this.milestone_url + '/' + id, null);
  }

  getAllProductGroup() {
    return this.http.get(this.productGroup_url, null);
  }

  updateProductGroup(data: any, id: any) {
    return this.http.put(this.productGroup_url + '/' + id, data);
  }

  saveProductGroup(data: any) {
    return this.http.post(this.productGroup_url, data);
  }


  /*organization structure end*/


  saveBalanceScoreCard(data: any) {
    return this.http.post(this.balanceScoreCard_url, data);
  }

  saveScoreCardTheme(data: any) {
    return this.http.post(this.theme_url, data);
  }

  saveObjective(data: any) {
    return this.http.post(this.objective_url, data);
  }

  UpdateBalanceScoreCard(data: any, id?: any) {
    return this.http.put(this.balanceScoreCard_url + '/' + id, data);
  }

  updateTheme(data: any, id: any) {
    return this.http.put(this.theme_url + '/' + id, data);
  }

  getThemes() {
    return this.http.get(this.theme_url, null);
  }

  updatePerspective(data: any, id: any) {
    return this.http.put(this.perspective_url + '/' + id, data);
  }

  getBalanceScoreCard() {
    return this.http.get(this.balanceScoreCard_url, null);
  }

  getAllObjectives() {
    return this.http.get(this.objective_url, null);
  }

  getAllInitiatives() {
    return this.http.get(this.get_all_initiatives, null);
  }


  updateInitiative(data: any, id: any) {
    return this.http.put(this.get_all_initiatives + '/' + id, data);
  }

  getInitiativeById(id) {
    return this.http.get(this.get_all_initiatives + '/' + id, null);
  }

  getAllObjectivesByScCode(code) {
    return this.http.get(this.objective_url + '/sccode/' + code, null);
  }

  deleteBalanceScoreCard(id: any) {
    return this.http.delete(this.balanceScoreCard_url + '/' + id, null);
  }

  getPerspective() {
    return this.http.get(this.perspective_url, null);
  }

  getPerspectivesByCode(code: any) {
    return this.http.get(this.balanceScoreCard_url + '/' + code + '/perspective', null);
  }

  getThemeByCode(code: any) {
    return this.http.get(this.balanceScoreCard_url + '/' + code + '/theme', null);
  }

  deletePerspective(id: any) {
    return this.http.delete(this.perspective_url + '/' + id, null);
  }

  deleteTheme(id: any) {
    return this.http.delete(this.theme_url + '/' + id, null);
  }

  UpdatePerspective(data?: any, id?: any) {
    return this.http.put(this.balanceScoreCard_url + '/' + id, data);
  }

  savePerspective(data: any) {
    return this.http.post(this.perspective_url, data);
  }

  setProjType(type: any) {
    return this.projType = type;
  }

  getProjType() {
    return this.projType;
  }

  saveKpiMaster(data: any) {
    return this.http.post(this.kpi_master, data);
  }

  getKPIMaster() {
    return this.http.get(this.kpi_master, null);
  }

  deleteKPIMaster(id: any) {
    return this.http.delete(this.kpi_master + '/' + id, null);
  }

  updateKPIMaster(id?: any, data?: any) {
    return this.http.put(this.kpi_master + '/' + id, data);
  }

  saveMeasureDefination(data: any) {
    return this.http.post(this.measure_defination, data);
  }

  updateMeasure(id?: any, data?: any) {
    return this.http.put(this.measure_defination + '/' + id, data);
  }

  perspectiveWithObjective(code: any) {
    return this.http.get(`${this.balanceScoreCard_url}/${code}/perspective?perspectiveWithObjective=true`, null);
  }

  saveStrategyMap(data: any) {
    return this.http.post(this.strategy_map_url, data);
  }

  perspectiveWithObjectiveAndMeasures(code: any) {
    return this.http.get(`${this.balanceScoreCard_url}/${code}/perspective?perspectiveWithObjective=true&objectiveWithMeasure=true`, null);
  }

  deleteObjective(id: any) {
    return this.http.delete(this.objective_url + '/' + id, null);
  }

  updateObjective(id?: any, data?: any) {
    return this.http.put(this.objective_url + '/' + id, data);
  }

  getAllObjectivesforAScorecard(scoreCardCode, themeCode) {
    return this.http.get(`${this.get_objectives_by_theme_url}/${scoreCardCode}/thcode/${themeCode}`, null);
  }

  getAllInitiativesforAScorecard(scoreCardCode, themeCode) {
    return this.http.get(`${this.initiatives_scorecard}/${scoreCardCode}/theme/${themeCode}`, null);
  }

  getInitiativesAndMilestone(code) {
    return this.http.get(this.initiatives_scorecard + '/' + code + '?initiativeWithMilestone=true', null);
  }

  getInitiativesByScorecard(code) {
    return this.http.get(this.initiatives_scorecard + '/' + code, null);
  }

  getMilestone() {
    return this.http.get(this.milestone_url, null);
  }

  getMilestoneById(id) {
    return this.http.get(this.milestone_url + '/' + id, null);
  }

  updateMilestone(id?: any, data?: any) {
    return this.http.put(this.milestone_url + '/' + id, data);
  }

  /*series*/

  saveSeries(data: any) {
    return this.http.post(this.series_url, data);
  }

  getAllSeries() {
    return this.http.get(this.series_url, null);
  }

  deleteSeries(id: any) {
    return this.http.delete(this.series_url + '/' + id, null);
  }

  updateSeries(id?: any, data?: any) {
    return this.http.put(this.series_url + '/' + id, data);
  }

  /*measures*/

  getAllMeasures() {
    return this.http.get(this.measure_defination, null);
  }

  /*theme story*/

  saveThemeStory(data: any) {
    return this.http.post(this.theme_story, data);
  }

  saveObjectiveStory(data: any) {
    return this.http.post(this.objective_story, data);
  }

  saveInitiativeStory(data: any) {
    return this.http.post(this.initiative_story, data);
  }

  getThemesByScCode(scCode) {
    return this.http.get(this.balanceScoreCard_url + '/' + scCode + '/' + 'theme', null);
  }

  getObjectivesByScCode(scCode) {
    return this.http.get(this.get_objectives_by_theme_url + '/' + scCode, null);
  }

  getAllInitiativeReportNames(year, period) {
    return this.http.get(this.getAllReportNames + year + '/' + period + '/initiativeSummary', null);
  }

  getInitiativesByObjectives(scCode, objCode) {
    return this.http.get(this.initiatives_scorecard + '/' + scCode + '/objective/' + objCode, null);
  }

  getMeasuresByObjectives(objCode) {
    return this.http.get(this.measures_by_obj + '/' + objCode, null);
  }

  deleteMeasure(id: any) {
    return this.http.delete(this.measure_defination + '/' + id, null);
  }

  /*reports*/

  getReports(data: any) {
    return this.http.post(this.report, data);
  }


  /*basic measure end*/
}
