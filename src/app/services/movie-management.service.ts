import { Injectable } from '@angular/core';

@Injectable()
export class MovieManagementService {

  moviesInfo = [
    {
      id: 12345,
      title: 'Matru Ki Bijlee Ka Mandola',
      language: 'hindi',
      type: '2D'
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
      type: '2D'
    },
    {
      id: 154321,
      title: 'Ghar Mein Ho Sali To Pura Saal Diwali',
      language: 'gujrati',
      type: '3D'
    },
    {
      id: 543214,
      title: 'Jal Bin Machhli Nritya Bin Bijli',
      language: 'hindi',
      type: '5D'
    },
    {
      id: 5421321,
      title: 'Kuku Mathur Ki Jhand Ho Gayi',
      language: 'hindi',
      type: '2D'
    },
    {
      id: 5432176,
      title: 'Andheri Raat Mein Diya Tere Haath Mein',
      language: 'hindi',
      type: '3D'
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