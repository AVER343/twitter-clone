import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export default class GetWallDTO {
	@Type(() => Number)
	page: number;
}
