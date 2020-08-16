import { Component, ViewChild, AfterViewInit, DoCheck } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { WorldwideCases, IndiaCovid19Model } from './models/covid19cases';
import { HttpService } from './http.service';
import { MatSort } from '@angular/material';
import { state, trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent implements DoCheck {
  title = 'covid19';
  displayedColumns: string[] = ['Country', 'TotalConfirmed', 'ActiveCases', 'TotalDeaths', 'TotalRecovered'];
  displayedIndiaColumns: string[] = ['state', 'confirmed', 'active', 'deaths', 'recovered' ];
  WORLDWIDE_DATA: WorldwideCases[] = [];
  dataSource: MatTableDataSource<WorldwideCases>;
  INDIA_DATA: IndiaCovid19Model[] = [];
  dataSourceIndia: MatTableDataSource<IndiaCovid19Model>;
  TotalConfirmedIn = 0;
  ActiveCasesIn = 0;
  TotalDeathsIn = 0;
  TotalRecoveredIn = 0;
  globalCases;
  searchByCountry;
  searchByState;
  // total: number;
  // page: number;
  pageSize: number;
  pageSizeOptions: number[];
  // toggle='india'
  isChecked = true;
  indiaTotal: any;
  districtWiseData = {};
  districts = [];
  states;
  // panelOpenState = false;
  // pageEvent
  length;
  i = 0;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginatorGlobal: MatPaginator;
  @ViewChild(MatPaginator, {static: true}) paginatorIndia: MatPaginator;
  loader = true;
  constructor(private httpService: HttpService) {
    this.pageSizeOptions = [10, 20, 30, 50];
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.fetchData();
    this.fetchIndiaData();
    this.httpService.getdistrictWiseData().subscribe(data => {
      this.districtWiseData = data;
      this.states = Object.keys(this.districtWiseData);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0;  i < this.states.length; i++) {
          this.districts[this.states[i]] = Object.keys(this.districtWiseData[this.states[i]].districtData);
      }
    });
  }

  ngDoCheck() {
    if (this.isChecked) {
      this.length = 186;
    } else {
      this.length = this.dataSourceIndia.data.length;
    }
  }

  fetchData(value?) {
    this.httpService.getCovid19Cases().subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.globalCases = data['Global'];
      // tslint:disable-next-line: no-string-literal
      this.WORLDWIDE_DATA = data['Countries'];
      this.dataSource = new MatTableDataSource(this.WORLDWIDE_DATA);
      this.dataSource.paginator = this.paginatorGlobal;
      this.loader = false;
    });
  }

  fetchIndiaData() {
    this.httpService.getCovid19CasesIndia().subscribe((data) => {
      // tslint:disable-next-line: no-string-literal
      this.INDIA_DATA = data['statewise'];
      // tslint:disable-next-line: no-string-literal
      this.indiaTotal = data['statewise'][0];
      this.INDIA_DATA.shift();
      this.dataSourceIndia = new MatTableDataSource(this.INDIA_DATA);
      this.dataSourceIndia.paginator = this.paginatorIndia;
      while (this.i < this.dataSourceIndia.data.length) {
        this.TotalConfirmedIn += +this.INDIA_DATA[this.i].confirmed;
        this.TotalDeathsIn += +this.INDIA_DATA[this.i].deaths;
        this.TotalRecoveredIn += +this.INDIA_DATA[this.i].recovered;
        this.ActiveCasesIn += +this.INDIA_DATA[this.i].active;
        this.i++;
      }
    });
    // this.loader = false;
  }

  reseting() {
    this.searchByCountry = '';
    this.searchByState = '';
  }

}
