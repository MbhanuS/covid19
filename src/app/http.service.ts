import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  getCovid19Cases() {
    return this.httpClient.get('https://api.covid19api.com/summary')
  }

  getCovid19CasesIndia() {
    return this.httpClient.get('https://api.covid19india.org/data.json')
  }

  getdistrictWiseData() {
    return this.httpClient.get('https://api.covid19india.org/state_district_wise.json')
  }

}
