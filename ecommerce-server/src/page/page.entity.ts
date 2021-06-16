import { Column, CreateDateColumn, Entity, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, Index } from 'typeorm'

@Entity()
export class Page {
  @PrimaryColumn()
  public path: string

  @Column({ type: 'text' })
  public content: string

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date
}
