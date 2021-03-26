import {ObjectType} from 'type-graphql';
import {Coupon} from '../../entities/coupon/Coupon';
import {ListableResponse} from '../../utils/outputs';

@ObjectType()
export class ListCoupon extends ListableResponse(Coupon) {}
