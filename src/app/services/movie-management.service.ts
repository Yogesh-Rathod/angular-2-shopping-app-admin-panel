import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { CommonAppService } from 'app/services/common.services';
import { ResponseHandingService } from 'lrshared_modules/services';

@Injectable()
export class MovieManagementService {

    headers = new Headers({
        'headers': '',
        'ModuleId': environment.moduleId,
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9'
    });
    options = new RequestOptions({ headers: this.headers });

    constructor(
        private http: Http,
        private commonAppSer: CommonAppService,
        private global: AppState,
        private responseHandingService: ResponseHandingService) {
    }

    getMovies() {
        const url = `${environment.moviesApiUrl}Event`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    getMoviedetails(movieId) {
        const url = `${environment.moviesApiUrl}Event/${movieId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    getUnmappedMovies() {
        const url = `${environment.moviesApiUrl}Movie/Unmapped`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    addMovie(movieInfo) {
        const url = `${environment.moviesApiUrl}Event`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, movieInfo));
        this.headers.delete('HMACheader');

        return this.http.post(url, JSON.stringify(movieInfo), this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    bulkUploadMovie(movieInfo) {
        const url = `${environment.moviesApiUrl}Events`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, movieInfo));
        return this.http.post(url, JSON.stringify(movieInfo), this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    updateMovie(movieInfo, movieId) {
        const url = `${environment.moviesApiUrl}Event/${movieId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('PUT', url, movieInfo));
        return this.http.put(url, JSON.stringify(movieInfo), this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    mapMovies(movieInfo) {
        const url = `${environment.moviesApiUrl}EventMapping`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('POST', url, movieInfo));
        return this.http.post(url, JSON.stringify(movieInfo), this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

    geAlreadyMappedMovies(movieId) {
        const url = `${environment.moviesApiUrl}EventMapping/${movieId}`;
        this.headers.set('Authorization', this.commonAppSer.crateAuthorization());
        this.headers.set('LRSignAuth', this.commonAppSer.createHMACSignature('GET', url));
        return this.http.get(url, this.options)
            .toPromise()
            .then(response => this.responseHandingService.handleResponse(response))
            .catch(reason => this.responseHandingService.handleError(reason));
    }

}