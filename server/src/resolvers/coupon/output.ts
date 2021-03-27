import {ObjectType} from 'type-graphql';
import {CouponTrx} from '../../entities/coupon/CouponTrx';
import {ListableResponse} from '../../utils/outputs';

@ObjectType()
export class ListCouponTrx extends ListableResponse(CouponTrx) {}
