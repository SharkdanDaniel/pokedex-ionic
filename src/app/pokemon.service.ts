import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap, map, mergeMap, switchMap, take } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  baseUrl: string = environment.API;

  constructor(private http: HttpClient) {}

  getAllPokemons() {
    const allUrl = `pokemon?limit=898&offset=0`;
    return this.http
      .get(`${this.baseUrl}/${allUrl}`)
      .pipe(map((data: any) => data));
  }

  getManyPokemons(limit: any, offset: any) {
    const allUrl = `pokemon?limit=${limit}&offset=${offset}`;
    return this.http
      .get(`${this.baseUrl}/${allUrl}`)
      .pipe(map((data: any) => data.results));
  }

  getByName(name: string) {
    const allUrl = `pokemon/${name}`;
    return this.http.get(`${this.baseUrl}/${allUrl}`);
  }

  getById(id: number) {
    const allUrl = `pokemon/${id}`;
    return this.http.get(`${this.baseUrl}/${allUrl}`);
  }

  getSprite(id: number) {
    // return this.http.get(
    //   `https://pokeres.bastionbot.org/images/pokemon/${id}.png`
    // );
    return `./assets/img/pokemons/${id}.png`
  }

  getJson() {
    return this.http.get(`./assets/data/pokemons/pokemons.json`).pipe(take(1));
  }
}
