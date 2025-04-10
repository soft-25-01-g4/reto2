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
        message: 'No se puede procesar, el cuerpo del request es requerido',
      };
    }
    const results = await Promise.allSettled(
      this.urls.map((url) => this.forwardPost(url, consultaRequest)),
    );

    console.dir(results, { depth: null });
    const validResponses: ConsultaResponse[] = results
      .filter(
        (r): r is PromiseFulfilledResult<{ status: number; data: ConsultaResponse }> =>
          r.status === 'fulfilled' && r.value.status === 200
      )
      .map((r) => r.value.data);

    // Con las respuestas de los servicios invocar el voting
    const resultadoVoting = this.voting(validResponses);
    
    this.logToFile( `match: ${resultadoVoting.match}, id_pedido: ${resultadoVoting.data.id_pedido},` +
      ` response 1: ${JSON.stringify(validResponses[0])},` +
      ` response 2: ${JSON.stringify(validResponses[1])},` +
      ` response 3: ${JSON.stringify(validResponses[2])}`);

    return {
      match: resultadoVoting.match,
      data: resultadoVoting.data,
    };
  }

  private voting(responses: ConsultaResponse[]): {
    match: boolean;
    data: ConsultaResponse;
  } {

    const contador = new Map<string, { count: number; data: ConsultaResponse }>();
    
    // Contar votos por cada objeto
    for (const r of responses) {
      const key = r.cantidad.toString();
      if (!contador.has(key)) {
        contador.set(key, { count: 1, data: r });
      } else {
        contador.get(key)!.count++;
      }
    }
  
    // Buscar el objeto más votado
    let ganador: { count: number; data: ConsultaResponse } | null = null;
    for (const item of contador.values()) {
      if (!ganador || item.count > ganador.count) {
        ganador = item;
      }
    }
  
    const match = responses.length === (ganador?.count || 0);
    return {
      match,
      data: ganador!.data
    };
  }

 private  logToFile(message: string) {
  const dirPath = '/opt/data';
  console.log(dirPath)
  const filePath = path.join(dirPath, 'coordinador.txt');
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;

  try {
    fs.mkdirSync(dirPath, { recursive: true }); 
    fs.appendFileSync(filePath, fullMessage);   
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

private async forwardPost(url: string, data: any): Promise<{ status: number; data: ConsultaResponse }> {
  const response = await firstValueFrom(this.httpService.post(url, data));
  return {
    status: response.status, 
    data: response.data       
  };
}
}
