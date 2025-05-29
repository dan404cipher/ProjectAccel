import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne
} from 'typeorm';

import is from 'utils/validation';
import { Comment, Issue, Project } from '.';

@Entity()
class User extends BaseEntity implements Record<string, any> {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    email: [is.required(), is.email(), is.maxLength(200)],
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar', { length: 2000 })
  avatarUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => Comment,
    comment => comment.user,
  )
  comments: Comment[];

  @ManyToMany(
    () => Issue,
    issue => issue.users,
  )
  issues: Issue[];

  @ManyToMany(
    () => Project,
    project => project.users,
  )
  projects: Project[];

  @Column('integer', { nullable: true })
  currentProjectId: number;

  @ManyToOne(
    () => Project,
    { nullable: true }
  )
  currentProject: Project;
}

export default User;
