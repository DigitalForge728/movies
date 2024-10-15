import { MinLength, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string

	@IsString()
	@IsNotEmpty()
	@MinLength(6, { message: 'Password is too short' })
	password: string
}
