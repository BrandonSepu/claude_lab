import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatRequest, ChatResponse } from './chat.models';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/api/ConsultarFunction`;

  constructor(private http: HttpClient) {}

  send(pregunta: string): Observable<ChatResponse> {
    const request: ChatRequest = { pregunta };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'competencialab'
    });

    return this.http.post<ChatResponse>(this.apiUrl, request, { headers });
  }
}
