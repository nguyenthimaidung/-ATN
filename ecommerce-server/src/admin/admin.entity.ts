import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Account } from '../account/account.entity'

@Entity()
export class Admin {
  @PrimaryColumn()
  public id: string

  @Column({ length: 100 })
  public name: string

  @Column({ length: 100 })
  public email: string

  @Column({ default: null })
  public phone: string

  @Column({ default: null })
  public avatar: string

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @OneToOne(() => Account, (account) => account.admin, { nullable: true })
  @JoinColumn({ name: 'id' })
  account: Account
}
