import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-catalog',
  templateUrl: './add-catalog.component.html',
  styleUrls: ['./add-catalog.component.scss']
})

export class AddCatalogComponent implements OnInit {

  catalogId: any;
  deleteLoader = false;

  constructor() { }

  ngOnInit() { }

  deleteCatalog() {}
}