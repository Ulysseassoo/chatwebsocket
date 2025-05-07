import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'A username is required' })
  username: string;
  @IsString()
  @IsNotEmpty({ message: 'A password is required' })
  password: string;
  color?: string;
}

export class UpdateColorDto {
  @IsString()
  @IsNotEmpty({ message: 'A color is required' })
  color: string;
}
