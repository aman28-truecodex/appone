import {Component, OnInit, Inject} from '@angular/core';
import {ApexService} from './shared/apex.service';
import {Router, NavigationStart} from '@angular/router';
import {Location} from '@angular/common';
import {WINDOW} from './shared/window.service';
import {BscRestService} from './shared/rest.service';
import {EmitterService} from './shared/emitter.service';
import {ToastrService} from 'ngx-toastr';
import {HELP_FILE} from './constants/helpFileConstants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader: any = false;
  pageLevelHelp: any;
  maplocation = [
    '/',
    '/login',
    '/dashboard',
    '/createuser',
    '/forgotpassword',
    '/resetPassword'
  ];
  path: any;
  helpFileData = HELP_FILE;

  constructor(private apexService: ApexService,
              private router: Router,
              private location: Location,
              private bscRestService: BscRestService,
              private emitterService: EmitterService,
              @Inject(WINDOW) private window: Window,
              private toastrService: ToastrService) {
    this.onDetectRoute();
  }

  ngOnInit() {
    this.getOrgCodes();
  }

  getOrgCodes() {
    if (!!sessionStorage.getItem('access_token')) {
      this.bscRestService.getCodeAndName().subscribe((data: any) => {
        if (data.status === '0') {
          this.emitterService.broadcastOrgUnitCode(data.data['OrganisationList']);
        }
      });
    }

  }

  onDetectRoute() {
    this.router.events.subscribe((event: any) => {
      if ((event instanceof NavigationStart)) {
        this.path = this.location.path();
        let count = this.maplocation.length;
        for (let i = 0; i < this.maplocation.length; i++) {
          if (event.url.includes('resetPassword') || event.url === this.maplocation[i]) {
            this.showHeader = false;
            i = count++;
          } else {
            this.showHeader = true;
          }
        }
        this.showHelpFileData(event.url);
      }
      window.scrollTo(0, 0);
    });
  }

  showHelpFileData(url: any) {
    this.helpFileData = HELP_FILE;
    switch (url) {
      case '/strategy/corporateStructure':
        this.pageLevelHelp = HELP_FILE.ORGANIZATION_PAGE;
        break;
      case '/strategy/strategyAnalysis':
        this.pageLevelHelp = HELP_FILE.STRATEGY_ANALYSIS_PAGE;
        break;
      case '/strategy/strategyProjection':
        this.pageLevelHelp = HELP_FILE.STRATEGY_PROJECTION_PAGE;
        break;
      case '/strategy/valueGap':
        this.pageLevelHelp = HELP_FILE.VALUE_GAP_PAGE;
        break;
      case '/bsc/bsc':
          this.pageLevelHelp = HELP_FILE.BALANCE_SCORECARD_PAGE;
          break;
      case'/bsc/perspective':
          this.pageLevelHelp = HELP_FILE.PERSPECTIVE;
          break;
      default :
        this.pageLevelHelp = {};
    }
  }
}

