import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm'
import { User } from '../user/user.entity'
import { OrderDetail } from './order-detail.entity'
import { OrderPayState, OrderPayType, OrderState } from './order.interface'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public address: string

  @Column()
  public phone: string

  @Column()
  public email: string

  @Column()
  public name: string

  @Column({ default: null })
  public note: string

  @Column({ default: OrderState.DRAFT })
  public state: OrderState

  @Column({ default: OrderPayState.NONE })
  public payState: OrderPayState

  @Column({ default: OrderPayType.CASH })
  public payType: OrderPayType

  @Column()
  public deliveryFee: number

  @Column()
  public totalOrder: number

  @Column({ default: null })
  public userId: string

  @Column({ default: null })
  public verifyCode: string

  @Column({ default: null })
  public verifyCodeExp: Date

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, { nullable: true })
  public details: OrderDetail[]

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId' })
  public user: User
}
