import React, {
  useState,
  useEffect,
} from "react";
import api from "../../../Api/indext";
import {

  Card,
  Button,
  Typography,
  Modal,
  message,
  Space,
  Divider,
  Tag,

} from "antd";

import {

  DollarOutlined,
  QrcodeOutlined,
  CheckCircleOutlined,

} from "@ant-design/icons";



const {
  Title,
  Text,
} = Typography;

const StudentPaymentTest = () => {

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(false);
    const [paymentStatus, setPaymentStatus] =
  useState("pending");

  const [paymentData, setPaymentData] =
    useState(null);

  const token =
    localStorage.getItem("token");
  const [checkInterval, setCheckInterval] =
  useState(null);
  // =========================
  // CREATE KHQR
  // =========================

  const handlePayment =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.post(

            "/payment/create-khqr",

            {

              StudentId: 101,
              FeeId: 102,
              Amount: 100,
              PaymentType:
                "Monthly Fee",

              Months:
                "May",

              studentName:
                "Sreyleak Mey",

            },

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );

        setPaymentData(
          res.data
        );
 
        setOpen(true);

        message.success(
          "KHQR Generated"
        );

      } catch (err) {

        console.log(err);

        message.error(
          "Failed to create KHQR"
        );

      } finally {

        setLoading(false);

      }

    };

  // =========================
  // CHECK PAYMENT
  // =========================

  const checkPayment = async () => {

  try {

    if (
      !paymentData?.transactionId
    ) {
      return;
    }

    const res = await api.get(

      `/payment/check/${paymentData.transactionId}`,

      {

        headers: {

          Authorization:
            `Bearer ${token}`

        }

      }

    );

    console.log(
      "CHECK:",
      res.data
    );

    // =====================
    // PAID
    // =====================

   if (
  res.data.status ===
  "paid"
) {

  if (checkInterval) {

    clearInterval(
      checkInterval
    );

  }

  setPaymentStatus(
    "paid"
  );

  setTimeout(() => {

    setOpen(false);

    setPaymentStatus(
      "pending"
    );

  }, 10000);

  return;

}

if (
  res.data.status ===
  "expired"
) {

  if (checkInterval) {

    clearInterval(
      checkInterval
    );

  }

  setPaymentStatus(
    "expired"
  );

  return;

}

  } catch (err) {

    console.log(
      "CHECK PAYMENT ERROR:",
      err.response?.data ||
      err.message
    );

  }

};
  // =========================
  // AUTO CHECK
  // =========================

  useEffect(() => {

  if (
    !open ||
    !paymentData?.transactionId
  ) {
    return;
  }

  const interval =
    setInterval(() => {

      checkPayment();

    }, 5000);

  setCheckInterval(
    interval
  );

  return () => {

    clearInterval(
      interval
    );

  };

}, [

  open,

  paymentData

]);

  return (

    <div
      style={{

        padding: 30,
        background:
          "#f5f5f5",

        minHeight: "100vh",

      }}
    >

      <Card
        style={{

          maxWidth: 500,
          margin: "auto",
          borderRadius: 20,

          boxShadow:
            "0 8px 24px rgba(0,0,0,0.1)",

        }}
      >

        <Space
          direction="vertical"
          style={{
            width: "100%",
          }}
          size="large"
        >

          <div
            style={{
              textAlign:
                "center",
            }}
          >

            <Title level={2}>
              Student Payment
            </Title>

            <Text type="secondary">
              Bakong KHQR Payment
            </Text>

          </div>

          <Divider />

          <div>

            <Space
              direction="vertical"
              size="middle"
              style={{
                width: "100%",
              }}
            >

              <div
                style={{

                  display: "flex",
                  justifyContent:
                    "space-between",

                }}
              >

                <Text>
                  Student
                </Text>

                <Text strong>
                  Sreyleak Mey
                </Text>

              </div>

              <div
                style={{

                  display: "flex",
                  justifyContent:
                    "space-between",

                }}
              >

                <Text>
                  Payment Type
                </Text>

                <Tag color="blue">
                  Monthly Fee
                </Tag>

              </div>

              <div
                style={{

                  display: "flex",
                  justifyContent:
                    "space-between",

                }}
              >

                <Text>
                  Month
                </Text>

                <Text strong>
                  May
                </Text>

              </div>

              <div
                style={{

                  display: "flex",
                  justifyContent:
                    "space-between",

                }}
              >

                <Text>
                  Amount
                </Text>

 <Title
  level={3}
  style={{
    margin: 0,
    color: "#1677ff",
  }}
>
  {paymentData?.amount || 100} ៛
</Title>

              </div>

            </Space>

          </div>

          <Button

            type="primary"
            size="large"

            icon={
              <DollarOutlined />
            }

            loading={loading}

            onClick={
              handlePayment
            }

            block

            style={{

              height: 55,
              borderRadius: 14,
              fontSize: 18,
              fontWeight: 600,

            }}

          >

            Pay with Bakong

          </Button>

        </Space>

      </Card>

      {/* =========================
          QR MODAL
      ========================= */}

 <Modal
  open={open}
  footer={null}
  centered
  width={420}
  closable={paymentStatus !== "paid"}
  onCancel={() => {
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    setOpen(false);
  }}
>

  <div
    style={{
      textAlign: "center",
      padding: 10,
    }}
  >

    {/* =====================
        PENDING
    ===================== */}

   {paymentStatus === "pending" && (
  <>
    {paymentData?.qrImage && (
          <img
            src={paymentData.qrImage}
            alt="KHQR"
            style={{
              width: 370,
              height:420,
              display: "block",
            }}
          />
    )}

    <div
      style={{
        textAlign: "center",
      }}
    >
    </div>
  </>
)}

    {/* =====================
        SUCCESS
    ===================== */}

    {paymentStatus ===
      "paid" && (

      <>

        <CheckCircleOutlined

          style={{

            fontSize: 80,

            color:
              "#52c41a",

          }}

        />

        <Title

          level={3}

          style={{

            color:
              "#52c41a",

            marginTop: 10,

          }}

        >

          Payment Successful

        </Title>

        <Text>

          Your payment has been received successfully.

        </Text>

        <div
          style={{
            marginTop: 20,
          }}
        >

          <Tag
            color="success"
          >

            PAID

          </Tag>

        </div>

        <div
          style={{
            marginTop: 15,
          }}
        >


        </div>

      </>

    )}

    {/* =====================
        EXPIRED
    ===================== */}

    {paymentStatus ===
      "expired" && (

      <>

        <Title

          level={2}

          style={{

            color:
              "#ff4d4f",

          }}

        >

          QR Code Expired

        </Title>

        <Text>

          Please generate a new QR Code.

        </Text>

        <div
          style={{
            marginTop: 20,
          }}
        >

          <Button

            type="primary"

            danger

            onClick={() => {

              setOpen(false);

            }}

          >

            Close

          </Button>

        </div>

      </>

    )}

  </div>

</Modal>
    </div>

  );

};

export default StudentPaymentTest;