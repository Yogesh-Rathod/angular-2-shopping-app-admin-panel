import { Injectable } from '@angular/core';

@Injectable()
export class MovieManagementService {

  moviesInfo = [
    {
      id: 12345,
      name: 'Matru Ki Bijlee Ka Mandola',
      language: 'hindi',
      type: '2D'
    },
    {
      id: 54321,
      name: 'lagailu lipistik',
      language: 'bhojpuri',
      type: '4D'
    },
    {
      id: 543221,
      name: 'Bhediyon ka Samooh',
      language: 'hindi',
      type: '2D'
    },
    {
      id: 154321,
      name: 'Ghar Mein Ho Sali To Pura Saal Diwali',
      language: 'gujrati',
      type: '3D'
    },
    {
      id: 543214,
      name: 'Jal Bin Machhli Nritya Bin Bijli',
      language: 'hindi',
      type: '5D'
    },
    {
      id: 5421321,
      name: 'Kuku Mathur Ki Jhand Ho Gayi',
      language: 'hindi',
      type: '2D'
    },
    {
      id: 5432176,
      name: 'Andheri Raat Mein Diya Tere Haath Mein',
      language: 'hindi',
      type: '3D'
    }
  ];

  getMovies() {
    return this.moviesInfo;
  }

  updateMovies(banks) {
    this.moviesInfo = banks;
    return this.moviesInfo;
  }
}