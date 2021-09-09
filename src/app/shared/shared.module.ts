import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortbyPipe } from './pipes/sortby.pipe';



@NgModule({
  declarations: [SortbyPipe],
  imports: [
    CommonModule
  ],
  exports: [SortbyPipe]
})
export class SharedModule { }
