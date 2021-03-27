import 'reflect-metadata';
import {registerEnumType} from 'type-graphql';

export enum CouponType {
  Price = 'Price',
  Rate = 'Rate',
}

export const CouponTypeToName = {
  [CouponType.Price]: '캐시지급',
  [CouponType.Rate]: '가격할인',
};

registerEnumType(CouponType, {
  name: 'CounponType',
  description: '쿠폰타입',
});

export enum CouponStatus {
  Created = 'Created',
  Issued = 'Issued',
  Used = 'Used',
  Expired = 'Expired',
}

export const CouponStatusToName = {
  [CouponStatus.Created]: '발행',
  [CouponStatus.Issued]: '배포',
  [CouponStatus.Used]: '사용완료',
  [CouponStatus.Expired]: '소멸',
};

registerEnumType(CouponStatus, {
  name: 'CouponStatus',
  description: '쿠폰상태',
});
