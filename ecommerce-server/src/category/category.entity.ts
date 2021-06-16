import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm'
import { Book } from '../book/book.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @Column({ default: null })
  public parentId: number

  @OneToMany(() => Category, (category) => category.parent, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  public child: Category[]

  @ManyToOne(() => Category, (category) => category.child, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  public parent: Category

  @ManyToMany(() => Book, (book) => book.categories, { nullable: true })
  public books: Category

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date
}
