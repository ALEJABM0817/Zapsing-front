import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { Document } from '../../models/document.model';

@Component({
  selector: 'app-document-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit, OnChanges {
  @Input() document: Document | null = null;
  @Output() documentEdited = new EventEmitter<Document>();
  documentForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private documentService: DocumentService) {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      signers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.document) {
      this.documentForm.patchValue({ name: this.document.name });
      this.clearSigners();
      if (this.document.signers) {
        this.setSigners(this.document.signers);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['document'] && changes['document'].currentValue) {
      this.documentForm.reset();
      this.documentForm.patchValue({ name: this.document!['name'] });
      this.clearSigners();
      if (this.document!['signers']) {
        this.setSigners(this.document!['signers']);
      }
    }
  }

  clearSigners(): void {
    while (this.signers.length) {
      this.signers.removeAt(0);
    }
  }

  get signers(): FormArray {
    return this.documentForm.get('signers') as FormArray;
  }

  setSigners(signers: any[]): void {
    const signersFormArray = this.signers;
    signers.forEach(signer => {
      signersFormArray.push(this.fb.group({
        name: [signer.name, Validators.required],
        email: [signer.email, Validators.required],
        id: [signer.id]
      }));
    });
  }

  updateDocument(): void {
    if (this.document && this.documentForm.valid) {
      const updatedDocument = { ...this.document, ...this.documentForm.value };
      this.documentService.getApiToken().subscribe(apiToken => {
        if (this.document) {
          this.documentService.updateDocument(this.document.id!, updatedDocument, apiToken).subscribe(
            () => {
              this.errorMessage = null;
              this.documentEdited.emit(updatedDocument);
            },
            error => {
              console.error('Error al actualizar el documento:', error);
              this.errorMessage = 'Error al actualizar el documento';
            }
          );
        }
      });
    }
  }
}
