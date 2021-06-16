import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { Book } from '../book/book.entity'
import { Account } from '../account/account.entity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number

  // any user can comment
  @Column({ default: null })
  public name: string
  @Column({ default: null })
  public phone: string
  @Column({ default: null })
  public email: string

  // user registed
  @Column({ default: null })
  public accountId: string
  @Column({ default: null })
  public rate: number

  // comment content
  @Column({ default: null })
  public bookId: number
  @Column({ type: 'text' })
  public content: string

  // admin reply comment
  @Column({ default: null })
  public parentId: number

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @OneToMany(() => Comment, (comment) => comment.parent, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  public child: Comment[]

  @ManyToOne(() => Comment, (comment) => comment.child, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  public parent: Comment

  @ManyToOne(() => Book, (book) => book.comments, { nullable: true })
  @JoinColumn({ name: 'bookId' })
  public book: Book

  @ManyToOne(() => Account, (account) => account.comments, { nullable: true })
  @JoinColumn({ name: 'accountId' })
  public account: Account
}
