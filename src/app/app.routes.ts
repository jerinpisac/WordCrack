import { Routes } from '@angular/router';
import { FourComponent } from './components/four/four.component';
import { FiveComponent } from './components/five/five.component';
import { SixComponent } from './components/six/six.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'four', component: FourComponent},
    {path: 'five', component: FiveComponent},
    {path: 'six', component: SixComponent},
];
