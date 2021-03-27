import {Arg, FieldResolver, Mutation, Query, Resolver, Root} from 'type-graphql';
import {CouponTrx} from '../../entities/coupon/CouponTrx';
import {CouponInput, ListCouponInput} from './input';
import {ListCouponTrx} from './output';
import {couponService} from '../../services/coupon/CouponService';
import {CodeInfo} from '../../utils/outputs';
import {CouponStatusToName, CouponType, CouponTypeToName} from './consts';
import {GraphQLString} from 'graphql';
import {CouponMst} from '../../entities/coupon/CouponMst';

@Resolver(() => CouponTrx)
export class CouponResolver {
  @Query(() => ListCouponTrx, {description: '목록을 반환합니다.'})
  async listCoupon(@Arg('data') data: ListCouponInput): Promise<ListCouponTrx> {
    const [list, totalCount] = await couponService.getCoupons(data);
    return {
      list,
      totalCount,
      ...data.getPageParam(),
    };
  }

  @Mutation(() => ListCouponTrx, {description: '쿠폰을 생성 후 목록을 반환합니다.'})
  async createCoupons(@Arg('data') data: CouponInput): Promise<ListCouponTrx> {
    const [list, totalCount] = await couponService.createCoupons(data);
    return {
      list,
      totalCount,
      page: 1,
      pageSize: 10,
    };
  }

  @Query(() => [CodeInfo], {description: '코드값을 반환합니다.'})
  async couponTypes(): Promise<CodeInfo[]> {
    return CodeInfo.convert<CouponType>(Object.values(CouponType), CouponTypeToName);
  }

  @FieldResolver(() => GraphQLString, {nullable: false})
  statusName(@Root() ct: CouponTrx): string {
    if (ct.status) return CouponStatusToName[ct.status];
    else return '';
  }
}
