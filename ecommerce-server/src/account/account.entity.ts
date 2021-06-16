import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'
import * as crypto from 'crypto'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeUpdate,
  DeleteDateColumn,
  Unique,
  OneToMany,
  OneToOne,
} from 'typeorm'

import { AccountState, UserTypeEnum } from './account.interfaces'
import { UUID } from '../share/uuid.util'
import { Comment } from '../comment/comment.entity'
import { User } from '../user/user.entity'
import { Admin } from '../admin/admin.entity'

@Entity()
@Unique('unique_email_usertype', ['email', 'type'])
export class Account {
  @PrimaryColumn()
  public id: string

  @Column()
  public email: string

  @Column({ default: UserTypeEnum.USER })
  public type: UserTypeEnum = UserTypeEnum.USER

  @Column({ default: AccountState.REGISTERED })
  public state: AccountState = AccountState.REGISTERED

  @Column({ default: null })
  public verifyCode: string

  @Column({ default: null })
  public verifyCodeExp: Date

  @Column({ length: 75 })
  @IsString()
  @Exclude()
  public password: string

  @Column({ length: 128 })
  @IsString()
  @Exclude()
  public passwordSalt: string

  @CreateDateColumn({ type: 'timestamp', select: false })
  public createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', select: false })
  public updatedAt: Date

  @DeleteDateColumn({ type: 'timestamp', select: false })
  public deleteAt: Date

  @BeforeInsert()
  public async generateId() {
    this.id = this.type + UUID.newId()
  }

  @BeforeInsert()
  public async hashPasswordWithSalt() {
    const salt = this.generateRandomSalt(128)
    this.passwordSalt = salt
    this.password = crypto.createHmac('sha256', salt).update(this.password).digest('hex')
  }

  @BeforeUpdate()
  async updatePassword() {
    if (this.password) {
      const salt = this.generateRandomSalt(128)
      this.passwordSalt = salt
      this.password = crypto.createHmac('sha256', salt).update(this.password).digest('hex')
    }
  }

  private generateRandomSalt(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
  }

  @OneToMany(() => Comment, (comment) => comment.account, { nullable: true })
  public comments: Comment[]

  @OneToOne(() => User, (user) => user.account, { nullable: true })
  public user: User

  @OneToOne(() => Admin, (user) => user.account, { nullable: true })
  public admin: Admin
}
