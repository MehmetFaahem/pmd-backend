import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';
import { CreateMemberDto } from './create-member.dto';
import { CreateActivityDto } from './create-activity.dto';

export class CreateProjectDto {
  @IsArray()
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];

  @IsArray()
  @Type(() => CreateMemberDto)
  team_members: CreateMemberDto[];

  @IsArray()
  @Type(() => CreateActivityDto)
  recent_activities: CreateActivityDto[];
}
