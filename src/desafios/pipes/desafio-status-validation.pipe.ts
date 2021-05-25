import { PipeTransform, BadRequestException } from '@nestjs/common';
import DesafioStatus from '../../desafios/enuns/desafio-status.enum';
export class DesafioStatusValidationPipe implements PipeTransform {
  readonly statusPermitidos = [
    DesafioStatus.ACEITO,
    DesafioStatus.NEGADO,
    DesafioStatus.CANCELADO,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private ehStatusValido(status: any) {
    const index = this.statusPermitidos.indexOf(status);
    return index !== -1;
  }
}
