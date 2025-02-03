import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { Document, Signer } from '../../models/document.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-document',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
  documentForm: FormGroup;
  companyid: number | null = null;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private documentService: DocumentService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      signers: this.fb.array([this.createSigner()]),
    });
  }

  ngOnInit(): void {
    this.fetchcompanyid();
  }

  get signers(): FormArray {
    return this.documentForm.get('signers') as FormArray;
  }

  createSigner(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  addSigner(): void {
    this.signers.push(this.createSigner());
    console.log('Firmantes actuales:', this.signers.controls);
  }

  removeSigner(index: number): void {
    this.signers.removeAt(index);
  }

  fetchcompanyid(): void {
    this.http.get<{ id: number }>('http://localhost:8000/api/company/detail/1/')
      .subscribe(response => {
        this.companyid = response.id;
      }, error => {
        console.error('Error al obtener companyid', error);
      });
  }

  createDocument(): void {
    if (this.documentForm.valid && this.selectedFileBase64 && this.companyid !== null) {
      this.documentService.getApiToken().subscribe(apiToken => {
        const formData = this.documentForm.value;

        console.log(this.companyid)
  
        const documentData: Document = {
          title: formData.name,
          content: 'Contenido del documento',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          name: formData.name,
          base64_pdf: this.selectedFileBase64,
          signers: formData.signers,
          companyid: this.companyid
        };
  
        this.documentService.createDocument(documentData, apiToken)
          .subscribe(response => {
            console.log('Documento creado', response);
            this.successMessage = 'Documento creado exitosamente';
            this.errorMessage = '';
            this.documentForm.reset();
            this.selectedFileBase64 = '';
          
            this.signers.clear();
            this.signers.push(this.createSigner());
          }, error => {
            console.error('Error al crear documento', error);
            this.errorMessage = 'Error al crear documento';
            this.successMessage = '';
          });
      }, error => {
        console.error('Error al obtener el token', error);
        this.errorMessage = 'Error al obtener el token';
        this.successMessage = '';
      });
    } else {
      console.log('Formulario inválido, archivo no seleccionado o companyid no disponible');
      this.errorMessage = 'Formulario inválido, archivo no seleccionado o companyid no disponible';
      this.successMessage = '';
    }
  }
  

  submitForm(): void {
    if (this.documentForm.valid) {
      console.log('Formulario válido:', this.documentForm.value);
      this.createDocument();
    } else {
      console.log('Formulario inválido');
    }
  }

  selectedFileBase64: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selectedFileBase64 = reader.result?.toString().split(',')[1] || '';
        this.documentForm.updateValueAndValidity();
      };
    }
  }
}
