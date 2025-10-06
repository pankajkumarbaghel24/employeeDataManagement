import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  URL="http://localhost:3000/api/"
  constructor(private http:HttpClient) { }

  getData(routeName:string){
    return this.http.get(this.URL+routeName);
  }

  postData(routeName:string,Data:any){
    return this.http.post(this.URL+routeName,Data);
  }

    putData(routeName:string,Data:any){
    return this.http.put(this.URL+routeName,Data);
  }

    deleteData(routeName:string){
    return this.http.delete(this.URL+routeName);
  }

}
