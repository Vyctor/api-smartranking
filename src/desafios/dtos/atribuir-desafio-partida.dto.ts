import { IsNotEmpty } from 'class-validator';
import { Jogador } from '../../jogadores/interfaces/jogador.interface';
import { Resultado } from '../../desafios/interfaces/desafio.interface';
export class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}
