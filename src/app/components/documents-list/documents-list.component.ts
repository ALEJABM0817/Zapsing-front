import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';
import { DocumentEditComponent } from '../document-edit/document-edit.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-documents-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DocumentEditComponent],
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css']
})
export class DocumentsListComponent implements OnInit, AfterViewInit {
  documents: Document[] = [];
  selectedDocument: Document | null = null;
  errorMessage: string = '';
  loading: boolean = true;
  successMessage: string = '';
  documentToDelete: Document | null = null;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    this.getDocuments();
  }

  ngAfterViewInit() {
    const deleteModalElement = document.getElementById('deleteModal');
    if (deleteModalElement) {
      new bootstrap.Modal(deleteModalElement);
    }
  }

  getDocuments(): void {
    this.documentService.getDocuments()
      .subscribe(
        (response: Document[]) => {
          this.documents = response;
          this.loading = false;
        },
        (error: any) => {
          console.error('Error al obtener los documentos:', error);
          this.errorMessage = 'Ocurrió un error al obtener los documentos';
          this.loading = false;
        }
      );
  }

  openDeleteModal(document: Document): void {
    this.documentToDelete = document;
  }

  confirmDelete(): void {
    if (this.documentToDelete) {
      this.documentService.deleteDocument(this.documentToDelete.id!)
        .subscribe(
          (response: any) => {
            this.documents = this.documents.filter(doc => doc.id !== this.documentToDelete!.id);
            this.successMessage = 'Documento eliminado exitosamente';
            this.documentToDelete = null;
          },
          (error: any) => {
            console.error('Error al eliminar el documento:', error);
            this.errorMessage = 'Ocurrió un error al eliminar el documento';
            this.documentToDelete = null;
          }
        );
    }
  }

  deleteDocument(documentId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      this.documentService.deleteDocument(documentId)
        .subscribe(
          (response: any) => {
            this.documents = this.documents.filter(doc => doc.id !== documentId);
            this.successMessage = 'Documento eliminado exitosamente';
          },
          (error: any) => {
            console.error('Error al eliminar el documento:', error);
            this.errorMessage = 'Ocurrió un error al eliminar el documento';
          }
        );
    }
  }

  editDocument(documentId: number): void {
    this.documentService.getDocumentById(documentId).subscribe(
      document => {
        this.selectedDocument = document;
      },
      error => this.errorMessage = 'Error al cargar el documento'
    );
  }

  onDocumentEdited(updatedDocument: Document): void {
    this.successMessage = 'Documento editado exitosamente';
    this.selectedDocument = null;
    this.getDocuments();
  }
}