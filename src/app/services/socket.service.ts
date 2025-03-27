import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface MessageReturn {
  Id: number;
  Color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketsService {

  private socket: WebSocket = new WebSocket('ws://172.16.230.98:9001');
  private socketOpenPromise: Promise<void>;
  private observable: Subject<MessageReturn> = new Subject<MessageReturn>;

  constructor() { 
    this.socketOpenPromise = new Promise<void>((resolve, reject) => {
      this.socket.onopen = () => {
        console.log('Connect');
        resolve();
      };
      this.socket.onerror = (event) => {
        reject(event);
      };
    });

    this.socket.onclose = () => {
      console.log('Disconnect');
    };

    this.socket.onmessage = (event) => {
      try {
        console.log(event.data);
        
        const jsonObject: MessageReturn = JSON.parse(event.data);
        this.observable.next(jsonObject);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
  }
  public listen(): Observable<MessageReturn> {
    return new Observable<MessageReturn>(observer => {
      this.observable.subscribe((eventMessage: MessageReturn) => {
        observer.next(eventMessage);
      });
    });
  }

  public async Emit(content : any){
    try {
      await this.socketOpenPromise;
      this.socket.send(JSON.stringify(content));
    } catch (error) {
      console.error('Error connecting', error);
    }
  }
}