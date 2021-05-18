import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JogadoresValidacaoParametrosPipe } from './pipes/jogadores-validacao-parametros.pipe';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    await this.jogadoresService.criarJogador(criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() criarJogadorDto: CriarJogadorDto,
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    await this.jogadoresService.atualizarJogador(_id, criarJogadorDto);
  }

  @Get('/:_id')
  async consultarJogadorPeloId(
    @Param('_id', JogadoresValidacaoParametrosPipe) id: string,
  ): Promise<Jogador> {
    return this.jogadoresService.consultarJogadorPorId(id);
  }

  @Get()
  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadoresService.consultarTodosJogadores();
  }

  @Delete('/:id')
  async deletarJogador(
    @Param('_id', JogadoresValidacaoParametrosPipe) _id: string,
  ): Promise<void> {
    return this.jogadoresService.deletarJogador(_id);
  }
}
