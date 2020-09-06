import {Injectable} from '@angular/core';

import {  HttpClient } from '@angular/common/http';

//import {Http, Response,Headers,RequestOptions} from '@angular/http';


   

@Injectable()
export class DemoService {

   
    private API_URL = 'http://localhost:8080';
    
    constructor(private http: HttpClient) {     
    }
    uploadImage(image : File) {
        const formData = new FormData();
        formData.append('image', image);
        return this.http.post(this.API_URL + '/api/upload',formData,{reportProgress: true,observe: 'events' })
        .subscribe(event => {
            console.log(event); // handle event here
          });
            
    }

    showData(){
        return this.http.get(this.API_URL + '/api/showData/').subscribe();      
    }

}