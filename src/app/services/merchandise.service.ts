import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services';
// import * as CryptoJS from "crypto-js";
// import * as utf8 from 'utf8';

@Injectable()
export class MerchandiseService {

  headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'q=0.8;application/json;q=0.9'
  });
  options = new RequestOptions({ headers: this.headers });

  // All Operations Related To Categories
  private categories: any[] = [
    {
      id: 1,
      name: 'Computers',
      level: 1,
      parent_name: null,
      published: true,
      display_order: 1,
      breadCrumb: 'Computers',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 2,
      parentid: 1,
      name: 'Desktops',
      level: 2,
      parent_name: 'Computers',
      published: false,
      display_order: 1,
      breadCrumb: 'Computers >> Desktops',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 3,
      parentid: 1,
      name: 'Software',
      level: 2,
      parent_name: 'Computers',
      published: true,
      display_order: 2,
      breadCrumb: 'Computers >> Software',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 4,
      name: 'Electronics',
      parentid: '',
      level: 1,
      parent_name: null,
      published: true,
      display_order: 2,
      breadCrumb: 'Electronics',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 5,
      name: 'Cell phones',
      parentid: 4,
      level: 2,
      parent_name: 'Electronics',
      published: false,
      display_order: 1,
      breadCrumb: 'Electronics >> Cell phones',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 6,
      name: 'Others',
      parentid: 4,
      level: 2,
      parent_name: 'Electronics',
      published: true,
      display_order: 2,
      breadCrumb: 'Electronics >> Others',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 7,
      name: 'Apparel',
      parentid: '',
      level: 1,
      parent_name: null,
      published: false,
      display_order: 3,
      breadCrumb: 'Apparel',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 8,
      name: 'Clothing',
      parentid: 7,
      level: 2,
      parent_name: 'Apparel',
      published: true,
      display_order: 1,
      breadCrumb: 'Apparel >> Clothing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 9,
      parentid: 7,
      name: 'Accessories',
      level: 2,
      parent_name: 'Apparel',
      published: false,
      display_order: 2,
      breadCrumb: 'Apparel >> Accessories',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 10,
      name: 'Caps',
      parentid: 7,
      level: 3,
      parent_name: 'Apparel >> Accessories',
      published: false,
      display_order: 3,
      breadCrumb: 'Apparel >> Accessories >> Caps',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 11,
      name: 'Armani Caps',
      parentid: 10,
      level: 4,
      parent_name: 'Apparel >> Accessories >> Caps',
      published: true,
      display_order: 4,
      breadCrumb: 'Apparel >> Accessories >> Caps >> Armani Caps',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 21,
      name: 'Furniture',
      parentid: '',
      level: 4,
      parent_name: 'Furniture',
      published: true,
      display_order: 4,
      breadCrumb: 'Furniture',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    }
  ];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getCategories() {
    const url = `${environment.merchandiseApiUrl}Categories?categoryName=electronics`;
    console.log("url ", url);
    return this.http.get(url, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  addCategory(categoryInfo) {
    this.categories.push(categoryInfo);
    return this.categories;
  }

  editCategories(categories) {
    this.categories = categories;
    return this.categories;
  }

}
