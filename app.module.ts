import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {TagInputModule} from 'ngx-chips';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './shared/components/header/header.component';
import {SubheaderComponent} from './shared/components/subheader/subheader.component';
import {WINDOW_PROVIDERS} from './shared/window.service';
import {FooterComponent} from './shared/components/footer/footer.component';
import {LoginComponent} from './auth/login/login.component';
import {AppService} from './shared/app.service';
import {OverviewComponent} from './strategy/overview/overview.component';
import {CorporateStructureComponent} from './strategy/corporate-structure/corporate-structure.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StrategyPreviewComponent} from './strategy/strategy-preview/strategy-preview.component';
import {StrategyAnalysisComponent} from './strategy/strategy-analysis/strategy-analysis.component';
import {StrategyProjectionComponent} from './strategy/strategy-projection/strategy-projection.component';
import {StrategyComponent} from './strategy/strategy.component';
import {ValueGapComponent} from './strategy/value-gap/value-gap.component';
import {ValueGapCloserComponent} from './strategy/value-gap-closer/value-gap-closer.component';
import {EmitterService} from './shared/emitter.service';
import {AuthService} from './auth/auth.service';
import {InitiativeService} from './initiatives/initiative.service';
import {HttpService} from './shared/http.service';
import {AppHttpInterceptor} from './http.interceptor';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {StrategyAnalysisService} from './strategy/strategy-analysis/strategy-analysis.service';
import {TagInputComponent} from './shared/components/tag-input/tag-input.component';
import {BusinessScoreCardComponent} from './bsc/business-score-card/business-score-card.component';
import {BscComponent} from './bsc/bsc/bsc.component';
import {PerspectiveComponent} from './bsc/perspective/perspective.component';
import {ModalComponent} from './shared/components/modal/modal.component';
import {ThemesComponent} from './bsc/themes/themes.component';
import {ObjectivesComponent} from './bsc/objectives/objectives.component';
import {BscService} from './bsc/bsc.service';
import {MeasuresComponent} from './bsc/measures/measures.component';
import {InitiativeComponent} from './initiatives/initiative/initiative.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {Ng5SliderModule} from 'ng5-slider';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {LinkobjectiveComponent} from './bsc/linkobjective/linkobjective.component';
import {CorporatesbuComponent} from './alignments/corporatesbu/corporatesbu.component';
import {CorporatetosbuComponent} from './alignments/corporatetosbu/corporatetosbu.component';
import {CorporatetoboardComponent} from './alignments/corporatetoboard/corporatetoboard.component';
import {SbutosbuComponent} from './alignments/sbutosbu/sbutosbu.component';
import {HralignmentsComponent} from './alignments/hralignments/hralignments.component';
import {ItalignmentsComponent} from './alignments/italignments/italignments.component';
import {AlignmentsComponent} from './alignments/alignments/alignments.component';
import {AlignmentService} from './alignments/alignments.service';
import {Util} from './shared/utils/util';
import {CustomValidators} from './shared/utils/custom-validator';
import {MilestonesComponent} from './initiatives/milestones/milestones.component';
import {InitiativesComponent} from './initiatives/initiatives/initiatives.component';
import {GanttchartComponent} from './initiatives/ganntchart/ganttchart.component';
import {ObjectivestoryComponent} from './strategyreview/objectivestory/objectivestory.component';
import {ThemestoryComponent} from './strategyreview/themestory/themestory.component';
import {InitiativestoryComponent} from './strategyreview/initiativestory/initiativestory.component';
import {StrategyreviewComponent} from './strategyreview/strategyreview/strategyreview.component';
import {ActionitemsComponent} from './actionItems/actionitems/actionitems.component';
import {ActionItemComponent} from './actionItems/action-item/action-item.component';
import {RiskassessmentComponent} from './riskassessment/riskassessment/riskassessment.component';
import {RiskassessmentsComponent} from './riskassessment/riskassessments/riskassessments.component';
import {SwotComponent} from './strategy/strategy-analysis/swot/swot.component';
import {PestelComponent} from './strategy/strategy-analysis/pestel/pestel.component';
import {PorterfiveforceComponent} from './strategy/strategy-analysis/porterfiveforce/porterfiveforce.component';
import {FourCornerComponent} from './strategy/strategy-analysis/fourcorner/fourcorner.component';
import {ActionItemService} from './actionItems/actionItem.service';
import {StrategyReviewService} from './strategyreview/stratrgyreview.service';
import {RiskAssessmentService} from './riskassessment/riskAssessment.service';
import {StatusComponent} from './configuration/status/status.component';
import {ConfigurationService} from './configuration/configuration.service';
import {EmployeeMasterComponent} from './configuration/employee-master/employee-master.component';
import {ConfigurationsComponent} from './configuration/configurations/configurations.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ExcelService} from './shared/excel.service';
import {FilterPipe} from './shared/utils/pipes';
import {ReportingComponent} from './reporting/reporting/reporting.component';
import {ReportsComponent} from './reporting/reports/reports.component';
import {CreateUserComponent} from './configuration/create-user/create-user.component';
import {GeneratereportComponent} from './reporting/generatereport/generatereport.component';
import {BscRestService} from './shared/rest.service';
import {NumberOnlyDirective} from './shared/components/directives/numberOnly.directive';
import {ConfirmComponent} from './shared/components/modalPopUp/confirm/confirm.component';
import {SimpleModalModule} from 'ngx-simple-modal';
import {MatSelectModule} from '@angular/material/select';
import {ForgotPasswordComponent} from './auth/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {InternalServerErrorComponent} from './shared/components/internal-server-error/internal-server-error.component';
import {StrategyMapComponent} from './strategyMap/strategy-map/strategy-map.component';
import {StrategyMapMainComponent} from './strategyMap/strategy-map-main/strategy-map-main.component';
import {InitiativeSummaryComponent} from './reporting/initiative-summary/initiative-summary.component';
import {ThemeSummaryComponent} from './reporting/theme-summary/theme-summary.component';
import {ObjectiveSummaryComponent} from './reporting/objective-summary/objective-summary.component';
import {BalanceScoreCardComponent} from './reporting/balance-score-card/balance-score-card.component';
import {KpiComponent} from './kpi/kpi/kpi.component';
import {IndustryKpiComponent} from './kpi/industry-kpi/industry-kpi.component';
import {LoaderComponent} from './shared/components/loader/loader.component';
import {LoaderService} from './shared/loader.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SubheaderComponent,
    FooterComponent,
    LoginComponent,
    OverviewComponent,
    CorporateStructureComponent,
    DashboardComponent,
    StrategyPreviewComponent,
    StrategyComponent,
    ValueGapComponent,
    ValueGapCloserComponent,
    StrategyAnalysisComponent,
    StrategyProjectionComponent,
    TagInputComponent,
    BusinessScoreCardComponent,
    BscComponent,
    PerspectiveComponent,
    ModalComponent,
    ThemesComponent,
    ObjectivesComponent,
    MeasuresComponent,
    InitiativeComponent,
    LinkobjectiveComponent,
    CorporatesbuComponent,
    CorporatetosbuComponent,
    CorporatetoboardComponent,
    SbutosbuComponent,
    HralignmentsComponent,
    ItalignmentsComponent,
    AlignmentsComponent,
    MilestonesComponent,
    InitiativesComponent,
    GanttchartComponent,
    ObjectivestoryComponent,
    ThemestoryComponent,
    InitiativestoryComponent,
    StrategyreviewComponent,
    ActionitemsComponent,
    ActionItemComponent,
    RiskassessmentComponent,
    RiskassessmentsComponent,
    SwotComponent,
    PestelComponent,
    PorterfiveforceComponent,
    FourCornerComponent,
    StatusComponent,
    EmployeeMasterComponent,
    ConfigurationsComponent,
    FilterPipe,
    ReportingComponent,
    ReportsComponent,
    GeneratereportComponent,
    NumberOnlyDirective,
    ConfirmComponent,
    CreateUserComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    InternalServerErrorComponent,
    StrategyMapComponent,
    StrategyMapMainComponent,
    InitiativeSummaryComponent,
    ThemeSummaryComponent,
    ObjectiveSummaryComponent,
    BalanceScoreCardComponent,
    KpiComponent,
    IndustryKpiComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TagInputModule,
    Ng5SliderModule,
    MatChipsModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({positionClass: 'toast-top-center', timeOut: 2000}),
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatAutocompleteModule,
    TooltipModule.forRoot(),
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SimpleModalModule.forRoot({container: 'modal-container'})
  ],
  providers: [
    WINDOW_PROVIDERS,
    AppService,
    EmitterService,
    AuthService,
    HttpService,
    StrategyAnalysisService,
    BscService,
    BscRestService,
    InitiativeService,
    AlignmentService,
    ActionItemService,
    StrategyReviewService,
    Util,
    CustomValidators,
    RiskAssessmentService,
    ConfigurationService,
    ExcelService,
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}
  ],
  entryComponents: [
    ConfirmComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
