import {Component, OnInit} from '@angular/core';
import {ApexService} from '../shared/apex.service';
import {BscRestService} from '../shared/rest.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  balanceScoreCardData: any;
  scCode: any;
  scName: any;
  allObjectives: any;
  ObjAnalysis: any;
  objName: any;

  footerLinks = [
    {id: 1, name: 'Objective Story', route: '/strategyreview/objectiveStory'},
    {id: 2, name: 'Theme Story', route: '/strategyreview/themeStory'},
    {id: 3, name: 'Initiative Story', route: '/strategyreview/initiativeStory'},
    {id: 4, name: 'Dashboards', route: '/dashboard'},
    {id: 5, name: 'Action items', route: '/actionItems/actionItem'},
    {id: 6, name: 'Progress reports', route: '/reporting/reports'},
  ];
  strategyCards = [
    {id: 1, name: 'STRATEGY', link: '/strategy/corporateStructure', img: 'assets/images/icons/strategy.png'},
    {id: 2, name: 'STRATEGY MAP', link: '/strategyMap/strategyMap', img: '../../assets/images/icons/strategy_map.png'},
    {id: 3, name: 'BSC', link: '/bsc/bsc', img: 'assets/images/icons/bsc.png'},
    {id: 4, name: 'Industry KPIS', link: '/kpi/kpi', img: 'assets/images/icons/Industry_KPIS.png'},
    {id: 5, name: 'INITIATIVES', link: '/initiatives/initiative', img: 'assets/images/icons/initiatives.png'},
    {id: 6, name: 'ALIGNMENT', link: '/alignments/corporatesbu', img: 'assets/images/icons/Alignment.png'},
    {id: 7, name: 'STRATEGY REVIEWS', link: '/strategyreview/themeStory', img: 'assets/images/icons/Startegy_Reviews.png'},
    {id: 8, name: 'ACTION ITEMS', link: '/actionItems/actionItem', img: 'assets/images/icons/Action_Items.png'},
    {id: 9, name: 'RISK ASSESSMENT', link: '/riskassessments/riskassessment', img: 'assets/images/icons/strategy_Planning.png'},
    {id: 10, name: 'Configs', link: '/configuration/status', img: 'assets/images/icons/strategy_Planning.png'},

  ];

  constructor(private apexService: ApexService,
              private bscRestService: BscRestService,
              private router: Router) {

  }

  ngOnInit() {
    this.getBalanceScoreCard();
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getScName(event: any) {
    this.scCode = event.target.value;
    this.balanceScoreCardData.forEach((val, key) => {
      if (this.scCode === val.code) {
        this.scName = val.name.toUpperCase();
        this.getAllObjectives(this.scCode);
      }
    });
  }

  getAllObjectives(scCode: any) {
    this.bscRestService.getObjectivesByScCode(scCode).subscribe((data: any) => {
      if (data.status === '0') {
        this.allObjectives = data.data['Objective'];
      }
    });
  }

  getAnalysis(analysis: any, name: any) {
    this.ObjAnalysis = analysis;
    this.objName = name;
  }

  redirectToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
