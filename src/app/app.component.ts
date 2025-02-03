import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DocumentService } from './services/document.service';
import { Document } from './models/document.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <h1 class="mb-3">Gestión de Documentos</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apiToken: string | null = null;
  tokenFormGroup: FormGroup;
  companyid: number | null = null;
  documents: Document[] = [];
  selectedDocument: Document | null = null;
  errorMessage: string | null = null;
  title = 'frontend';

  constructor(private http: HttpClient, private fb: FormBuilder, private documentService: DocumentService) {
    this.tokenFormGroup = this.fb.group({
      name: ['', Validators.required],
      api_token: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchApiToken();
    this.loadDocuments();
  }

  fetchApiToken(): void {
    this.http.get<{ api_token: string, company_id: number }>('http://localhost:8000/api/company/detail/1/')
      .pipe(
        catchError(error => {
          console.error('Detalles del error:', error);
          if (error.status === 404) {
            window.location.href = 'http://127.0.0.1:8000/api/company/create/';
          }
          if (error.status === 0) {
            console.error('CORS issue or network error');
          }
          return throwError(() => error);
        })
      )
      .subscribe(response => {
        this.apiToken = response.api_token;
        this.companyid = response.company_id;
      }, error => {
        console.error('Error en la solicitud:', error);
      });
  }

  submitTokenForm(): void {
    if (this.tokenFormGroup.valid) {
      const formData = this.tokenFormGroup.value;
      if (!this.apiToken) {
        this.http.post('http://localhost:8000/api/company/create/', formData)
          .subscribe(response => {
            console.log('Token guardado', response);
            this.apiToken = formData.api_token;
          }, error => {
            console.error('Error al guardar el token', error);
          });
      } else {
        console.log('Token ya existe:', this.apiToken);
      }
    }
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe(
      documents => this.documents = documents,
      error => this.errorMessage = 'Error al cargar documentos'
    );
  }

  editDocument(documentId: number): void {
    this.documentService.getDocumentById(documentId).subscribe(
      document => this.selectedDocument = document,
      error => this.errorMessage = 'Error al cargar el documento'
    );
  }

  updateDocument(): void {
    if (this.selectedDocument && this.apiToken) {
      this.documentService.updateDocument(this.selectedDocument.id!, this.selectedDocument, this.apiToken).subscribe(
        updatedDocument => {
          this.selectedDocument = null;
          this.loadDocuments();
        },
        error => this.errorMessage = 'Error al actualizar el documento'
      );
    }
  }
}