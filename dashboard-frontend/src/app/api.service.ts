import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: {}
  };

  getApi(apiUrl: string): Observable<any> {
    return this.http.get<any>(apiUrl, this.httpOptions)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  postApi(apiUrl: string, body: any, headers?: any): Observable<any> {
    const options = Object.assign({}, this.httpOptions);
    if (headers) {
      options.headers = new HttpHeaders(headers);
    }
    return this.http.post<any>(apiUrl, body, options)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  putApi(apiUrl: string, body: any, headers?: any): Observable<any> {
    const options = Object.assign({}, this.httpOptions);
    if (headers) {
      options.headers = new HttpHeaders(headers);
    }
    return this.http.put<any>(apiUrl, body, options)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  deleteApi(apiUrl: string, headers?: any): Observable<any> {
    const options = Object.assign({}, this.httpOptions);
    if (headers) {
      options.headers = new HttpHeaders(headers);
    }
    return this.http.delete<any>(apiUrl, options)
      .pipe(
        map(response => response),
        catchError(this.handleError)
      );
  }

  private handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    // alert(errorMessage);
    return throwError(errorMessage);
 }

}
