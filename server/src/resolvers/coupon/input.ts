import {Field, InputType} from 'type-graphql';

@InputType({description: 'UserCash 검색 필터'})
export class ListCouponInput {
  @Field({description: 'desc 검색어', nullable: true})
  filter?: string;

  // @Field({description: '캐시 타입', nullable: true})
  // filterCashType?: DangleUserCashType;
}
