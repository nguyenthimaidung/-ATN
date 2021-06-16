import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { Book } from '../book/book.entity'
import { Order } from './order.entity'

@Entity()
export class OrderDetail {
  @PrimaryColumn()
  public bookId: number

  @PrimaryColumn()
  public orderId: number

  @Column({ default: null })
  public name: string

  @Column()
  public quantity: number

  @Column({ default: null })
  public price: number

  @Column({ default: null })
  public discount: number

  @Column({ default: null })
  public subTotal: number

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  book: Book

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order
}
