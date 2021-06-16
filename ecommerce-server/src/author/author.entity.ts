import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm'
import { Book } from '../book/book.entity'
import { Gender } from '../share/common'

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({ default: null })
  public avatar: string

  @Column()
  public name: string

  @Column({ default: null })
  public address: string

  @Column({ type: 'text', default: null })
  public shortDescription: string

  @Column({ type: 'text', default: null })
  public description: string

  @Column({ default: null })
  public birth: Date

  @Column({ default: Gender.UNKNOW })
  public gender: Gender = Gender.UNKNOW

  @ManyToMany(() => Book, (book) => book.authors, { nullable: true })
  @JoinTable({
    name: 'author_book_book_author',
    joinColumn: { name: 'authorId' },
    inverseJoinColumn: { name: 'bookId' },
  })
  public books: Book[]

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date
}
