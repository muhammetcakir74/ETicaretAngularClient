import { Injectable } from '@angular/core';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionState } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  constructor() { }

  private _connection:HubConnection;
  get connection():HubConnection {
    return this._connection;
  }

  start(hubUrl:string) {
    if(!this._connection || this._connection?.state == HubConnectionState.Disconnected){
      const builder : HubConnectionBuilder = new HubConnectionBuilder();
      
      const hubConnection : HubConnection = builder.withUrl(hubUrl).withAutomaticReconnect().build();

      hubConnection.start().then(() => {
        console.log("Connected");
      })
      .catch(error => setTimeout(() => this.start(hubUrl), 2000));

      this._connection = hubConnection
    }

    this._connection.onreconnected(connectionId => {
      console.log("Reconnected");
    });
    this._connection.onreconnecting(error => {
      console.log("Reconnecting");
    });
    this._connection.onclose(error => {
      console.log("Close reconnection");
    });
  }

  invoke(procedurName:string,message:any,successCallBack?: (value) => void, errorCallBack?: (error) => void) {
    this._connection.invoke(procedurName, message)
    .then(successCallBack)
    .catch(errorCallBack);
  }

  on(procedurName:string, callBack:(...message : any) => void ) {
    this._connection.on(procedurName,callBack);
  }

}
