import {GraphQLInt} from 'graphql';
import {Field, InputType} from 'type-graphql';
import {CouponType} from './consts';

@InputType({description: '검색 필터'})
export class ListCouponInput {
  @Field({description: '쿠폰타입', nullable: true})
  filterCouponName?: string;

  @Field({description: '쿠폰타입', nullable: true})
  filterCouponType?: CouponType;

  @Field(() => GraphQLInt, {description: '조회할 페이지', nullable: true})
  page: number = 1;

  @Field(() => GraphQLInt, {description: '조회할 페이지당 아이템 수', nullable: true})
  pageSize: number = 20;

  get skip(): number {
    return (this.getPage() - 1) * (this.getPageSize() || 10);
  }

  getPageParam() {
    return {page: this.getPage(), pageSize: this.getPageSize()};
  }

  getPage(): number {
    return this.page || 1;
  }

  getPageSize(): number {
    return this.pageSize || 10;
  }
}

@InputType({description: '생성'})
export class CouponInput {
  @Field({nullable: false, description: '쿠폰이름'})
  couponName!: string;

  @Field({nullable: false, description: '쿠폰상태'})
  couponType!: CouponType;

  @Field({nullable: false, description: '쿠폰 값'})
  value!: number;

  @Field({nullable: false, description: '쿠폰 발행수'})
  cnt!: number;

  @Field({nullable: false, description: '배포 후 유효일수'})
  limitDay!: number;
}
