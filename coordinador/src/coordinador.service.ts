import { Injectable } from '@nestjs/common';
import { ConsultaResponse } from './consulta.response.model';
import { ConsultaRequest } from './consulta.request.model';

@Injectable()
export class CoordinadorService {
  consultas(consultaRequest: ConsultaRequest): ConsultaResponse {
    return {
      id: consultaRequest.id,
      message: 'Consulta realizada con éxito',
    };
  }
}
