import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CreateDocumentComponent } from './components/create-document/create-document.component';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';
import { routes } from './app.routes';

@NgModule({
    declarations: [
        AppComponent,
        CreateDocumentComponent,
        DocumentsListComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }