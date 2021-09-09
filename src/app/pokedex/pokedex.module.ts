import { FormsModule } from "@angular/forms";
import { SharedModule } from "./../shared/shared.module";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PokedexRoutingModule } from "./pokedex-routing.module";
import { PokedexComponent } from "./pokedex.component";
import { PokemonProfileComponent } from "./pokemon-profile/pokemon-profile.component";

@NgModule({
  declarations: [PokedexComponent, PokemonProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    PokedexRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class PokedexModule {}
