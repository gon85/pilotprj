import {GraphQLError} from 'graphql';
import {EntityManager, getManager, getRepository} from 'typeorm';
import dayjs from 'dayjs';
import {CouponMst} from '../../entities/coupon/CouponMst';
import {CouponTrx} from '../../entities/coupon/CouponTrx';
import {CouponStatus, CouponType} from '../../resolvers/coupon/consts';
import {CouponInput, ListCouponInput} from '../../resolvers/coupon/input';

const chars = 'abcdefghijklmnopqrstuxyz1234567';

const COUPON_LENGTH = 25;
class CouponService {
  generate(len: number) {
    let uid = (Math.random() * 0x4000000).toString(36).split('.').join('');
    do {
      uid += (Math.random() * 0x4000000).toString(36).split('.').join('');
    } while (uid.length < len);

    return `${uid.substring(0, 5)}-${uid.substring(5, 10)}-${uid.substring(10, 15)}-${uid.substring(
      15,
      20,
    )}-${uid.substring(20, 25)}`;
  }

  private async _getCoupons(cond: ListCouponInput, manager?: EntityManager) {
    const repoCT = manager ? manager.getRepository(CouponTrx) : getRepository(CouponTrx);

    const qb = repoCT.createQueryBuilder('ct').leftJoinAndSelect('ct.couponMst', 'cm');

    if (cond.filterCouponType) {
      qb.andWhere('couponType = :couponType', {couponType: cond.filterCouponType});
    }

    return await qb.skip(cond.skip).take(cond.pageSize).orderBy('ct.ctId', 'DESC').getManyAndCount();
  }

  async getCoupons(cond: ListCouponInput) {
    return await this._getCoupons(cond);
  }

  async createCoupons(input: CouponInput) {
    if (input.cnt > 100000) {
      throw new GraphQLError('100,000개 초과 발행할 수 없습니다.');
    }
    return await getManager().transaction(async (manager) => {
      const repoCM = manager.getRepository(CouponMst);
      const repoCT = manager.getRepository(CouponTrx);

      const {cnt} = input;
      const cmNew = repoCM.create({...input, createdAt: dayjs().toDate()});
      await repoCM.insert(cmNew);
      let index = 0;
      const s = new Set();
      while (index < cnt) {
        const couponKey = this.generate(COUPON_LENGTH);
        if (s.has(couponKey) === false) {
          const ctNew = repoCT.create({
            cmId: cmNew.cmId,
            couponKey,
            status: CouponStatus.Created,
            createdAt: dayjs().toDate(),
          });
          const ct = await repoCT.findOne({where: {couponKey}});
          if (ct === undefined) {
            await repoCT.insert(ctNew);
            s.add(couponKey);
            index++;
          }
        }
      }

      const cond = new ListCouponInput();
      cond.filterCouponType = input.couponType;
      return await this._getCoupons(cond, manager);

      // return await repoCT.findAndCount({
      //   relations: ['couponMst'],
      //   skip: 0,
      //   take: 10,
      //   order: {
      //     ctId: 'DESC',
      //   },
      // });
    });
  }
}

export const couponService = new CouponService();
