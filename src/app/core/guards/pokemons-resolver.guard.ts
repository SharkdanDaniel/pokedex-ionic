import { PokemonService } from './../../pokemon.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsResolverGuard implements Resolve<any> {
  constructor(private pokemonService: PokemonService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    this.pokemonService.getJson().subscribe(res => localStorage.setItem('pokemons', JSON.stringify(res)))
    return this.pokemonService.getJson();
  }
  
}
