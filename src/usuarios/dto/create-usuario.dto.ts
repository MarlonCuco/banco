import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @Length(13, 13, { message: 'El DPI debe tener 13 dígitos' })
  dpi: string;

  @IsEmail()
  correo: string;

  @IsInt()
  @IsOptional()
  rolId?: number;
}