import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Props} from '../common/props';
import {Util} from './utils/util';
import {ApexService} from './apex.service';

@Injectable()
export class HttpService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('client:secret')
    })
  };
  private host = Props.API_END_POINT;
  private security_host = Props.API_END_POINT_SECURITY;
  headers: HttpHeaders;

  constructor(private http: HttpClient, private apexService: ApexService) {
  }

  get(url: string, data: any) {

    const paramString = Util.GetParamString(data ? data.data : {});
    url = this.host + url + paramString;
    return this.http.get(url, this.httpOptions);
  }

  getById(url: string) {
    url = this.host + url;
    return this.http.get(url, this.httpOptions);
  }

  postSecurity(url: string, data: any) {
    url = this.security_host + url;
    return this.http.post(url, data, this.httpOptions);
  }

  post(url: string, data: any) {
    url = this.host + url;
    return this.http.post(url, data, this.httpOptions);
  }

  postFormData(url: string, data: any) {
    url = this.host + url;
    return this.http.post(url, data);
  }

  put(url: string, data: any) {
    url = this.host + url;
    return this.http.put(url, data, this.httpOptions);
  }

  delete(url: string, data: any) {
    const paramString = Util.GetParamString(data ? data : {});
    url = this.host + url + paramString;
    return this.http.delete(url, this.httpOptions);
  }

  formData(url: string, _formData: FormData) {
    url = this.host + url;
    return this.http.post(url, _formData);
  }
}
