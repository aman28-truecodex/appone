import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
import {ApexService} from '../../apex.service';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnChanges, OnDestroy, OnInit {
  @Input() headerData: any;
  headerSubsciption: any;
  changeFileData: any;
  showHeader: any;
  linkActiveIndex: any;
  headerLinks = [
    {
      id: 1,
      name: 'strategy',
      link: '/strategy/corporateStructure',
      img: 'assets/images/icons/strategy_white.png',
      imgOverlay: 'assets/images/icons/strategy.png',
      children: [
        // {id: 1, name: 'Organization overview', route: '/strategy/overview', class: 'active'},
        {id: 2, name: 'Organization Structure', route: '/strategy/corporateStructure'},
        {id: 3, name: 'Strategry Analysis', route: '/strategy/strategyAnalysis'},
        {id: 3, name: 'Strategry Projection', route: '/strategy/strategyProjection'},
        {id: 4, name: 'Value Gap', route: '/strategy/valueGap'},
        {id: 5, name: 'Value Gap Closer', route: '/strategy/valueGapCloser'}]
    },
    {
      id: 2,
      name: 'strategyMap',
      link: '/strategyMap/strategyMap',
      img: 'assets/images/icons/strategy_map_white.png',
      imgOverlay: 'assets/images/icons/strategy_map.png',
      children: [{id: 1, name: 'strategyMap', route: '/strategyMap/strategyMap', class: 'active'}]
    },
    {
      id: 3,
      name: 'bsc',
      link: '/bsc/bsc',
      img: 'assets/images/icons/bsc_white.png',
      imgOverlay: 'assets/images/icons/bsc.png',
      children: [
        {id: 1, name: 'Balance Scorecard', route: '/bsc/bsc', class: 'active'},
        {id: 2, name: 'Perspective', route: '/bsc/perspective'},
        {id: 3, name: 'Themes', route: '/bsc/themes'},
        {id: 4, name: 'Objectives', route: '/bsc/objectives'},
        {id: 6, name: 'Measures', route: '/bsc/measures'}]
    },
    {
      id: 4,
      name: 'Industry KPI',
      link: '/kpi/kpi',
      img: 'assets/images/icons/bsc_white.png',
      imgOverlay: 'assets/images/icons/bsc.png',
      children: [
        {id: 1, name: 'Kpi', route: '/kpi/kpi'}]
    },
    {
      id: 5,
      name: 'initiatives',
      link: '/initiatives/initiative',
      img: 'assets/images/icons/initiatives_white.png',
      imgOverlay: 'assets/images/icons/initiatives.png',
      children: [
        {id: 1, name: 'initiative', route: '/initiatives/initiative'},
        {id: 2, name: 'milestones', route: '/initiatives/milestones'},
        {id: 3, name: 'ganttChart', route: '/initiatives/ganttChart'}]
    }, {
      id: 6,
      name: 'alignments',
      link: '/alignments/corporatesbu',
      img: 'assets/images/icons/Alignment_white.png',
      imgOverlay: 'assets/images/icons/Alignment.png',
      children: [
        {id: 1, name: 'Corporate-SBU', route: '/alignments/corporatesbu', class: 'active'},
        {id: 2, name: 'Corporate Unit - SBU Unit ', route: '/alignments/corporatetosbu'},
        {id: 3, name: 'Corporate-Board', route: '/alignments/corporatetoboard'},
        {id: 4, name: 'SBU-SBU', route: '/alignments/sbutosbu'},
        {id: 5, name: 'HR-Alignment', route: '/alignments/hralignment'},
        {id: 6, name: 'IT-Alignment', route: '/alignments/italignment'}]
    }, {
      id: 7,
      name: 'strategy review',
      link: '/strategyreview/themeStory',
      img: 'assets/images/icons/Startegy_Reviews_white.png',
      imgOverlay: 'assets/images/icons/Startegy_Reviews.png',
      children: [
        {id: 1, name: 'theme story', route: '/strategyreview/themeStory'},
        {id: 2, name: 'objective story', route: '/strategyreview/objectiveStory'},
        {id: 3, name: 'initiative story', route: '/strategyreview/initiativeStory'}]
    },
    {
      id: 8,
      name: 'action items',
      link: '/actionItems/actionItem',
      img: 'assets/images/icons/b.png',
      imgOverlay: 'assets/images/icons/Action_Items.png',
      children: [
        {id: 1, name: 'action', route: '/actionItems/actionItem'}
      ]
    }, {
      id: 9,
      name: 'risk assessment',
      link: '/riskassessments/riskassessment',
      img: 'assets/images/icons/b.png',
      imgOverlay: 'assets/images/icons/Action_Items.png',
      children: [
        {id: 1, name: 'risk', route: '/riskassessments/riskassessment'}
      ]
    },
    {
      id: 10,
      name: 'configuration',
      link: '/configuration/status',
      img: 'assets/images/icons/b.png',
      imgOverlay: 'assets/images/icons/Action_Items.png',
      children: [
        {id: 1, subclass:'status',nam: 'status', route: '/configuration/status'},
        {id: 2, subclass1:'employeemaster',nam: 'employeeMaster', route: '/configuration/employeeMaster'},
        {id: 3, subclass2:'createuser',nam: 'createUser', route: '/configuration/createUser'}
      ]
    }
  ];

  constructor(private apexService: ApexService,
              private router: Router) {

  }

  ngOnInit() {
    this.headerSubsciption = this.apexService.sessionUserEvent().subscribe(data => {
      this.showHeader = data;
    });
    this.changeFileData = this.headerData;
  }

  activeLink(id: any, i) {
    this.linkActiveIndex = i;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnChanges(changes: any) {
    if (changes['headerData'] && this.headerData) {
      this.changeFileData = this.headerData;
    }
  }

  ngOnDestroy() {
    this.headerSubsciption.unsubscribe();
  }
}
