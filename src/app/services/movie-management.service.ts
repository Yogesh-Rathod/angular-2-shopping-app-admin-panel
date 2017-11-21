import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services';

@Injectable()
export class MovieManagementService {

  private headers = new Headers({ 'Content-Type': 'application/json' });

  moviesInfo = [];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getMovies() {
    // return this.moviesInfo;
    const url = `${environment.moviesApiUrl}Event`;
    return this.http.get(url)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  getMoviedetails(movieId) {
    const url = `${environment.moviesApiUrl}EventMapping/${movieId}`;
    return this.http.get(url)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  addMovie(movieInfo) {
    this.moviesInfo.push(movieInfo);
    return this.moviesInfo;
  }

  updateMovies(banks) {
    this.moviesInfo = banks;
    return this.moviesInfo;
  }
}