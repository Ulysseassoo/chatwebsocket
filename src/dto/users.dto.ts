export class CreateUserDto {
  username: string;
  password: string;
  color?: string;
}

export class UpdateColorDto {
  color: string;
}
