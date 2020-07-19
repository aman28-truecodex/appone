import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BscRestService} from '../../shared/rest.service';
import {error} from '@angular/compiler/src/util';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-strategy-preview',
  templateUrl: './strategy-preview.component.html',
  styleUrls: ['./strategy-preview.component.scss']
})
export class StrategyPreviewComponent implements OnInit {
  isStepOne: boolean;
  isStepTwo: boolean;
  isStepThree: boolean;
  selectedIndex = true;
  organizationData: any = {};
  mergeArrays: any = [];
  orgTree: any = [];
  getById: any;
  noContentFound: string;
  logoUrl = '';
  missionVisionValues = [{
    slug: 'Mission',
    title: 'Mission',
    content: 'Your Dashboard',
    tab: 'tabOne',
    img_white: '../../../assets/images/icons/mission_white.png',
    img_black: '../../../assets/images/icons/mission_black.png'
  }, {
    slug: 'Vision',
    title: 'Vision',
    content: 'Dynamic content 1',
    tab: 'tabTwo',
    img_white: '../../../assets/images/icons/vision_white.png',
    img_black: '../../../assets/images/icons/vision_black.png'
  }, {
    slug: 'Values',
    title: 'Values',
    content: 'Dynamic content 2',
    tab: 'tabThree',
    img_white: '../../../assets/images/icons/value_white.png',
    img_black: '../../../assets/images/icons/values_black.png'
  }];
  orgId: any;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private toasterService: ToastrService,
              private bscRestService: BscRestService) {
    this.showTab('tabOne', 0);
  }

  ngOnInit() {
    this.getOrganizationTree();
    this.activatedRoute.queryParams.subscribe(params => {
      this.orgId = params['id'];
      if (!!this.orgId) {
        this.getOrganizationById(this.orgId);
      }
    });
  }

  getOrganizationById(id) {
    this.bscRestService.getOrganizationById(id).subscribe((organizationData: any) => {
      if (!!organizationData) {
        this.organizationData = organizationData.data['Organisation'];
        this.logoUrl = this.organizationData.logoUrl;
      }

    });
  }

  getOrganization(id: any) {
    this.bscRestService.getOrganizationById(id).subscribe((parentOrgData: any) => {
      if (parentOrgData.status === '0') {
        this.organizationData = parentOrgData.data['Organisation'];
        this.logoUrl = this.organizationData.logoUrl;
      }
    });
  }

  getOrganizationTree() {
    this.orgTree = [];
    this.bscRestService.getOrganizationTree().subscribe((orgTree: any) => {
      if (orgTree.status === '0') {
        this.orgTree.push(orgTree.data['OrganisationList']);
        this.orgTree.forEach((val) => {
          val.children.forEach((children, i) => {
            if (children.children.length) {
              this.mergeArrays.push(children.children);
              if (this.mergeArrays[0][0].id) {
                this.getById = this.mergeArrays[0][0].id;
              } else {
                this.noContentFound = 'Please Add an Organization';
              }
            }
          });
        });
      }
    });
  }

  showTab(tab, index) {
    switch (tab) {
      case 'tabOne':
        this.isStepOne = true;
        this.isStepTwo = false;
        this.isStepThree = false;
        break;
      case 'tabTwo':
        this.isStepOne = false;
        this.isStepTwo = true;
        this.isStepThree = false;
        break;
      case 'tabThree':
        this.isStepOne = false;
        this.isStepTwo = false;
        this.isStepThree = true;
        break;
      default:
        this.isStepOne = true;
        this.isStepTwo = false;
        this.isStepThree = false;
        break;
    }
    this.selectedIndex = index;
  }

  getSubUnitById(id: any) {
    this.bscRestService.getSubUnitById(id).subscribe((data: any) => {
      if (data.status === '0') {
        this.organizationData = data.data['Organisation'];
        this.logoUrl = data.data['Organisation'].logoUrl;
      }
    }, error => {
      this.toasterService.error('Unable to fetch sub unit data, please try again');
    });
  }

  editOrganization() {
    this.router.navigate(['/strategy/corporateStructure'], {queryParams: {id: this.organizationData.id}});
  }

  addOrganization() {
    this.router.navigate(['/strategy/corporateStructure'], {queryParams: {id: null}});
  }

  getGroupCompDetails(groupCompId: any) {
    if (!!groupCompId) {
      this.getSubUnitById(groupCompId);
    }
  }

  // deleteOrg(id: any) {
  //   this.strategyService.deleteOrganization(id).subscribe((data: any) => {
  //     if (!!data) {
  //       this.getOrganizationTree();
  //       this.organizationData = '';
  //     }
  //   });
  // }
}
