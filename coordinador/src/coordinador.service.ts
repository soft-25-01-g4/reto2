import { Injectable } from '@nestjs/common';
import { ConsultaResponse } from './consulta.response.model';
import { ConsultaRequest } from './consulta.request.model';
import { ConsultaError } from './request.error.model';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class CoordinadorService {
  private urls = [
   
  process.env.SERVICE_URL_1 || 'http://localhost:5000/consulta',
  process.env.SERVICE_URL_2 || 'http://localhost:8080/consulta',
  ];
  constructor(private readonly httpService: HttpService) {}

  async consultas(
    consultaRequest: ConsultaRequest,
  ) {
    if (consultaRequest === undefined) {
      return {
        message: 'No se piuede procesar, el cuerpo del request es requerido',
      };
    }
  
    const results = await Promise.allSettled(
      this.urls.map((url) => this.forwardPost(url, consultaRequest)),
    );
    console.log('Results:', results);
    const responses = results.map((res, i) => ({
      url: this.urls[i],
      success: res.status === 'fulfilled',
      data: res.status === 'fulfilled' ? res.value : res.reason.message,
    }));

    const successfulResponses = responses.filter(r => r.success) as {
      url: string;
      success: true;
      data: ConsultaResponse;
    }[];
    
    const allMatch =
      successfulResponses.every(r =>
        this.compareConsultaResponses(r.data, successfulResponses[0].data)
      );
    return {
      allMatch,
      responses,
    };
  }

  private compareConsultaResponses(a: ConsultaResponse, b: ConsultaResponse): boolean {
    return (
      a.id_detalle_pedido === b.id_detalle_pedido &&
      a.id_pedido === b.id_pedido &&
      a.id_inventario === b.id_inventario &&
      a.cantidad === b.cantidad
    );
  }

  private async forwardPost(url: string, data: any): Promise<any> {
    const response = await firstValueFrom(this.httpService.post(url, data));
    return response.data;
  }
}
