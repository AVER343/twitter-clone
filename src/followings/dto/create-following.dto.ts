import { IsNumber } from "class-validator";

export class CreateFollowingDto {
    @IsNumber()
    followed: number;

}
