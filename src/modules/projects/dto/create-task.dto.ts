import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateMemberDto } from './create-member.dto';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  task_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @ValidateNested({ each: true })
  @Type(() => CreateMemberDto)
  assigned_members: CreateMemberDto[];
}
