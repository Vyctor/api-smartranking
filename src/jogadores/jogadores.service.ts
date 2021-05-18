import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criarJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (!jogadorEncontrado) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} já cadastrado!`,
      );
    }

    const novoJogador = new this.jogadorModel(criarJogadorDto);
    return await novoJogador.save();
  }

  async atualizarJogador(
    _id: string,
    criarJogadorDto: CriarJogadorDto,
  ): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${_id} não encontrado!`);
    }
    return await this.jogadorModel
      .findOneAndUpdate({ _id }, { $set: criarJogadorDto })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadorModel.find().exec();
  }

  async consultarJogadorPorId(_id: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findById({ _id }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com email ${_id} não encontrado`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    return await this.jogadorModel.findByIdAndDelete({ _id }).exec();
  }
}
