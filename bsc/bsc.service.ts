import {Injectable} from '@angular/core';
import {AppService} from '../shared/app.service';
import {HttpService} from '../shared/http.service';
import {HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';

@Injectable()
export class BscService {
  headers: HttpHeaders;
  props: Props = Props;
  projType;

  private balanceScoreCard_url = '/scorecard';
  private perspective_url = '/scorecard/perspective';
  private theme_url = '/scorecard/theme';
  private subTheme_url = '/scorecard';
  private objective_url = '/scorecard/objective';
  private get_objectives_by_theme_url = '/scorecard/objective/sccode';
  private get_initiatives_by_theme_url = '/initiative/scorecard';
  private kpi_master = '/kpimaster';
  private measure_defination = '/scorecard/measure';
  private series_url = '/series';
  private measures_by_obj = '/scorecard/measure/objectivecode';
  private measures_by_obj_scCode = '/scorecard/measure/sccode/';
  private get_initiatives_by_objective = '/initiative/scorecard';
  private get_all_initiatives = '/initiative';
  private emp_master_url = '/employee';
  private get_inititiative_by_sc = '/initiative/scorecard';
  private objective_story = '/objectivestory';
  private theme_story = '/themestory';
  private initiative_story = '/initiativestory';
  private report = '/report/balancescorecard';
  private getAllReportNames = '/report/';

  constructor(private http: HttpService, private appService: AppService) {
  }

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
    return this.http.get(this.subTheme_url + '/' + code + '/theme', null);
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
    return this.http.get(`${this.get_initiatives_by_theme_url}/${scoreCardCode}/theme/${themeCode}`, null);
  }

  getInitiativesAndMilestone(code) {
    return this.http.get(this.get_inititiative_by_sc + '/' + code + '?initiativeWithMilestone=true', null);
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

  getInitiativesByObjectives(scCode, objCode) {
    return this.http.get(this.get_initiatives_by_objective + '/' + scCode + '/objective/' + objCode, null);
  }

  getMeasuresByObjectives(objCode, scCode) {
    return this.http.get(`${this.measures_by_obj_scCode}${scCode}/objectivecode/${objCode}`, null);
  }

  deleteMeasure(id: any) {
    return this.http.delete(this.measure_defination + '/' + id, null);
  }

  getEmpMasterData() {
    return this.http.get(this.emp_master_url, null);
  }

  /*reports*/

  getReports(data: any) {
    return this.http.post(this.report, data);
  }

  getAllThemeReportNames(year, period) {
    return this.http.get(this.getAllReportNames + year + '/' + period + '/themeSummary', null);
  }

  getAllObjectiveReportNames(year, period) {
    return this.http.get(this.getAllReportNames + year + '/' + period + '/objectiveSummary', null);
  }
}
