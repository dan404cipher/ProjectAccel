import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import is from 'utils/validation';
import { Project, Issue } from '.';

@Entity()
class Sprint extends BaseEntity implements Record<string, any> {
  static validations = {
    name: [is.required(), is.maxLength(100)],
    startDate: is.required(),
    endDate: is.required(),
  };

  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp')
  endDate: Date;

  @Column('varchar', { default: 'active' })
  status: 'active' | 'completed' | 'planned';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(
    () => Project,
    project => project.sprints,
  )
  @JoinColumn()
  project: Project;

  @Column('integer')
  projectId: number;

  @OneToMany(
    () => Issue,
    issue => issue.sprint,
  )
  issues: Issue[];
}

export default Sprint; 