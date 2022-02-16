import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEnum } from '../enums/activity.enum';
import { User } from '../../authentication/entities/user.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  activity: ActivityEnum;

  @ManyToOne(() => User, (user) => user.activities)
  user: User;

  @Column({
    nullable: true,
  })
  affectedEntity?: string;

  @Column({
    nullable: true,
  })
  affectedIdentifier?: string;

  @Column({
    type: 'datetime',
  })
  createdAt = new Date();
}
