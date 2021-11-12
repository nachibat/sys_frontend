import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report-sales',
  templateUrl: './report-sales.component.html',
  styleUrls: ['./report-sales.component.css']
})
export class ReportSalesComponent implements OnInit {

  public loading = true;

  constructor() { }

  ngOnInit(): void {
  }

}
