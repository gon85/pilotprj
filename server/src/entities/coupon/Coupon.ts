import {GraphQLInt} from 'graphql';
import {Field, ObjectType} from 'type-graphql';
import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType({description: '업데이트 가능한 App Config 설정'})
export class Coupon {
  @Field(() => GraphQLInt)
  @PrimaryGeneratedColumn({comment: 'Config 아이디'})
  readonly couponId!: number;
}
