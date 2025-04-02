import { Module } from '@nestjs/common';
import { CoordinadorController } from './coordinador.controller';
import { CoordinadorService } from './coordinador.service';

@Module({
  imports: [],
  controllers: [CoordinadorController],
  providers: [CoordinadorService],
})
export class AppModule {}
