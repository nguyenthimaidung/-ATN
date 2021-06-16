import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToMany,
  OneToMany,
  DeleteDateColumn,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Book } from '../book/book.entity'
import { Order } from '../order/order.entity'
import { CartDetail } from './cart-detail.entity'
import { BookRate } from '../comment/book-rate.entity'
import { Account } from '../account/account.entity'

@Entity()
export class User {
  @PrimaryColumn()
  public id: string

  @Column({ length: 100 })
  public name: string

  @Column({ length: 100 })
  public email: string

  @Column({ default: null })
  public phone: string

  @Column({ default: null })
  public address: string

  @Column({ default: null })
  public avatar: string

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @ManyToMany(() => Book, (book) => book.wishingUsers, { nullable: true })
  @JoinTable({
    name: 'book_user_user_book',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'bookId' },
  })
  public wishlist: Book[]

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.user, { nullable: true })
  public cart: CartDetail[]

  @OneToMany(() => Order, (order) => order.user, { nullable: true })
  public orders: Order[]

  @OneToMany(() => BookRate, (bookRate) => bookRate.user, { nullable: true })
  public rates: BookRate[]

  @OneToOne(() => Account, (account) => account.user, { nullable: true })
  @JoinColumn({ name: 'id' })
  account: Account
}
