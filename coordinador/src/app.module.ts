import { Module } from '@nestjs/common';
import { CoordinadorController } from './coordinador.controller';
import { CoordinadorService } from './coordinador.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CoordinadorController],
  providers: [CoordinadorService],
})
export class AppModule {}
