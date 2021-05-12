import { Body, Controller, Post } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {
  // TODO: verificar se vai ficar assim, caso sim, refatorar para criar e atualizar separadamente
  @Post()
  async criarAtualizarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const { nome, email } = criarJogadorDto;
    return JSON.stringify({
      nome,
      email,
    });
  }
}
