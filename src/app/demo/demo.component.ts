import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { DemoService } from './demo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpEventType, HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  form: FormGroup;
  selectedFile: File;
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files = [];
 
  constructor(private demoService : DemoService ,private fb: FormBuilder) {

    this.form = this.fb.group({
      image: ['', Validators.required]
  });
   }

  ngOnInit(): void {
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
    this.demoService.uploadImage(this.selectedFile);
  }

}
