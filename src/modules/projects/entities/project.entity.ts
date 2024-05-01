import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type projectDocument = Projects & Document;

@Schema()
export class Members {
  @Prop({ type: String })
  name: string;
}
const MemberSchema = SchemaFactory.createForClass(Members);

@Schema()
export class RecentActivities {
  @Prop({ type: String })
  title: string;
}
const RecentActivitiesSchema = SchemaFactory.createForClass(RecentActivities);

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Tasks {
  @Prop({ type: String })
  task_id: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  deadline: string;

  @Prop({ type: Boolean, default: false })
  completed: boolean;

  @Prop({
    required: [false, 'prescriptions should not be empty'],
    type: [MemberSchema],
    default: [],
  })
  assigned_members: Members[];
}
const TaskSchema = SchemaFactory.createForClass(Tasks);

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'projects',
})
export class Projects {
  @Prop({
    required: [false, 'tasks should not be empty'],
    type: [TaskSchema],
    default: [],
  })
  tasks: Tasks[];

  @Prop({
    required: [false, 'team_members should not be empty'],
    type: [MemberSchema],
    default: [],
  })
  team_members: Members[];

  @Prop({
    required: [false, 'recent_activities should not be empty'],
    type: [RecentActivitiesSchema],
    default: [],
  })
  recent_activities: RecentActivities[];
}

export const ProjectSchema = SchemaFactory.createForClass(Projects);
