import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafiosService } from './desafios.service';
import { Param } from '@nestjs/common';

@Controller('api/v1/desafios')
export class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  private readonly logger = new Logger(DesafiosController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async criarDesafio(
    @Body() criarDesafioDto: CriarDesafioDto,
  ): Promise<Desafio> {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(criarDesafioDto)}`);
    return await this.desafiosService.criarDesafio(criarDesafioDto);
  }

  @Get()
  async consultarTodosDesafios(): Promise<Array<Desafio>> {
    return await this.desafiosService.consultarTodosDesafios();
  }

  @Get('/:idJogador')
  @UsePipes(ValidationPipe)
  async consultarCategoriaPorId(
    @Param('idJogador') idJogador: string,
  ): Promise<Array<Desafio>> {
    return await this.desafiosService.consultarDesafiosPorIdJogador(idJogador);
  }
}
