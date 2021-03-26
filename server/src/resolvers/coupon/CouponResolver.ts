import {Arg, Query, Resolver} from 'type-graphql';
import {Coupon} from '../../entities/coupon/Coupon';
import {ListCouponInput} from './input';
import {ListCoupon} from './output';

@Resolver(() => Coupon)
export class CouponResolver {
  @Query(() => ListCoupon, {description: 'UserCashHst 목록을 반환합니다.'})
  async listCoupon(@Arg('data') data: ListCouponInput): Promise<ListCoupon> {
    return {
      list: [],
      totalCount: 0,
    };
  }
}
