import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v1 as uuid } from 'uuid';

@Injectable()
export class JogadoresService {
  private jogadores: Jogador[] = [];
  private readonly logger = new Logger(JogadoresService.name);

  async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criarJogadorDto;

    const jogadorCadastrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (jogadorCadastrado) {
      return await this.atualizar(jogadorCadastrado, criarJogadorDto);
    }
    return await this.criar(criarJogadorDto);
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogadorPorEmail(email: string): Promise<Jogador> {
    const jogador = this.jogadores.find((jogador) => jogador.email === email);
    console.log(jogador, email);
    if (!jogador) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado!`,
      );
    } else {
      return jogador;
    }
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(
      (jogador) => jogador.email === email,
    );

    if (!jogadorEncontrado) {
      throw new NotFoundException(
        `Jogador com e-mail ${email} não encontrado!`,
      );
    } else {
      this.jogadores = this.jogadores.filter(
        (jogador) => jogador.email !== jogadorEncontrado.email,
      );
    }
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

  private async atualizar(
    jogadorEncontrado: Jogador,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<void> {
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
  }
}
