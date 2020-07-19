import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {BscRestService} from '../../shared/rest.service';
import {EmitterService} from '../../shared/emitter.service';
import {CustomValidators} from '../../shared/utils/custom-validator';
import {ToastrService} from 'ngx-toastr';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {ConfirmComponent} from '../../shared/components/modalPopUp/confirm/confirm.component';
import {SimpleModalService} from 'ngx-simple-modal';
import {PasswordValidation} from '../../shared/utils/password-validator';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  organization = new FormControl();
  scorecard = new FormControl();
  codeAndNameSubsription: any;
  balanceScoreCardData: any;
  codeAndName: any;
  orgValue: any;
  scCode: any;
  userData: any = [];
  userDataEditMode: any;
  userId: any;
  dataSource: MatTableDataSource<any>;
  users = [
    {value: 'ROLE_SUPER_ADMIN', viewValue: 'Super Admin'},
    {value: 'USER', viewValue: 'User'},
    {value: 'ADMIN', viewValue: 'Admin'}
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['sNo', 'firstName', 'loginId', 'email', 'address', 'username', 'accessType'];

  accessRights = [
    {value: false, viewValue: 'Read'},
    {value: true, viewValue: 'Write'}
  ];

  createUserForm = this.formBuilder.group({
    firstName: [''],
    lastName: ['', []],
    email: ['', [this.customValidators.required, Validators.email]],
    address: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: [''],
    role: [[], []],
    scCodes: [[]],
    orgCodes: [[], []],
    accessType: ['', []],
    clientId: ['', [this.customValidators.required]]
  }, {
    validator: PasswordValidation.MatchPassword
  });

  constructor(private bscRestService: BscRestService,
              private emitterService: EmitterService,
              private formBuilder: FormBuilder,
              private toastrService: ToastrService,
              private simpleModalService: SimpleModalService,
              private customValidators: CustomValidators) {
  }

  ngOnInit() {
    this.getOrgUnitCode();
    this.getBalanceScoreCard();
    this.getAllUsers();
    this.orgValue = this.createUserForm.controls.orgCodes;
    this.scCode = this.createUserForm.controls.scCodes;
  }

  getBalanceScoreCard() {
    this.bscRestService.getBalanceScoreCard().subscribe((data: any) => {
      this.balanceScoreCardData = data.data['Scorecard'];
    });
  }

  getOrgUnitCode() {
    this.codeAndNameSubsription = this.emitterService.orgCodeSource$.subscribe((codes: any) => {
      this.codeAndName = codes;
    });
  }

  getAllUsers() {
    this.bscRestService.getUsers().subscribe((data: any) => {
      if (!!data && data.length > 0) {
        this.userData = data;
        this.dataSource = new MatTableDataSource(this.userData);
        this.dataSource.paginator = this.paginator;
      } else {
        this.userData = [];
      }
    });
  }

  createUser() {
    if (this.createUserForm.valid) {
      const userCreationReq = this.createUserForm.value;
      userCreationReq.role = [];
      userCreationReq.role.push(this.createUserForm.controls.role.value);
      if (!!this.userId) {
        this.bscRestService.updateUser(this.createUserForm.value, this.userId).subscribe((data: any) => {
          this.getAllUsers();
          this.createUserForm.reset();
        });
      } else {
        if (!!this.createUserForm.controls.clientId.value) {
          sessionStorage.setItem('createUserClientId', this.createUserForm.controls.clientId.value);
        }
        this.bscRestService.createUser(userCreationReq).subscribe((data: any) => {
          if (data) {
            this.bscRestService.createDefaultUser(userCreationReq).subscribe((data: any) => {
              if (data.status === '0') {
                this.getAllUsers();
                this.createUserForm.reset();
              }
            });
          }
        }, error => {
          this.toastrService.error('Server Error');
        });
      }
    }

  }

  confirmDelete(id: any) {
    this.simpleModalService.addModal(ConfirmComponent, {
      title: 'Please Confirm',
      message: 'Do you want to really delete?'
    })
      .subscribe((isConfirmed) => {
        if (isConfirmed) {
          this.bscRestService.deleteUserData(id).subscribe((data: any) => {
            if (data) {
              this.getAllUsers();
            }
          });
        }
      });
  }

  editUser(id, user: any) {
    this.userId = id;
    delete user.password;
    delete user.confirmPassword;
    this.userDataEditMode = user;
    this.createUserForm.patchValue(this.userDataEditMode);
  }
}
