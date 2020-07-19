import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerLinks = [
    {id: 1, name: 'Objective Story', route: '/strategyreview/objectiveStory'},
    {id: 2, name: 'Theme Story', route: '/strategyreview/themeStory'},
    {id: 3, name: 'Initiative Story', route: '/strategyreview/initiativeStory'},
    {id: 4, name: 'Dashboards', route: '/dashboard'},
    {id: 5, name: 'Action items', route: '/actionItems/actionItem'},
    {id: 6, name: 'Progress reports', route: '/reporting/reports'},

  ];

  constructor() {
  }

  ngOnInit() {
  }

}
