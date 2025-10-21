import { Type } from "class-transformer";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class MarkMultipleAsReadDto {
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}
