import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

//const GIPHY_API_KEY = 'L6kUcYcvjX0B2uCdMlNY8IqHcEPXl8Cg'

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apiKey: string = 'L6kUcYcvjX0B2uCdMlNY8IqHcEPXl8Cg'
  private serviceUrl = 'http://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready!');
  }


  get tagHistory() {
    return [...this._tagHistory];
  }

  private organizeHistory( tag: string ){
    tag = tag.toLowerCase();

    // Evita que hayan repetidos
    if ( this._tagHistory.includes(tag) ){
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag )
    }
    //y pone en primera fila el repetido
    this._tagHistory.unshift( tag );
    // evita que hayan mas de 10 busquedas
    this._tagHistory = this._tagHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private loadLocalStorage(): void {
    if ( !localStorage.getItem('history') ) return;
    this._tagHistory = JSON.parse( localStorage.getItem('history')! );

    if( this._tagHistory.length === 0 ) return;
    this.searchTag( this._tagHistory[0] );
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify( this._tagHistory ))
  }

  searchTag( tag: string ): void {
    if (tag.length === 0) return;
    this.organizeHistory( tag );

    const params = new HttpParams()
    .set( 'api_key', this.apiKey )
    .set( 'limit', '10' )
    .set( 'q', tag )

    //const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=L6kUcYcvjX0B2uCdMlNY8IqHcEPXl8Cg&q=valorant&limit=10')
    //const data = await resp.json();
    //console.log( data )

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
    .subscribe( (resp) => {
      this.gifList = resp.data;
      //console.log({ gifs: this.gifList });


    })
  }

}
