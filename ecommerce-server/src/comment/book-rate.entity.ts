import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { Book } from '../book/book.entity'
import { User } from '../user/user.entity'

@Entity()
export class BookRate {
  @PrimaryColumn()
  public userId: string

  @PrimaryColumn()
  public bookId: number

  @Column()
  public value: number

  @ManyToOne(() => Book, (book) => book.rates, { nullable: true })
  @JoinColumn({ name: 'bookId' })
  public book: Book

  @ManyToOne(() => User, (user) => user.rates, { nullable: true })
  @JoinColumn({ name: 'userId' })
  public user: User
}
