import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services';

@Injectable()
export class MovieManagementService {

  headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'q=0.8;application/json;q=0.9'
  });
  options = new RequestOptions({ headers: this.headers });

  moviesInfo = [];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getMovies() {
    // return this.moviesInfo;
    const url = `${environment.moviesApiUrl}Event`;
    return this.http.get(url, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  getMoviedetails(movieId) {
    const url = `${environment.moviesApiUrl}Event/${movieId}`;
    return this.http.get(url, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  addMovie(movieInfo) {
    const url = `${environment.moviesApiUrl}Event`;
    return this.http.post(url, movieInfo, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  updateMovie(movieInfo, movieId) {
    const url = `${environment.moviesApiUrl}Event/${movieId}`;
    return this.http.patch(url, movieInfo, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }
}