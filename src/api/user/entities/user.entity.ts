import { Leave } from 'src/api/leave/entities/leave.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;
  @Column()
  lastName: string;
  @Column()
  dateOfBirth: Date;
  @Column()
  phoneNumber: string;
  @Column()
  address: string;
  @Column()
  passwordHash: string;
  @Column()
  @Unique(['email'])
  email: string;
  @Column()
  dateHired: Date;
  @Column()
  salary: number;
  @Column()
  role: 'Admin' | 'User';
  @OneToOne(() => Leave, (leave) => leave.user)
  @JoinColumn()
  leave: Leave;
  @Column()
  createdAt?: Date;
  @Column()
  updatedAt?: Date;
}
