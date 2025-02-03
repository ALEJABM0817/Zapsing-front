import { Routes } from '@angular/router';
import { CreateDocumentComponent } from './components/create-document/create-document.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';

export const routes: Routes = [
  { path: 'documents/create', component: CreateDocumentComponent },
  { path: 'documents', component: DocumentsListComponent },
  { path: '', redirectTo: '/documents', pathMatch: 'full' }
];