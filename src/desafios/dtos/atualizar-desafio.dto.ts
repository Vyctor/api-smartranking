import { IsDate, IsOptional } from 'class-validator';
import DesafioStatus from '../../desafios/enuns/desafio-status.enum';
export class AtualizarDesafioDto {
  @IsOptional()
  @IsDate()
  dataHoraDesafio: Date;

  @IsOptional()
  status: DesafioStatus;
}
