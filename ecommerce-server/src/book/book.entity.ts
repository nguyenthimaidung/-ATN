import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm'
import { Author } from '../author/author.entity'
import { Category } from '../category/category.entity'
import { OrderDetail } from '../order/order-detail.entity'
import { CartDetail } from '../user/cart-detail.entity'
import { User } from '../user/user.entity'
import { Comment } from '../comment/comment.entity'
import { BookRate } from '../comment/book-rate.entity'

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ default: null })
  public thumbImg1: string
  @Column({ default: null })
  public thumbImg2: string
  @Column({ default: null })
  public thumbImg3: string
  @Column({ default: null })
  public thumbImg4: string
  @Column({ default: null })
  public thumbImg5: string
  @Column({ default: null })
  public coverImage: string

  @Column({ default: null })
  public isbn: string
  @Column()
  public name: string
  @Column({ type: 'text', default: null })
  public shortDescription: string
  @Column({ type: 'text', default: null })
  public description: string
  @Column()
  public quantity: number

  @Column()
  public price: number
  @Column({ default: 0 })
  public discount: number
  @Column({ default: null })
  public discountBegin: Date
  @Column({ default: null })
  public discountEnd: Date

  @Column({ default: null, type: 'float' })
  public rateAvg: number
  @Column({ default: 0 })
  public rateCount: number
  @Column({ default: 0 })
  public quantitySold: number
  @Column({ default: 0 })
  public viewCount: number

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date
  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date
  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @ManyToMany(() => Category, (category) => category.parent, { nullable: true })
  @JoinTable({
    name: 'book_category_category_book',
    joinColumn: { name: 'bookId' },
    inverseJoinColumn: { name: 'categoryId' },
  })
  public categories: Category[]

  @ManyToMany(() => Author, (author) => author.books, { nullable: true })
  public authors: Author[]

  @ManyToMany(() => User, (user) => user.wishlist, { nullable: true })
  public wishingUsers: User[]

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.book, { nullable: true })
  public orderDetails: OrderDetail[]

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.book, { nullable: true })
  public cartDetails: CartDetail[]

  @OneToMany(() => Comment, (comment) => comment.book, { nullable: true })
  public comments: Comment[]

  @OneToMany(() => BookRate, (bookRate) => bookRate.book, { nullable: true })
  public rates: BookRate[]
}
