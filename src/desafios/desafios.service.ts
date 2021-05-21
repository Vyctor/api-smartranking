import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { CategoriasService } from '../categorias/categorias.service';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const { jogadores, solicitante } = criarDesafioDto;

    for (const jogador of jogadores) {
      const jogadorEncontrado =
        await this.jogadoresService.consultarJogadorPorId(jogador.id);

      if (!jogadorEncontrado) {
        throw new NotFoundException(
          `O jogador ${jogador.nome} não foi encontrado!`,
        );
      }
    }

    const solicitanteEhUmDosJogadores = jogadores.some(
      (jogador) => jogador.id === solicitante.id,
    );

    if (!solicitanteEhUmDosJogadores) {
      throw new BadRequestException(
        `O solicitante ${solicitante.nome} não é um dos jogadores participantes no desafio`,
      );
    }
  }
}
