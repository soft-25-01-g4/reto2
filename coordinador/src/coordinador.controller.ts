import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { ConsultaRequest } from './consulta.request.model';
import { ConsultaResponse } from './consulta.response.model';
import { Response } from 'express';
import { ConsultaError } from './request.error.model';

@Controller('consultas')
export class CoordinadorController {
  constructor(private readonly coordinadorService: CoordinadorService) {}

  @Post()
  consultas(
    @Res() response: Response,
    @Body() consultaRequest: ConsultaRequest,
  ): Response {
    if (!consultaRequest) {
      const error: ConsultaError = {
        message: 'Body is required',
      };
      return response.status(HttpStatus.BAD_REQUEST).send(error);
    }
    const consultaResponse: ConsultaResponse =
      this.coordinadorService.consultas(consultaRequest);
    return response.status(HttpStatus.OK).send(consultaResponse);
  }
}
