import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DemoComponent } from './demo/demo.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { DemoService } from './demo/demo.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



const appRoutes: Routes = [
 
  {
      path: 'demo',
      component: DemoComponent
  }
  ];
@NgModule({
  declarations: [
    AppComponent,
    DemoComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DemoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
