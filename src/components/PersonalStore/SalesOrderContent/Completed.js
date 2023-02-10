import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../SellerCenter.scss';
import { useAuth } from '../../Context/Authcontext';

function AllOrder() {
  const { userinfo } = useAuth();
  axios.defaults.withCredentials = true;

  const [OrderList, setOrderList] = useState([]);
  useEffect(() => {
    try {
      async function getOrder() {
        let res = await axios.post(
          'http://localhost:3001/api/seller/order/state',
          {
            state: 3,
            id: userinfo.id,
          }
        );
        setOrderList(res.data);
      }
      getOrder();
    } catch (e) {
      console.error(e);
    }
  }, [userinfo]);

  // 取消訂單
  async function stateChange(id, seller_id) {
    const res = await axios.put(
      'http://localhost:3001/api/seller/order/cancel/unpaid',
      {
        state: 3,
        id,
        seller_id,
      }
    );
    setOrderList(res.data);
  }

  function Orderstate(state) {
    if (state === 1) {
      return '尚未付款';
    }
    if (state === 2) {
      return '待出貨';
    }
    if (state === 3) {
      return '已完成';
    }
    if (state === 4) {
      return '不成立';
    }
  }

  function OrderNone() {
    return (
      <>
        <div className="text-center p-5">
          <p className="fs-5 text-gray-300">找不到訂單</p>
        </div>
      </>
    );
  }

  const [click, setClick] = useState(false);
  const [select, setSelect] = useState();
  const handleToggle = (e, index) => {
    setClick(!click);
    setSelect(index);
  };

  return (
    <div className="bg-white m-auto">
      <div className="container p-2 ">
        {/* 訂單清單 */}
        <div className="bg-white px-4">
          <h5 className="fw-bold my-4">{OrderList.length} 訂單</h5>
          {OrderList == 0 && OrderNone()}
          {OrderList.map((list, index) => {
            const OrderDetail = Object.values(JSON.parse(list.product_id));
            const date = list.order_date.slice(0, 10);
            return (
              <div
                key={list.ordL_id}
                className="border border-gray-100 rounded my-4"
              >
                <div className="d-flex justify-content-between align-items-center border-bottom border-gray-100 p-2 bg-primary">
                  <span>買家帳號：{list.account} </span>
                  <span>訂單日期: {date}</span>
                </div>
                <div className="row bg-white align-items-baseline justify-content-between mx-4 py-4">
                  <div className="col-auto">
                    <strong>訂單編號 </strong>
                    {list.ordL_id}
                  </div>
                  <div className="col-2">
                    <strong>價格 </strong>
                    NT$
                    {list.price}
                  </div>
                  <div className="col-auto">
                    <strong>{Orderstate(list.state)}</strong>
                  </div>
                  <div className="col-auto">
                    <button
                      className="col-auto btn btn-danger text-white m-2"
                      data-bs-toggle="modal"
                      data-bs-target={`#cancelModal-${list.ordL_id}`}
                      disabled={list.state === 1 ? false : true}
                    >
                      取消訂單
                    </button>

                    <button
                      className="col-auto btn btn-primary-300 m-2"
                      onClick={(e) => handleToggle(e, index)}
                    >
                      查看詳情
                    </button>
                  </div>
                  {/* 取消訂單 Modal */}
                  <div
                    className="modal fade"
                    id={`cancelModal-${list.ordL_id}`}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body p-5 text-center fs-5">
                          {`確定取消 "${list.ordL_id}" 訂單`}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-primary-300"
                            data-bs-dismiss="modal"
                          >
                            返回
                          </button>
                          <button
                            data-bs-dismiss="modal"
                            className="btn btn-danger text-white"
                            onClick={() =>
                              stateChange(list.ordL_id, userinfo.id)
                            }
                          >
                            確定
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 訂單細節 */}
                  <div
                    className={
                      index === select && click
                        ? 'accordion-menu active mt-4'
                        : 'accordion-menu'
                    }
                  >
                    {OrderDetail.map((detail, i) => {
                      return (
                        <div
                          key={i}
                          className="row align-items-center justify-content-around bg-white py-3 my-4 mx-2"
                        >
                          <img
                            className="col-2"
                            src={`${
                              process.env.REACT_APP_IMAGE_URL
                            }/images/products/used/${
                              String(detail.imgs).split(',')[0]
                            }`}
                            alt={detail.name}
                          />
                          <div className="col-2">
                            <strong>{detail.name}</strong>
                            <div>{detail.shape}</div>
                          </div>
                          <div className="col-1">
                            <strong>數量 </strong>
                            {detail.quantity}
                          </div>
                          <div className="col-2">
                            <strong>價格 </strong>
                            NT$
                            {detail.total}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={
                      index === select && click
                        ? 'accordion-info active px-4'
                        : 'accordion-info px-4'
                    }
                  >
                    <div className="d-flex justify-content-between border-top border-gray-200 pt-2">
                      <div className="d-flex flex-column p-2 fs-7">
                        <strong className="mb-3">買家資訊</strong>
                        <p>收件人: {list.name}</p>
                        <p>電話: {list.phone}</p>
                        <p>地址: {list.address}</p>
                        <p>訂單日期: {list.order_date}</p>
                      </div>
                      <div className="d-flex align-items-end fs-7">
                        <div className="p-2">
                          <p>商品小計:</p>
                          <p>優惠券:</p>
                          <p>運費:</p>
                          <p>訂單金額:</p>
                        </div>
                        <div className="d-flex flex-column align-items-end p-2">
                          <p>NT$48,000</p>
                          <p>- NT$2,000</p>
                          <p>NT$1,000</p>
                          <p>NT$47,000</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AllOrder;
