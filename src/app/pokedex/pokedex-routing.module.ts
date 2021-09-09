import { PokemonsResolverGuard } from "./../core/guards/pokemons-resolver.guard";
import { PokemonProfileComponent } from "./pokemon-profile/pokemon-profile.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PokedexComponent } from "./pokedex.component";

const routes: Routes = [
  {
    path: "",
    component: PokedexComponent,
    resolve: {
      pokemons: PokemonsResolverGuard,
    },
  },
  { path: "pokemon-profile/:id", component: PokemonProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PokedexRoutingModule {}
