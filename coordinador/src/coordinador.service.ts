import { Injectable } from '@nestjs/common';
import { ConsultaResponse } from './consulta.response.model';
import { ConsultaRequest } from './consulta.request.model';
import { ConsultaError } from './request.error.model';

@Injectable()
export class CoordinadorService {
  consultas(
    consultaRequest: ConsultaRequest,
  ): ConsultaResponse | ConsultaError {
    if (consultaRequest === undefined) {
      return {
        message: 'No se piuede procesar, el cuerpo del request es requerido',
      };
    }
    return {
      id_detalle_pedido: 1,
      id_pedido: 1,
      id_inventario: 1,
      cantidad: 1,
    };
  }
}
