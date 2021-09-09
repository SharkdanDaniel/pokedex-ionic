import { ActivatedRoute } from '@angular/router';
import { PokemonService } from "./../pokemon.service";
import { Component, OnInit, Output, ViewChild } from "@angular/core";
import { PickerOptions } from "@ionic/core";
import { Plugins, KeyboardInfo } from "@capacitor/core";
import { debounceTime, map, take } from "rxjs/operators";
import {
  IonInfiniteScroll,
  IonSearchbar,
  IonSelect,
  PickerController,
  PopoverController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
const { Keyboard } = Plugins;

@Component({
  selector: "app-pokedex",
  templateUrl: "./pokedex.component.html",
  styleUrls: ["./pokedex.component.css"],
})
export class PokedexComponent implements OnInit {
  @ViewChild("search", { static: false }) search: IonSearchbar;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild("select1") select1: IonSelect;

  showSpinner: boolean = false;
  pokemons: any[] = [];
  pokemonBkp: any[];

  private offset: number = 0;
  private limit: number = 50;
  private pokemonsNumber: number = 898;

  types = [
    { text: "All" },
    { text: "Electric" },
    { text: "Fairy" },
    { text: "Psychic" },
    { text: "Dark" },
    { text: "Dragon" },
    { text: "Grass" },
    { text: "Water" },
    { text: "Steel" },
    { text: "Ghost" },
    { text: "Rock" },
    { text: "Flying" },
    { text: "Fighting" },
    { text: "Ground" },
    { text: "Poison" },
    { text: "Bug" },
    { text: "Fire" },
    { text: "Normal" },
  ];

  filterType = "All";

  customActionSheetOptions: any = {
    header: "Types",
    subHeader: "",
    cssClass: "selection-sheet",
    mode: "ios",
  };

  constructor(
    private pokemonService: PokemonService,
    public pickerController: PickerController,
    public popoverController: PopoverController,
    private storage: Storage,
    private route: ActivatedRoute
  ) {
    // this.pokemons = this.route.snapshot.data['pokemons'];
    this.pokemons = JSON.parse(localStorage.getItem('pokemons'));
  }

  ngOnInit(): void {
    
    // this.getTest();
    // this.getAll();
    // this.getMany(this.limit, this.offset);
    // this.pokemonBkp = this.pokemons;
    console.log('pokemons', this.pokemons);
  }

  ionViewDidEnter(){
    this.pokemonBkp = JSON.parse(localStorage.getItem('pokemons'));
    // this.getJson();
  }

  getJson() {
    this.pokemonService.getJson().subscribe((res: any) => {
      this.pokemons = res;
      this.pokemonBkp = res;
    })
  }

  getTest() {
    this.pokemonService.getAllPokemons()
    .pipe(take(1))
    .subscribe((data: any) => {
      // this.pokemons = data.results;
      data.results.forEach((p: any) => {
        this.pokemonService.getByName(p.name).pipe(take(1)).subscribe((res: any) => {
          if (res.name == p.name) {
            Object.assign(p, {id: res.id});
            let arrayT = [];
            res.types.forEach(t => {
              arrayT.push(t.type)
            });
            Object.assign(p, {types: arrayT})
            this.pokemons.push(p);
            this.pokemons = this.pokemons.sort((a, b) =>
              a.id > b.id ? 1 : -1
            );
          }
        })
      });
      console.log('pokemons', this.pokemons)
    })
  }

  getAll() {
    this.pokemonService
      .getAllPokemons()
      .pipe(take(1))
      .subscribe((data: any) => {
        this.pokemonsNumber = data.results.length;
      });
  }

  getMany(limit, offset) {
    this.showSpinner = true;
    this.pokemonService.getManyPokemons(limit, offset).subscribe((res) => {
      res.forEach((p) => {
        this.pokemonService.getByName(p.name).subscribe((data: any) => {
          if (data.id <= this.pokemonsNumber) {
            this.pokemons.push(data);
            this.pokemons = this.pokemons.sort((a, b) =>
              a.id > b.id ? 1 : -1
            );
            this.filterAllPokemons(this.filterType);
          }
        });
        this.showSpinner = false;
      });
    });
  }

  filterAllPokemons(t: string) {
    this.pokemons = this.pokemonBkp;
    const type = t.toLocaleLowerCase();
    if (type != "all") {
      this.pokemons = this.pokemons.filter((item: any) => {
        let varTemp = [];
        item.types.forEach((t) => {
          if (t.name.indexOf(type) > -1) {
            varTemp.push(true);
          }
        });
        return varTemp.includes(true);
      });
    }
    // if (type != "all") {
    //   this.pokemons = this.pokemons.filter((item: any) => {
    //     let varTemp = [];
    //     item.types.forEach((t) => {
    //       if (t.type.name.indexOf(type) > -1) {
    //         varTemp.push(true);
    //       }
    //     });
    //     return varTemp.includes(true);
    //   });
    // }
  }

  openSelect() {
    this.select1.open();
  }

  doRefresh(event?) {
    if (event) {
      this.offset = 0;
      this.limit = 50;
    } else {
      this.limit = this.pokemonsNumber;
    }

    if (this.filterType == "All") {
      this.pokemons = this.pokemonBkp;
      this.limit = 0;
      this.limit = 50;
    } else {
      this.pokemons = [];
      this.getMany(event ? 50 : this.limit, 0);
    }

    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 400);
    }
  }

  loadData(event) {
    // setTimeout(() => {
    // let news = this.pokemons.slice(this.limit, this.offset + this.limit);
    //   this.limit += this.offset;

    //   for (let i = 0; i < news.length; i++) {
    //     this.pokemonslimit.push(news[i]);
    //   }

    //   event.target.complete();
    // }, 1200);
    this.offset += this.limit;
    if (this.offset > this.pokemonsNumber) {
      this.offset = this.pokemonsNumber;
      this.limit = 0;
      event.target.complete();
    }
    setTimeout(() => {
      this.getMany(this.limit, this.offset);
      this.pokemonBkp = this.pokemons;
      event.target.complete();
    }, 1000);
  }

  getSprite(id: number) {
    return this.pokemonService.getSprite(id);
  }

  // loadFilter(val) {
  //   this.showSpinner = true;
  //   if (parseInt(val)) {
  //     this.pokemonService
  //       .getById(parseInt(val))
  //       .pipe(take(1))
  //       .subscribe((pid: any) => {
  //         if (pid.id == val) {
  //           this.pokemons.push(pid);
  //           this.filterAllPokemons(this.filterType);
  //         }
  //       });
  //     this.showSpinner = false;
  //   } else {
  //     this.pokemonService
  //       .getAllPokemons()
  //       .pipe(take(1))
  //       .subscribe((filted: any) => {
  //         filted.results.forEach((el) => {
  //           if (el.name.toLowerCase().indexOf(val.toLowerCase()) > -1) {
  //             this.pokemonService
  //               .getByName(el.name)
  //               .pipe(take(1))
  //               .subscribe((res: any) => {
  //                 this.pokemons.push(res);
  //                 this.pokemons = this.pokemons.sort((a, b) =>
  //                   a.id > b.id ? 1 : -1
  //                 );
  //                 this.filterAllPokemons(this.filterType);
  //               });
  //           }
  //           this.showSpinner = false;
  //         });
  //       });
  //   }
  //   console.log("searched", this.pokemons);
  //   return this.pokemons;
  // }

  filterPokemons(event) {
    // this.pokemons = this.pokemonBkp;
    const val = event.target.value;
    console.log(val);
    this.filterAllPokemons(this.filterType);
    if (val && val.trim() != "") {
      if (parseInt(val)) {
        this.pokemons = this.pokemonBkp.filter((item: any) => {
            return item.id == val;
          });
        // this.pokemons = [];
        // this.loadFilter(parseInt(val));
        // Keyboard.hide();
      } else {
        this.pokemons = this.pokemons.filter((item: any) => {
            return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
          });
        // this.pokemons = [];
        // this.loadFilter(val);
        // Keyboard.hide();
      }
    }
  }

  // filterPokemons(event) {
  //   const val = event.target.value;
  //   console.log('val', val);
  //   this.pokemons = this.pokemonBkp;
  //   if (val && val.trim() != "") {
  //     this.showSpinner = true;
  //     this.pokemons = this.loadFilter(val);
  //   }
  //   this.showSpinner = false;
  // }

  setColor(type: string) {
    switch (type) {
      case "fire":
        return { backgroundColor: "rgb(228, 105, 34)" };
      case "bug":
        return { backgroundColor: "rgb(176, 194, 75)" };
      case "poison":
        return { backgroundColor: "rgb(146, 68, 146)" };
      case "ground":
        return { backgroundColor: "rgb(248, 222, 107)" };
      case "fighting":
        return { backgroundColor: "rgb(131, 74, 74)" };
      case "flying":
        return { backgroundColor: "rgb(181, 225, 255)" };
      case "rock":
        return { backgroundColor: "rgb(124, 103, 76)" };
      case "ghost":
        return { backgroundColor: "rgb(49, 23, 65)" };
      case "steel":
        return { backgroundColor: "rgb(173, 185, 194)" };
      case "water":
        return { backgroundColor: "rgb(50, 139, 240)" };
      case "grass":
        return { backgroundColor: "rgb(106, 226, 90)" };
      case "electric":
        return { backgroundColor: "rgb(255, 241, 46)" };
      case "psychic":
        return { backgroundColor: "rgb(241, 34, 131)" };
      case "ice":
        return { backgroundColor: "rgb(8, 234, 250)" };
      case "dragon":
        return { backgroundColor: "rgb(1, 51, 126)" };
      case "dark":
        return { backgroundColor: "rgb(31, 32, 34)" };
      case "fairy":
        return { backgroundColor: "rgb(250, 204, 242)" };
      default:
        break;
    }
  }

  searcheType() {
    let result = 0;
    this.types.forEach((t, i) => {
      if (t.text.toLocaleLowerCase() == this.filterType.toLocaleLowerCase()) {
        result = i;
      }
    });
    return result;
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverExample,
      cssClass: "",
      event: ev,
      translucent: true,
    });

    popover.onDidDismiss().then((data: any) => {
      if (data.data != "dismiss".toLowerCase() && data.data != null) {
        this.openSelect();
      }
    });

    return await popover.present();
  }
}

@Component({
  selector: "popover-example",
  template: `
    <ion-content>
      <ion-list>
        <ion-list-header><h3>Filter Options</h3></ion-list-header>
        <ion-item button (click)="dismiss('type')">Type</ion-item>
        <ion-item button (click)="dismiss('generation')">Generation</ion-item>
        <ion-item
          lines="none"
          detail="false"
          button
          (click)="dismiss('dismiss')"
          >Close</ion-item
        >
      </ion-list>
    </ion-content>
  `,
})
export class PopoverExample {
  constructor(private popoverController: PopoverController) {}

  dismiss(item: string) {
    this.popoverController.dismiss(item);
  }

  // async showBasicPicker() {
  //   let opts: PickerOptions = {
  //     buttons: [
  //       {
  //         text: "Cancel",
  //         cssClass: "popover-alight-text",
  //       },
  //       {
  //         text: "Confirm",
  //         role: "confirm",
  //         handler: () => {},
  //       },
  //     ],
  //     columns: [
  //       {
  //         selectedIndex: this.searcheType(),
  //         name: "types",
  //         options: this.types,
  //       },
  //     ],
  //     animated: true,
  //   };
  //   let picker = await this.pickerController.create(opts);
  //   picker.present();
  //   picker.onDidDismiss().then(async (data) => {
  //     if (data.role) {
  //       let col = await picker.getColumn("types");
  //       console.log("col:", col);
  //       this.filterType = col.options[col.selectedIndex].text;
  //       console.log(this.searcheType());
  //     }
  //   });
  // }
}
