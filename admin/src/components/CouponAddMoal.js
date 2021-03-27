import React, {useState} from 'react';
import _ from 'lodash';
import {Button, Form, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Col, Input} from 'reactstrap';
import 'react-toastify/dist/ReactToastify.css';
import {toast} from 'react-toastify';

export const CouponAddMoal = ({onSave, onDismiss, isOpen, couponTypes}) => {
  const [updating, setUpdating] = useState(false);
  const [couponName, setCouponName] = useState('');
  const [couponType, setCouponType] = useState('');
  const [couponValue, setCouponValue] = useState(0);
  const [couponCount, setCouponCount] = useState(0);
  const [limitDay, setLimitDay] = useState(0);

  const toggle = () => {
    onDismiss();
  };
  const handleSave = async () => {
    if (_.isEmpty(couponName)) {
      toast('쿠폰이름은 필수값 입니다.', {className: 'toast-bar'});
      return;
    }
    if (_.isEmpty(couponType)) {
      toast('쿠폰타입은 필수값 입니다.', {className: 'toast-bar'});
      return;
    }
    if (couponCount < 1 || couponCount > 100000) {
      toast('쿠폰 수량은 1이상, 10만개 이하 입니다.', {className: 'toast-bar'});
      return;
    }
    if (couponValue < 1) {
      toast('가격 및 할인율은 1이상 입니다..', {className: 'toast-bar'});
      return;
    }
    if (couponType === 'Rate' && couponValue >= 100) {
      toast('할인율은 100미만 입니다.', {className: 'toast-bar'});
      return;
    }
    if (limitDay < 1) {
      toast('배포 후 유효일수는 1이상 입니다..', {className: 'toast-bar'});
      return;
    }
    if (onSave) {
      onSave({
        couponName,
        couponType,
        value: couponValue,
        cnt: couponCount,
        limitDay,
      });
    }
  };
  const handleChange = async (e) => {
    setCouponType(e.target.value);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>쿠폰발급</ModalHeader>
      <Form>
        <ModalBody>
          <FormGroup row>
            <Label for="couponName" sm={3}>
              쿠폰이름
            </Label>
            <Col sm={9}>
              <Input
                type="text"
                name="couponName"
                id="couponName"
                placeholder="쿠폰이름"
                onChange={(e) => setCouponName(e.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="couponType" sm={3}>
              쿠폰타입
            </Label>
            <Col sm={9}>
              <Input type="select" name="couponType" id="couponType" onChange={handleChange}>
                <option value="">선택</option>

                {couponTypes &&
                  couponTypes.map((code) => {
                    return (
                      <option key={code.code} value={code.code}>
                        {code.name}
                      </option>
                    );
                  })}
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="couponValue" sm={3}>
              가격 및 할인율
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                name="couponValue"
                id="couponValue"
                placeholder=""
                onChange={(e) => setCouponValue(_.isEmpty(e.target.value) ? 0 : Math.floor(parseFloat(e.target.value)))}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="couponCount" sm={3}>
              수량
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                name="couponCount"
                id="couponCount"
                placeholder="수량 (10만개 이하)"
                onChange={(e) => setCouponCount(_.isEmpty(e.target.value) ? 0 : Math.floor(parseFloat(e.target.value)))}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="limitDay" sm={3}>
              배포 후 유효일수
            </Label>
            <Col sm={9}>
              <Input
                type="number"
                name="limitDay"
                id="limitDay"
                placeholder="배포 후 유효일수"
                onChange={(e) => setLimitDay(_.isEmpty(e.target.value) ? 0 : Math.floor(parseFloat(e.target.value)))}
              />
            </Col>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" style={{marginTop: 20}} onClick={onDismiss}>
            취소
          </Button>
          <Button color="primary" style={{marginTop: 20}} onClick={handleSave}>
            입력
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};
