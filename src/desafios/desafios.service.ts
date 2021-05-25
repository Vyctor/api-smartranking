import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { CategoriasService } from '../categorias/categorias.service';
import DesafioStatus from './enuns/desafio-status.enum';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    // Verificar se os jogadores informados estão cadastrados
    criarDesafioDto.jogadores.map((jogadorDto) => {
      const jogadorFilter = jogadores.filter(
        (jogador) => jogador._id === jogadorDto._id,
      );

      if (jogadorFilter.length === 0) {
        throw new BadRequestException(
          `O id ${jogadorDto._id} não é um jogador!`,
        );
      }
    });

    // Verificar se o solicitante é um dos jogadores da partida
    const solicitanteEhJogadorDaPartida = criarDesafioDto.jogadores.filter(
      (jogador) => jogador._id === criarDesafioDto.solicitante,
    );

    if (!solicitanteEhJogadorDaPartida) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    // Descobrimos a categoria com base no ID do Jogador Solicitante
    const categoriaDoJogador =
      await this.categoriasService.consultarCategoriaDoJogador(
        criarDesafioDto.solicitante,
      );

    if (!categoriaDoJogador) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const desafioCriado = new this.desafioModel(criarDesafioDto);
    desafioCriado.categoria = categoriaDoJogador.categoria;
    desafioCriado.dataHoraSolicitacao = new Date();
    /*
    Quando um desafio for criado, definimos o status desafio como pendente
    */
    desafioCriado.status = DesafioStatus.PENDENTE;
    this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
    return await desafioCriado.save();
  }

  async consultarTodosDesafios(): Promise<Array<Desafio>> {
    return this.desafioModel.find().populate('desafios').exec();
  }

  async consultarDesafiosPorIdJogador(
    idJogador: string,
  ): Promise<Array<Desafio>> {
    return this.desafioModel.find({ idJogador }).where('jogadores').exec();
  }
}
