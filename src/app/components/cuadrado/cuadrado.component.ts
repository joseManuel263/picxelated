import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { PintarService } from 'src/app/services/pintar.service';
import { SocketsService } from 'src/app/services/socket.service';


interface Cuadrado {
  id: number;
  color: string;
}
@Component({
  selector: 'app-cuadrado',
  templateUrl: './cuadrado.component.html',
  styleUrls: ['./cuadrado.component.css']
})
export class CuadradoComponent {
  @Input() color: string = ''; // Color inicial transparente
  @Input() id : number = -1;
  @Output() enviarId = new EventEmitter<{ id: number, color: string }>();
  btnPulsado: boolean = false;
  constructor(private pintarService: PintarService) {}
  Icuadrado: Cuadrado = { id: this.id, color: this.color };

  private ws:SocketsService = inject(SocketsService);

  ngOnInit():void{
  }
  public EmpezarPintar() {
    // Cambia el color cuando se hace clic en el cuadrado
    this.color = this.pintarService.colorElegido;
    const cuadrado = { id: this.id, color: this.color };
    this.enviarId.emit(cuadrado);
    this.cambiaPulsador();
    this.ws.Emit(cuadrado);
  }

  public cambiaPulsador(): void {
    this.pintarService.btnPulsado = !this.pintarService.btnPulsado;
  }

  public Pintar(): void {
    if (this.pintarService.btnPulsado) {
      this.color = this.pintarService.colorElegido;
      const cuadrado = { id: this.id, color: this.color };
      this.enviarId.emit(cuadrado);   
    }
  }

  public PararPintar(): void {
    this.pintarService.btnPulsado = false;
  }
  
}

