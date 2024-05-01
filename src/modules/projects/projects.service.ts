import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Projects, projectDocument } from './entities/project.entity';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Projects.name)
    private projectModel: Model<projectDocument>,
  ) {}

  public async create(createProjectDto: CreateProjectDto): Promise<Projects> {
    const newProject = await this.projectModel.create(createProjectDto);
    await newProject.save();
    return newProject;
  }

  public async createTask(createDto: CreateTaskDto, id: String) {
    const exists = await this.projectModel
      .findOne({
        _id: id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid project id.');
    await this.projectModel.updateOne(
      { _id: exists._id },
      {
        $addToSet: {
          tasks: {
            name: createDto.name,
            description: createDto.description,
            deadline: createDto.deadline,
            assigned_members: createDto.assigned_members,
          },
        },
      },
    );
    return exists;
  }

  public async addMember(createDto: CreateMemberDto, id: String) {
    const exists = await this.projectModel
      .findOne({
        _id: id,
      })
      .select('_id');
    if (!exists) throw new BadRequestException('Invalid project id.');
    await this.projectModel.updateOne(
      { _id: exists._id },
      {
        $addToSet: {
          team_members: {
            name: createDto.name,
          },
        },
      },
    );
    return exists;
  }

  public async setAsMarked(id: string, updateDto: UpdateTaskDto) {
    const exists = await this.projectModel
      .findOne({
        'tasks.task_id': id,
      })
      .select(['_id', 'tasks', 'team_members', 'recent_activities']);

    if (!exists) throw new BadRequestException('Invalid user id.');

    const filtered_tasks = exists.tasks.filter(({ task_id }) => task_id !== id);
    const marking_task = exists.tasks.find(({ task_id }) => task_id == id);

    await this.projectModel.updateOne(
      { _id: exists._id },
      {
        $set: {
          tasks: [
            ...filtered_tasks,
            {
              task_id: marking_task.task_id,
              name: marking_task.name,
              description: marking_task.description,
              deadline: marking_task.deadline,
              completed: true,
              assigned_members: marking_task.assigned_members,
            },
          ],
        },
      },
    );
    await exists.save();
    return exists;
  }

  async findAllProjects() {
    const users = await this.projectModel
      .find({})
      .sort({ created_at: -1 })
      .select(['_id', 'tasks', 'team_members', 'recent_activities']);
    return users;
  }

  public async updateTask(id: string, updateDto: UpdateTaskDto) {
    const exists = await this.projectModel
      .findOne({
        'tasks.task_id': id,
      })
      .select(['_id', 'tasks', 'team_members', 'recent_activities']);

    if (!exists) throw new BadRequestException('Invalid user id.');

    await this.projectModel.updateOne(
      { _id: exists._id },
      {
        $set: {
          tasks: [
            ...exists.tasks.filter(({ task_id }) => task_id !== id),
            {
              task_id: updateDto.task_id,
              name: updateDto.name,
              description: updateDto.description,
              deadline: updateDto.deadline,
              completed: updateDto.completed,
              assigned_members: updateDto.assigned_members,
            },
          ],
        },
      },
    );
    await exists.save();
    return exists;
  }

  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<projectDocument> {
    const user = await this.projectModel
      .findOne({ _id: id })
      .select(['_id', 'tasks', 'team_members', 'recent_activities']);

    if (!user) throw new BadRequestException('Invalid ID');

    Object.keys(updateProjectDto).forEach((key) => {
      user[key] = updateProjectDto[key];
    });

    await user.save();
    return user;
  }

  async removeProject(id: string) {
    const user = await this.projectModel
      .findOneAndDelete({ _id: id })
      .select(['_id']);

    if (!user) throw new BadRequestException('Invalid ID');
    return user;
  }
}
