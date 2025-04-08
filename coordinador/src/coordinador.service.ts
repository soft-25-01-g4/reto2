import { Injectable } from '@nestjs/common';
import { ConsultaResponse } from './consulta.response.model';
import { ConsultaRequest } from './consulta.request.model';
import { ConsultaError } from './request.error.model';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class CoordinadorService {
  private urls = [
   
    process.env.SERVICE_URL_1 || 'https://consultas-js-juank1400-dev.apps.rm3.7wse.p1.openshiftapps.com/consulta',
    process.env.SERVICE_URL_2 || 'https://consultas-jv-juank1400-dev.apps.rm3.7wse.p1.openshiftapps.com/consulta',
    process.env.SERVICE_URL_3 || 'https://consultas-py-juank1400-dev.apps.rm3.7wse.p1.openshiftapps.com/consulta',
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
    
    this.logToFile(`match: ${allMatch}, id_pedido: ${successfulResponses[0].data.id_pedido}, response 1: ${successfulResponses[0].data.cantidad} , response 2: ${successfulResponses[1].data.cantidad}   , response 3: ${successfulResponses[2].data.cantidad}  `);

    return {
      allMatch,
      responses,
    };
  }

  private compareConsultaResponses(a: ConsultaResponse, b: ConsultaResponse): boolean {
    return (
      a.id_detalle_pedido.toString() === b.id_detalle_pedido.toString() &&
      a.id_pedido.toString() === b.id_pedido.toString() &&
      a.id_inventario.toString() === b.id_inventario.toString() &&
      a.cantidad.toString() === b.cantidad.toString()
    );
  }

 private  logToFile(message: string) {
  const dirPath = '/opt/data'; // absolute path at root
  const filePath = path.join(dirPath, 'coordinador.txt');
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;

  try {
    fs.mkdirSync(dirPath, { recursive: true }); // ✅ Create the folder if it doesn't exist
    fs.appendFileSync(filePath, fullMessage);   // ✅ Write log to file
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

  private async forwardPost(url: string, data: any): Promise<any> {
    const response = await firstValueFrom(this.httpService.post(url, data));
    return response.data;
  }
}
