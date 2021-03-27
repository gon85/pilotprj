import './App.css';
import gql from 'graphql-tag';
import {Table, Pagination, PaginationItem, PaginationLink, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import {useAppContext} from './providers/AppContext';
import {GQL_LIST_COUPONS, GQL_CODEINFOS, GQL_CREATE_COUPONS} from './gql';
import {useEffect, useState} from 'react';
import {CouponAddMoal} from './components/CouponAddMoal';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {client, setLoading} = useAppContext();
  const [list, setList] = useState(null);
  const [couponTypes, setCouponTypes] = useState(null);
  const [couponType, setCouponType] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isOpen, setIsOpen] = useState(false);

  const query = async (GQL, data) => {
    try {
      setLoading(true);
      const r = await client.query({
        query: gql(GQL),
        variables: data ? {data} : {},
        errorPolicy: 'none',
      });
      return r.data;
    } catch (error) {
      console.log('ERROR', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCodeList = async () => {
    const r = await query(GQL_CODEINFOS);
    return r.couponTypes;
  };

  const getCouponList = async (couponType, page = 1, pageSize = 20) => {
    const cond = {page, pageSize};
    if (couponType) {
      cond.filterCouponType = couponType;
    }
    const r = await query(GQL_LIST_COUPONS, cond);
    return r.listCoupon;
  };

  const loadCouponList = async (couponType, page) => {
    const data = await getCouponList(couponType, page);
    setCouponType(couponType);
    setList(data.list);
    setPage(page);
    setTotalCount(data.totalCount);
  };

  useEffect(() => {
    async function load() {
      const codes = await getCodeList();
      setCouponTypes(codes);
      loadCouponList(null, 1);
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const totalPage = totalCount === 0 ? 1 : Math.floor((totalCount - 1) / pageSize) + 1;
    const from = Math.floor((page - 1) / 10) * 10 + 1;
    const to = from + 10 > totalPage ? totalPage : from + 10 - 1;
    setLastPage(totalPage);
    setEndPage(to);
    setStartPage(from);
  }, [page, totalCount, pageSize]);

  const handleChange = async (e) => {
    await loadCouponList(e.target.value, 1);
  };
  const handleClickPage = async (page) => {
    await loadCouponList(couponType, page);
  };
  const handleClickAdd = () => {
    setIsOpen(!isOpen);
  };
  const handleModalDismiss = () => {
    setIsOpen(false);
  };
  const handleModalSave = async (data) => {
    try {
      setLoading(true);
      await client.mutate({
        mutation: gql(GQL_CREATE_COUPONS),
        variables: {data},
        errorPolicy: 'none',
      });
      await loadCouponList('', 1);
      setIsOpen(false);
    } catch (error) {
      toast(error.message, {className: 'toast-bar'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="App-body">
        <h3>쿠폰리스트</h3>
        <div style={{paddingTop: '5px', paddingBottom: '5px', width: '100%'}}>
          <Form inline style={{justifyContent: 'space-between'}} onSubmit={(e) => e.preventDefault()}>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                쿠폰타입
              </Label>
              <Input type="select" name="select" id="exampleSelect" onChange={handleChange}>
                <option value="">전체</option>
                {couponTypes &&
                  couponTypes.map((code) => {
                    return (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    );
                  })}
              </Input>
            </FormGroup>
            <Button onClick={handleClickAdd}>쿠폰추가</Button>
          </Form>
        </div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>쿠폰이름</th>
              <th>쿠폰번호</th>
              <th>쿠폰타입</th>
              <th>가격/할인율</th>
              <th>배포 후 유효일수</th>
              <th>쿠폰상태</th>
              <th>쿠폰유효일</th>
            </tr>
          </thead>
          <tbody>
            {totalCount === 0 ? (
              <tr>
                <td colSpan="8">데이타가 없습니다.</td>
              </tr>
            ) : (
              list.map((couponTrx) => {
                return (
                  <tr key={couponTrx.ctId}>
                    <th scope="row">{couponTrx.ctId}</th>
                    <td>{couponTrx.couponMst.couponName}</td>
                    <td>{couponTrx.couponKey}</td>
                    <td>{couponTrx.couponMst.couponTypeName}</td>
                    <td>
                      {couponTrx.couponMst.value} {couponTrx.couponMst.couponType === 'Price' ? '원' : '%'}
                    </td>
                    <td>{couponTrx.couponMst.limitDay}</td>
                    <td>{couponTrx.statusName}</td>
                    <td>{couponTrx.limitDate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        <div>
          <Pagination aria-label="Page navigation">
            <PaginationItem disabled={page === 1}>
              <PaginationLink
                first
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickPage(1);
                }}
              />
            </PaginationItem>
            <PaginationItem disabled={page === 1}>
              <PaginationLink
                previous
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from(Array(endPage - startPage + 1), (e, i) => {
              return (
                <PaginationItem key={startPage + i} active={startPage + i === page ? true : false}>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      handleClickPage(startPage + i);
                    }}>
                    {startPage + i}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem disabled={page === lastPage}>
              <PaginationLink
                next
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickPage(page + 1);
                }}
              />
            </PaginationItem>
            <PaginationItem disabled={page === lastPage}>
              <PaginationLink
                last
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleClickPage(lastPage);
                }}
              />
            </PaginationItem>
          </Pagination>
        </div>
      </div>
      <CouponAddMoal
        isOpen={isOpen}
        onDismiss={handleModalDismiss}
        onSave={handleModalSave}
        couponTypes={couponTypes}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
