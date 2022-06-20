import { Length } from 'class-validator';

export class CreateContentDto {
	@Length(1, 150)
	content: string;
	@Length(1, 50)
	title: string;
}
