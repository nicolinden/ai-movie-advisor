import { Routes } from '@angular/router';
import { Search } from './features/movies/search/search';
import { Detail } from './features/movies/detail/detail';

export const routes: Routes = [
    {
        path: '',
        component: Search,
    }, {
        path: 'movies/:id',
        component: Detail
    }
];
