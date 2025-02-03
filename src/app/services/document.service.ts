import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Document } from '../models/document.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private apiTokenUrl = 'http://127.0.0.1:8000/api/company/detail/1/';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient, private router: Router) {}

  getApiToken(): Observable<string> {
    return this.http.get<{ api_token: string }>(this.apiTokenUrl)
      .pipe(
        catchError(error => {
          if (error.status === 404) {
            window.location.href = 'http://127.0.0.1:8000/api/company/create/';
          }
          return this.handleError(error);
        }),
        map(response => response.api_token)
      );
  }

  createDocument(documentData: Document, apiToken: string): Observable<Document> {
    const body = {
      name: documentData.name,
      base64_pdf: documentData.base64_pdf,
      signers: documentData.signers.map(signer => ({
        name: signer.name,
        email: signer.email
      })),
      companyid: documentData.companyid
    };
  
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }),
      withCredentials: true
    };
  
    return this.http.post<Document>(`${this.apiUrl}/create/document/`, body, httpOptionsWithAuth)
      .pipe(catchError(this.handleError));
  }

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/documents/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getDocumentById(documentId: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/documents/${documentId}/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateDocument(documentId: number, documentData: Document, apiToken: string): Observable<Document> {
    const body = {
      name: documentData.name,
      signers: documentData.signers.map(signer => ({
        id: signer.id, 
        name: signer.name,
        email: signer.email
      })),
      companyid: documentData.companyid
    };

    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }),
      withCredentials: true
    };
  
    return this.http.put<Document>(`${this.apiUrl}/documents/${documentId}/`, body, httpOptionsWithAuth)
      .pipe(catchError(this.handleError));
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documents/${documentId}/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}