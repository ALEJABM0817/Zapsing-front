import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CreateDocumentComponent } from './create-document.component';
import { DocumentService } from '../../services/document.service';

describe('CreateDocumentComponent', () => {
  let component: CreateDocumentComponent;
  let fixture: ComponentFixture<CreateDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [CreateDocumentComponent],
      providers: [DocumentService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a signer', () => {
    const addButton = fixture.debugElement.query(By.css('button.btn-secondary'));
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.signers.length).toBe(2);
  });

  it('should remove a signer', () => {
    component.addSigner();
    fixture.detectChanges();
    const removeButton = fixture.debugElement.query(By.css('button.btn-danger'));
    removeButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.signers.length).toBe(1);
  });

  it('should submit form if valid', () => {
    spyOn(component, 'createDocument');
    component.documentForm.controls['name'].setValue('Test Document');
    component.documentForm.controls['signers'].setValue([{ name: 'John Doe', email: 'john.doe@example.com' }]);
    component.submitForm();
    expect(component.createDocument).toHaveBeenCalled();
  });

  it('should not submit form if invalid', () => {
    spyOn(component, 'createDocument');
    component.submitForm();
    expect(component.createDocument).not.toHaveBeenCalled();
  });
});