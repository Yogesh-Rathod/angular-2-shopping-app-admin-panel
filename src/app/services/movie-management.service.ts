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

  moviesInfo = [
    {
      "EventId": "0486399e-1d35-40ce-b702-5b4c42bd95bc",
      "Title": "Padmavati",
      "Type": "2D",
      "Language": "hindi",
      "CensorRating": "U/A",
      "StarRating": 3,
      "Duration": 130,
      "Genre": "legendary",
      "Writer": "Sanjay Leela Bhansali, Prakash Kapadia",
      "Music": "Sanchit Balhara, Sanjay Leela Bhansali",
      "Starring": "	Deepika Padukone, Shahid Kapoor, Ranveer Singh",
      "Director": "	Sanjay Leela Bhansali",
      "Synopsis": "The film is based on the legend of Rani Padmini (also known as Padmavati), a legendary Hindu Rajput queen, mentioned in Padmavat, an Awadhi language epic poem written by Sufi poet Malik Muhammad Jayasi in 1540.[1] According to Padmavat, she was the wife of Ratan Sen (called Rawal Ratan Singh in later legends), the Rajput ruler of Mewar.",
      "ReleaseDate": "2017-11-21T09:37:53.130Z",
      "ImageUrl": "https://upload.wikimedia.org/wikipedia/en/4/47/Padmavati_Poster.jpg",
      "PosterUrl": "https://upload.wikimedia.org/wikipedia/en/4/47/Padmavati_Poster.jpg",
      "LandscapeUrl": "http://ste.india.com/sites/default/files/2017/11/17/639383-padmavati-posters.jpg",
      "TrailerUrl": "triler",
      "Sequence": 10,
      "CreatedOn": "2017-11-21T09:37:53.130Z",
      "CreatedBy": "string",
      "ModifiedOn": "2017-11-21T09:37:53.130Z",
      "ModifiedBy": "string"
    },
    {
      "EventId": "0486399e-1d35-40ce-b702-5b4c42bd95ba",
      "Title": "Justice League (2017)",
      "Type": null,
      "Language": "English",
      "CensorRating": "U/A",
      "StarRating": 4,
      "Duration": 122,
      "Genre": "Action, Adventure, Fantasy",
      "Writer": "Chris Terrio (screenplay by), Joss Whedon (screenplay by)",
      "Music": null,
      "Starring": "Ben Affleck, Gal Gadot, Jason Momoa",
      "Director": "Zack Snyder",
      "Synopsis": "Complex and chaotic, this fast-paced action thriller brings together the greatest superheroes of all time against a common foe, to fight for the survival of planet Earth and the human race.",
      "ReleaseDate": "2017-11-17T00:00:00",
      "ImageUrl": "//images.moviebuff.com/16846806-093a-4c16-8550-e56226b19a02",
      "PosterUrl": "//images.moviebuff.com/16846806-093a-4c16-8550-e56226b19a02",
      "LandscapeUrl": "//images.moviebuff.com/16846806-093a-4c16-8550-e56226b19a02",
      "TrailerUrl": "https://www.youtube.com/watch?v=LYoQTwhpN9w",
      "Sequence": null,
      "CreatedOn": "2017-11-20T11:38:00",
      "CreatedBy": "Shushil",
      "ModifiedOn": "2017-11-20T11:38:00",
      "ModifiedBy": null
    }
  ];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getMoviesDummyData() {
    return this.moviesInfo;
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

  getUnmappedMovies() {
    const url = `${environment.moviesApiUrl}Movie/Unmapped`;
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

  bulkUploadMovie(movieInfo) {
    const url = `${environment.moviesApiUrl}Events`;
    return this.http.post(url, movieInfo, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  updateMovie(movieInfo, movieId) {
    const url = `${environment.moviesApiUrl}Event/${movieId}`;
    return this.http.put(url, movieInfo, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  mapMovies(movieInfo) {
    const url = `${environment.moviesApiUrl}EventMapping`;
    return this.http.post(url, movieInfo, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

  geAlreadyMappedMovies(movieId) {
    const url = `${environment.moviesApiUrl}EventMapping/${movieId}`;
    return this.http.get(url, this.options)
      .toPromise()
      .then(response => this.responseHandingService.handleResponse(response))
      .catch(reason => this.responseHandingService.handleError(reason));
  }

}