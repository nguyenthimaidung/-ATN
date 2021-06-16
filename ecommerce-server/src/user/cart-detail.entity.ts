import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Book } from '../book/book.entity'
import { User } from './user.entity'

@Entity()
export class CartDetail {
  @PrimaryColumn()
  public bookId: number

  @PrimaryColumn()
  public userId: string

  @Column()
  public quantity: number

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'bookId' })
  public book: Book

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  public user: User
}
