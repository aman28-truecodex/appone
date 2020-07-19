import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  constructor() {
  }


  multi: any[];

  view: any[] = [600, 300];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public single = [
    {
      'name': 'China',
      'value': 2243772
    },
    {
      'name': 'USA',
      'value': 1126000
    },
    {
      'name': 'Norway',
      'value': 296215
    },
    {
      'name': 'Japan',
      'value': 257363
    },
    {
      'name': 'Germany',
      'value': 196750
    },
    {
      'name': 'France',
      'value': 204617
    }
  ];


 public singlee = [
    {
      'name': 'Germany',
      'value': 8940000
    },
    {
      'name': 'USA',
      'value': 5000000
    },
    {
      'name': 'France',
      'value': 7200000
    }

  ];
  public multii = [
    {
      'name': 'Kothapalem',
      'series': [
        {
          'name': 'InTransit',
          'value': 7300000
        },
        {
          'name': 'Idle',
          'value': 8940000
        },
        {
          'name': 'Delevered',
          'value': 894000
        }
      ]
    },
    {
      'name': 'Lalpuram',
      'series': [
        {
          'name': 'InTransit',
          'value': 730000
        },
        {
          'name': 'Idle',
          'value': 8940000
        },
        {
          'name': 'Delevered',
          'value': 89400
        }
      ]
    },
    {
      'name': 'Challavaripuram',
      'series': [
        {
          'name': 'InTransit',
          'value': 7300000
        },
        {
          'name': 'Idle',
          'value': 894000
        },
        {
          'name': 'Delevered',
          'value': 8940
        }
      ]
    },

  ];

  ngOnInit() {
  }

}
