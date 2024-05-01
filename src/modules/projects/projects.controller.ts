import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/')
  async create(@Body() createProjectDto: CreateProjectDto) {
    const project = await this.projectsService.create(createProjectDto);
    return {
      message: 'Project Created Successfully',
      data: project,
    };
  }

  @Post('/task/:id')
  async createTask(@Param('id') id: string, @Body() createDto: CreateTaskDto) {
    const task = await this.projectsService.createTask(createDto, id);
    return {
      message: 'created successfully',
      data: task,
    };
  }

  @Post('/member/:id')
  async createMember(
    @Param('id') id: string,
    @Body() createDto: CreateMemberDto,
  ) {
    const member = await this.projectsService.addMember(createDto, id);
    return {
      message: 'created successfully',
      data: member,
    };
  }

  @Patch('/mark/:id')
  async markAsCompleted(
    @Param('id') id: string,
    @Body() updateDto: UpdateTaskDto,
  ) {
    const ourService = await this.projectsService.setAsMarked(id, updateDto);
    return {
      message: 'marked successfully',
      data: ourService,
    };
  }

  @Get('/')
  async findAllProjects() {
    const users = await this.projectsService.findAllProjects();
    return {
      message: 'projects Fetched Successfully',
      data: users,
    };
  }

  @Put('/task/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const user = await this.projectsService.updateTask(id, updateTaskDto);
    return {
      message: 'task Updated Successfully',
      data: user,
    };
  }

  @Put('/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const user = await this.projectsService.updateProject(id, updateProjectDto);
    return {
      message: 'project Updated Successfully',
      data: user,
    };
  }

  @Delete('/:id')
  async removeProject(@Param('id') id: string) {
    const project = await this.projectsService.removeProject(id);
    return {
      message: 'removed successfully',
      data: project,
    };
  }
}
