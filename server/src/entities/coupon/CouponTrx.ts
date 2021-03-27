import {GraphQLInt, GraphQLString} from 'graphql';
import {Field, GraphQLISODateTime, ObjectType} from 'type-graphql';
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {CouponStatus, CouponStatusToName, CouponType} from '../../resolvers/coupon/consts';
import {CouponMst} from './CouponMst';

@Entity()
@ObjectType({description: '쿠폰'})
@Index('UI_COUPON_TRX', ['couponKey'], {unique: true})
export class CouponTrx {
  @Field(() => GraphQLInt)
  @PrimaryGeneratedColumn({comment: '쿠폰ID'})
  readonly ctId!: number;

  @Field(() => CouponMst, {nullable: false, description: '쿠폰마스터'})
  @ManyToOne(() => CouponMst, {eager: true, lazy: false})
  @JoinColumn({name: 'cmId'})
  couponMst!: CouponMst;

  @Field(() => GraphQLInt, {nullable: false, description: '쿠폰마스터id'})
  @Column({comment: '쿠폰마스터id', nullable: false})
  cmId!: number;

  @Field(() => GraphQLString, {nullable: false, description: '쿠폰번호'})
  @Column({type: 'varchar', nullable: false, length: 64, comment: '쿠폰번호'})
  couponKey!: string;

  @Field(() => GraphQLISODateTime, {nullable: true, description: '지급 후 유효기간'})
  @Column({type: 'datetime', nullable: true, comment: '지급 후 유효기간'})
  limitDate?: Date;

  @Field(() => CouponStatus, {nullable: false, description: '쿠폰상태'})
  @Column({type: 'varchar', nullable: false, length: 12, comment: '쿠폰상태'})
  status!: CouponStatus; // 발행/지급/사용/말료

  @Field(() => GraphQLString, {nullable: true, description: '쿠폰상태'})
  statusName?: string;

  @Field(() => GraphQLISODateTime, {nullable: true, description: '배포일'})
  @Column({type: 'datetime', nullable: true, comment: '배포일'})
  issuedAt?: Date;

  @Field(() => GraphQLISODateTime, {nullable: true, description: '사용일'})
  @Column({type: 'datetime', nullable: true, comment: '사용일'})
  usedAt?: Date;

  @Field(() => GraphQLISODateTime, {nullable: true, description: '생성일'})
  @Column({type: 'datetime', nullable: true, comment: '생성일'})
  createdAt!: Date;
}
