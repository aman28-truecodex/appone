import { Injectable } from '@angular/core';
import { AppService } from '../shared/app.service';
import { HttpService } from '../shared/http.service';
import { Props } from '../common/props';

@Injectable()
export class AuthService {
  props: Props = Props;
  private auth_url: string = "/auth";

  constructor(private http: HttpService, private appService: AppService) {
  }

  login(data: any) {
    const reqData = {
      username: data.userid,
      name: data.name,
      password: data.password,
      provider: data.provider,
    };
    return this.http.post(this.auth_url, reqData);
  }


  forgotPassword(data: any) {
    let reqData = data;
    return this.http.get(
      this.auth_url,
      {
        data: { userid: reqData },
      }
    );
  }
}
