import {CouponType} from '../src/resolvers/coupon/consts';
import {doGQLQuery, tester} from './common';
import {GQL_CODEINFOS, GQL_CREATE_COUPONS, GQL_LIST_COUPONS} from './gql';

describe('쿠폰 테스트', () => {
  beforeAll(tester.beforeAll);
  afterAll(tester.afterAll);
  beforeEach(tester.beforeEach);
  afterEach(tester.afterEach);

  it(
    '쿠폰생성 및 조회',
    async () => {
      const totalCountOfPrice = 100;
      const r = await doGQLQuery(GQL_CREATE_COUPONS, {
        data: {
          couponName: 'test',
          couponType: CouponType.Price,
          value: 10000,
          cnt: totalCountOfPrice,
          limitDay: 365,
        },
      });
      expect(r.body.data.createCoupons.totalCount).toEqual(totalCountOfPrice);

      const totalCountOfRate = 200;
      const r2 = await doGQLQuery(GQL_CREATE_COUPONS, {
        data: {
          couponName: 'test',
          couponType: CouponType.Rate,
          value: 10,
          cnt: totalCountOfRate,
          limitDay: 365 * 2,
        },
      });
      expect(r2.body.data.createCoupons.totalCount).toEqual(totalCountOfRate);

      const r3 = await doGQLQuery(GQL_LIST_COUPONS, {
        data: {
          filterCouponType: CouponType.Price,
        },
      });
      expect(r3.body.data.listCoupon.totalCount).toEqual(totalCountOfPrice);

      const r4 = await doGQLQuery(GQL_CODEINFOS);
      expect(r4.body.data.couponTypes.length).toEqual(Object.values(CouponType).length);
      expect(r4.body.data.couponTypes[0].code).toEqual(CouponType.Price);
      expect(r4.body.data.couponTypes[1].code).toEqual(CouponType.Rate);
    },
    1000 * 60 * 5,
  );
});
