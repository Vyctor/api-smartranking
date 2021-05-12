import { Controller, Post } from '@nestjs/common';

@Controller('api/v1/jogadores')
export class JogadoresController {
  // TODO: verificar se vai ficar assim, caso sim, refatorar para create and update separadamente
  @Post()
  async criarAtualizarJogador() {
    return JSON.stringify({
      nome: 'Vyctor',
    });
  }
}
