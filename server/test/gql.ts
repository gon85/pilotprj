const CouponMst_Snapshot = `
  cmId
  couponName
  couponType
  value
  cnt
  limitDay
  createdAt
`;

const CouponTrx_Snapshot = `
  ctId
  cmId
  couponKey
  status
  statusName
  limitDate
  issuedAt
  usedAt
  createdAt
`;

export const GQL_CREATE_COUPONS = `
mutation createCoupons($data: CouponInput!) {
  createCoupons(data: $data){
    list {
      ${CouponTrx_Snapshot}
      couponMst {
        ${CouponMst_Snapshot}
      }
    }
    totalCount
    page
    pageSize
  }
}`;

export const GQL_LIST_COUPONS = `
query listCoupon($data: ListCouponInput!) {
  listCoupon(data: $data){
    list {
      ${CouponTrx_Snapshot}
      couponMst {
        ${CouponMst_Snapshot}
      }
    }
    totalCount
    page
    pageSize
  }
}`;
