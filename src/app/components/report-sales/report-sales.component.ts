import { Component, OnInit } from '@angular/core';
import { faChevronLeft, faChevronRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-report-sales',
  templateUrl: './report-sales.component.html',
  styleUrls: ['./report-sales.component.css']
})
export class ReportSalesComponent implements OnInit {

  public loading: boolean = false;
  public icons = [faFilePdf, faChevronLeft, faChevronRight];

  constructor() { }

  ngOnInit(): void {
  }

  salesPrev(): void {
    console.log('anterior');
  }

  salesNext(): void {
    console.log('siguiente');
  }

  generatePdf(): void {
    console.log('pdf');
  }

}
