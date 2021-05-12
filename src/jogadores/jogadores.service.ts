import { Injectable, Logger } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v1 as uuid } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    await this.criar(criarJogadorDto);
  }

  private async criar(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { nome, email, telefoneCelular } = criarJogadorDto;

    const jogador: Jogador = {
      _id: uuid(),
      nome,
      telefoneCelular,
      email,
      ranking: 'A',
      posicaoRanking: 1,
      urlFoto: 'https://google.com',
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }
}
