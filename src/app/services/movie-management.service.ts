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

  moviesInfo = [
    {
      id: 12345,
      title: 'Justice League ',
      language: 'English, Hindi',
      type: '2D, 3D',
      censorRating: 4,
      starRating: 7.5,
      duration: 122,
      genre: 'love',
      writer: 'Zack Snyder',
      music: 'Danny Elfman',
      starring: 'Ben Affleck, Gal Gadot, Jason Momoa, Ezra Miller',
      director: 'Zack Snyder',
      releaseDate: 1510811825352,
      synopsis: "Fueled by his restored faith in humanity and inspired by Superman's selfless act, Bruce Wayne enlists the help of his newfound ally, Diana Prince, to face an even greater enemy.",
      trailerLink: 'www.trailer.com',
      sequence: 'NA',
      images: [
        {
          url: 'assets/images/movies/Justice-League-team-posterbanner.jpg',
        },
        {
          url: 'assets/images/movies/just-league.jpg',
        },
        {
          url: 'assets/images/movies/justice-league-blur.jpg',
        }
      ]
    },
    {
      id: 54321,
      title: 'Star Wars: The Last Jedi',
      language: 'English, Hindi',
      type: '4D'
    },
    {
      id: 543221,
      title: 'Thor: Ragnarok',
      language: 'English, Hindi',
      type: '2D, 4D',
      images: [
        {
          url: 'assets/images/movies/Thor-Ragnarok.jpg'
        }
      ]
    },
    {
      id: 154321,
      title: 'It',
      language: 'English, Hindi',
      type: '3D',
      images: [
        {
          url: 'assets/images/movies/It_(2017)_poster.jpg'
        }
      ]
    }
  ];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getMovies() {
    return this.moviesInfo;
    // const url = `${environment.moviesApiUrl}Event`;
    // return this.http.get(url)
    //   .toPromise()
    //   .then(response => this.responseHandingService.handleResponse(response))
    //   .catch(reason => this.responseHandingService.handleError(reason));
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