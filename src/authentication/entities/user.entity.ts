import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Activity } from '../../logging/entities/activity.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    type: 'boolean',
    width: 1,
  })
  isAdmin: boolean;

  @Column()
  phoneNumber: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
