import { User } from 'src/api/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  leaveType: string;
  @Column()
  startDate: Date;
  @Column()
  endDate: Date;
  @Column()
  comments: string;
  @Column()
  status: 'Approved' | 'Denied' | 'Pending';
  @OneToOne(() => User, (user) => user.leave)
  user: User;
}
