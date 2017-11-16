import { Injectable } from '@angular/core';

@Injectable()
export class MovieManagementService {

  moviesInfo = [
    {
      id: 12345,
      title: 'Matru Ki Bijlee Ka Mandola',
      language: 'hindi',
      type: '2D',
      censorRating: 4,
      starRating: 2,
      duration: 122,
      genre: 'love',
      writer: 'Daud',
      music: 'A.R.Rahman',
      starring: 'KRK',
      director: 'Rahul Lamkhade',
      releaseDate: 1510811825352,
      synopsis: 'Nothing',
      trailerLink: 'www.trailer.com',
      sequence: 'NA',
      images: [
        {
          url: 'assets/images/movies/matru-ki-bijlee-ka-mandola_header_1.jpg',
        },
        {
          url: 'assets/images/movies/Matru_Ki_Bijlee_Ka_Mandola_poster.jpeg.jpg',
        },
        {
          url: 'assets/images/movies/PCTV-1000013709-hd_3.jpg',
        }
      ]
    },
    {
      id: 54321,
      title: 'lagailu lipistik',
      language: 'bhojpuri',
      type: '4D'
    },
    {
      id: 543221,
      title: 'Bhediyon ka Samooh',
      language: 'hindi',
      type: '2D',
      images: [
        {
          url: 'assets/images/movies/Bhediyon-Ka-Samooh-1991-MovieImg.jpg'
        }
      ]
    },
    {
      id: 154321,
      title: 'Ghar Mein Ho Sali To Pura Saal Diwali',
      language: 'gujrati',
      type: '3D',
      images: [
        {
          url: 'assets/images/movies/ghar mein ho saali toh pura saal diwali.jpg'
        }
      ]
    },
    {
      id: 543214,
      title: 'Jal Bin Machhli Nritya Bin Bijli',
      language: 'hindi',
      type: '5D',
      images: [
        {
          url: 'assets/images/movies/jal-bin-machhli.jpg'
        }
      ]
    },
    {
      id: 5421321,
      title: 'Kuku Mathur Ki Jhand Ho Gayi',
      language: 'hindi',
      type: '2D',
      images: [
        {
          url: 'assets/images/movies/MV5BMDZjYWNlZDMtMmY3Yi00OTdkLTg3NGUtMDEwZWI0YjJiMGQxXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_UY268_CR2,0,182,268_AL_.jpg'
        }
      ]
    },
    {
      id: 5432176,
      title: 'Andheri Raat Mein Diya Tere Haath Mein',
      language: 'hindi',
      type: '3D',
      images: [
        {
          url: 'assets/images/movies/andheri raat mein diya .jpg'
        }
      ]
    }
  ];

  getMovies() {
    return this.moviesInfo;
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