import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';

import is from 'utils/validation';
import { ProjectCategory } from 'constants/projects';
import { Issue, User, Sprint } from '.';

@Entity()
class Project extends BaseEntity implements Record<string, any> {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    url: is.url(),
    category: [is.required(), is.oneOf(Object.values(ProjectCategory))],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar', { nullable: true })
  url: string | null;

  @Column('text', { nullable: true })
  description: string | null;

  @Column('varchar')
  category: ProjectCategory;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => Issue,
    issue => issue.project,
  )
  issues: Issue[];

  @ManyToMany(
    () => User,
    user => user.projects,
  )
  @JoinTable()
  users: User[];

  @OneToMany(
    () => Sprint,
    sprint => sprint.project,
  )
  sprints: Sprint[];
}

export default Project;
