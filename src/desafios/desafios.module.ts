import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafioSchema } from './interfaces/desafio.schema';
import { JogadoresModule } from '../jogadores/jogadores.module';
import { CategoriasService } from '../categorias/categorias.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Desafios', schema: DesafioSchema }]),
    JogadoresModule,
    CategoriasService,
  ],
  providers: [DesafiosService],
  controllers: [DesafiosController],
})
export class DesafiosModule {}
