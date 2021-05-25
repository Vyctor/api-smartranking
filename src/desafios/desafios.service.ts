import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { CategoriasService } from '../categorias/categorias.service';
import DesafioStatus from './enuns/desafio-status.enum';
import { Partida } from '../desafios/interfaces/desafio.interface';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private readonly jogadoresService: JogadoresService,
    private readonly categoriasService: CategoriasService,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    // Verificar se os jogadores informados estão cadastrados
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

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
    return await this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async consultarDesafiosPorIdJogador(_id: any): Promise<Array<Desafio>> {
    const jogadores = await this.jogadoresService.consultarTodosJogadores();

    const jogadorFilter = jogadores.filter((jogador) => jogador._id === _id);

    if (jogadorFilter.length === 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
  }

  async atualizarDesafio(
    _id: string,
    atualizarDesafioDto: AtualizarDesafioDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    //Atualizaremos a data da resposta quando o status do desafio vier preenchido
    if (atualizarDesafioDto.status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }
    desafioEncontrado.status = atualizarDesafioDto.status;
    desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }

  async atribuirDesafioPartida(
    _id: string,
    atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    // Verificar se o jogador vencedor faz parte do desafio
    const jogadorFilter = desafioEncontrado.jogadores.filter(
      (jogador) => jogador._id === atribuirDesafioPartidaDto.def,
    );

    this.logger.log(`desafio encontrado: ${desafioEncontrado}`);
    this.logger.log(`jogadorFilter: ${jogadorFilter}`);

    if (jogadorFilter.length === 0) {
      throw new BadRequestException(
        `O jogador venceder não faz parte do desafio`,
      );
    }

    // Criar e persistir o objeto partida
    const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto);

    // Atribuir ao objeto partida a categoria recuperada no desafio
    partidaCriada.categoria = desafioEncontrado.categoria;

    // Atribuir ao objeto partida os jogadores que fizeram parte do desafio
    partidaCriada.jogadores = desafioEncontrado.jogadores;

    const resultado = await partidaCriada.save();

    //Quando uma partida for registrada por um usuário, mudaremos o status do desafio para realizado
    desafioEncontrado.status = DesafioStatus.REALIZADO;

    //Recuperamos o ID da partida e atribuimos ao desafio
    desafioEncontrado.partida = resultado._id;

    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      /*
        Se a atualização do desafio falhar excluímos a partida 
        gravada anteriormente
      */
      await this.partidaModel.deleteOne({ _id: resultado._id }).exec();
      throw new InternalServerErrorException();
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();

    if (!desafioEncontrado) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    // Realizaremos a deleção lógica do desafio, modificando seu status para CANCELADO
    desafioEncontrado.status = DesafioStatus.CANCELADO;

    await this.desafioModel
      .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
      .exec();
  }
}
