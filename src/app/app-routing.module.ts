import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateDocumentComponent } from './components/create-document/create-document.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentsListComponent },
  { path: 'create', component: CreateDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
