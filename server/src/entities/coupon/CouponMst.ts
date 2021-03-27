import {GraphQLInt, GraphQLString} from 'graphql';
import {Field, GraphQLISODateTime, ObjectType} from 'type-graphql';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {CouponType, CouponTypeToName} from '../../resolvers/coupon/consts';
import {CouponTrx} from './CouponTrx';

@Entity()
@ObjectType({description: '업데이트 가능한 App Config 설정'})
export class CouponMst {
  @Field(() => GraphQLInt)
  @PrimaryGeneratedColumn({comment: 'Config 아이디'})
  readonly cmId!: number;

  @Field(() => GraphQLString, {nullable: false, description: '쿠폰이름'})
  @Column({type: 'varchar', nullable: false, length: 250, comment: '쿠폰이름'})
  couponName!: string;

  @Field(() => CouponType, {nullable: false, description: '쿠폰타입'})
  @Column({type: 'varchar', nullable: false, length: 12, comment: '쿠폰타입'})
  couponType!: CouponType;

  @Field(() => GraphQLString, {nullable: true, description: '쿠폰타입이름'})
  get couponTypeName() {
    return this.couponType ? CouponTypeToName[this.couponType] : '';
  }

  @Field(() => GraphQLInt, {nullable: false, description: '쿠폰 값'})
  @Column({nullable: false, comment: '쿠폰값'})
  value!: number;

  @Field(() => GraphQLInt, {nullable: false, description: '쿠폰 발행수'})
  @Column({nullable: false, comment: '쿠폰 발행수'})
  cnt!: number;

  @Field(() => GraphQLInt, {nullable: false, description: '배포 후 유효일수'})
  @Column({nullable: false, comment: '배포 후 유효일수'})
  limitDay!: number;

  @OneToMany(() => CouponTrx, (ct) => ct.couponMst, {nullable: true})
  @Field(() => CouponTrx, {nullable: false, description: '쿠폰'})
  coupons!: CouponTrx[];

  @Field(() => GraphQLISODateTime, {nullable: true, description: '생성일'})
  @Column({type: 'datetime', nullable: true, comment: '생성일'})
  createdAt!: Date;
}
