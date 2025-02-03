import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { DocumentsListComponent } from './documents-list.component';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';

describe('DocumentsListComponent', () => {
  let component: DocumentsListComponent;
  let fixture: ComponentFixture<DocumentsListComponent>;
  let documentService: DocumentService;

  const mockDocuments: Document[] = [
    { id: 1, name: 'Document 1', title: 'Title 1', content: 'Content 1', status: 'Pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), base64_pdf: '', companyid: 1, signers: [] },
    { id: 2, name: 'Document 2', title: 'Title 2', content: 'Content 2', status: 'Completed', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), base64_pdf: '', companyid: 1, signers: [] }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DocumentsListComponent],
      providers: [DocumentService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsListComponent);
    component = fixture.componentInstance;
    documentService = TestBed.inject(DocumentService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load documents on init', () => {
    spyOn(documentService, 'deleteDocument').and.returnValue(of(void 0));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.documents.length).toBe(2);
    expect(component.documents).toEqual(mockDocuments);
  });

  it('should display loading spinner while loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('.spinner-border'));
    expect(spinner).toBeTruthy();
  });

  it('should display documents list when loaded', () => {
    component.loading = false;
    component.documents = mockDocuments;
    fixture.detectChanges();
    const documentItems = fixture.debugElement.queryAll(By.css('.list-group-item'));
    expect(documentItems.length).toBe(2);
  });

  it('should display error message on error', () => {
    const errorMessage = 'Ocurrió un error al obtener los documentos';
    spyOn(documentService, 'getDocuments').and.returnValue(throwError({ error: errorMessage }));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe(errorMessage);
    const errorElement = fixture.debugElement.query(By.css('.alert-danger'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain(errorMessage);
  });

  it('should delete a document', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(documentService, 'deleteDocument').and.returnValue(of(void 0));
    component.documents = mockDocuments;
    fixture.detectChanges();
    component.deleteDocument(1);
    fixture.detectChanges();
    expect(component.documents.length).toBe(1);
    expect(component.documents[0].id).toBe(2);
  });

  it('should not delete a document if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.documents = mockDocuments;
    fixture.detectChanges();
    component.deleteDocument(1);
    fixture.detectChanges();
    expect(component.documents.length).toBe(2);
  });

  it('should edit a document', () => {
    spyOn(documentService, 'getDocumentById').and.returnValue(of(mockDocuments[0]));
    component.editDocument(1);
    fixture.detectChanges();
    expect(component.selectedDocument).toEqual(mockDocuments[0]);
  });
});