import React,{useEffect,useState} from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Progress,
  Button,
  message,
  Space,
  Modal,
  Select,
  Input
} from "antd";
import api from "../../../Api/indext";
import {
  DollarCircleOutlined,
  WalletOutlined,
  CreditCardOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined
} from "@ant-design/icons";

import "../../../styles/managementFee.css";
import FeeForm from "./feeform";


const ManagementFee = () => {
    const [mode, setMode] = useState( "add"); // "add" or "update"
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [fees, setFees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [durationFilter, setDurationFilter] = useState("all");
   const [summary, setSummary] = useState({
    totalCollection: 0,
    pendingPayments: 0,
    paidStudents: 0,
  });

      const handleCreateFee = async (formData) => {
        try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        message.error("No token found, please log in");
        setLoading(false);
        return;
      }
     await api.post(
     "/fee/create",
  formData,
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);
      message.success("Fee created successfully");
      setOpen(false);
      fetchFees();
    } catch (error) {
      console.log(error);
    }
  };
const confirmUpdate = (fee) => {
  Modal.confirm({
    title: "Confirm Update",
    content: `Do you want to update ${fee.FeeName}'s information?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedFee(fee);
      setMode("update");
      setOpen(true);
    },
  });
};
  const confirmDelete = (fee) => {
  Modal.confirm({
    title: "Confirm Delete",
    content: `Do you want to delete Fee ${fee.FeeName}?`,
    okText: "Yes",
    cancelText: "No",
    onOk: () => {
      setSelectedFee(fee);
      handleDelete(fee.Id);
    },
  });
};
const fetchFees = async () => {
  setLoading(true);
    try {

      const token = localStorage.getItem("accessToken");

      const res = await api.get(
  "/fee/getlist",
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

      setFees(res.data.list);

    } catch (error) {
      console.log(error);
    }
  finally {
      setLoading(false);
    }
  };
  const getSummary = async () => {
    try {
         const token = localStorage.getItem("accessToken");

     const res = await api.get(
  "/fee/summary-fee",
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

      setSummary(res.data);

    } catch (error) {
      console.log(error);
    }
  };
   useEffect(() => {
      fetchFees();
      getSummary();
    }, []);
  //done
const handleUpdate = async (formData) => {

  try {

    const token =
      localStorage.getItem("accessToken");

    if (!token) {

      message.error(
        "No token found, please log in"
      );

      return;
    }

    await api.put(
  `/fee/${selectedFee.Id}`,
  formData,
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

    message.success(
      "Fee updated successfully"
    );

    setOpen(false);

    fetchFees();

  } catch (error) {

    console.error(error);

    message.error(
      "Fee update failed"
    );
  }
};
const handleDelete = async (Id) => {

  try {

    const token =
      localStorage.getItem("accessToken");

    await api.delete(
  `/fee/${Id}`,
  {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  }
);

    message.success(
      "Fee deleted successfully"
    );

    fetchFees();

  } catch (error) {

    console.log(error);

    message.error(
      "Delete failed"
    );
  }
};
const filteredFees = fees.filter((fee) => {

  const term = searchTerm.toLowerCase();

  const matchesSearch =
    fee.FeeName?.toLowerCase().includes(term) ||
    fee.ClassName?.toLowerCase().includes(term) ||
    fee.ProgramType?.toLowerCase().includes(term);

  const matchesDuration =
    durationFilter === "all" ||
    fee.DurationType?.toLowerCase() ===
      durationFilter.toLowerCase();

  return matchesSearch && matchesDuration;
});
  const columns = [

  {title:"Class ID",
    dataIndex:"Id"
  },
  {
    title: "Fee Name",
    dataIndex: "FeeName",
  },

  {
    title: "Class",
    dataIndex: "ClassName",
  },

  {
    title: "Program",
    dataIndex: "ProgramType",
  },

  {
    title: "Duration",
    dataIndex: "DurationType",
  },

  {
    title: "Amount",
    dataIndex: "Amount",
  },

  {
    title: "Description",
    dataIndex: "Description",
  },

  {
    title: "Actions",
    render: (fee) => (
      <Space>

        <EyeOutlined
          style={{
            color: "#1677ff",
          }}
          onClick={() => {

            setSelectedFee(fee);

            setMode("view");

            setOpen(true);

          }}
        />

        <EditOutlined
          style={{
            color: "#52c41a",
          }}
          onClick={() =>
            confirmUpdate(fee)
          }
        />

        <DeleteOutlined
          style={{
            color: "red",
          }}
          onClick={() =>
            confirmDelete(fee)
          }
        />

      </Space>
    ),
  },
];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Management Fee</h2>
          <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {

            setSelectedFee(null);

            setMode("add");

            setOpen(true);

          }}
        >
          Create Fee
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        <Col span={8}>
          <Card className="summary-card">
  <Statistic
    title="Total Collection"
    value={summary.totalCollection}
    prefix={<DollarCircleOutlined />}
  />
</Card>
        </Col>

        <Col span={8}>
          <Card className="summary-card">
            <Statistic
              title="Pending Payments"
              value={summary.pendingPayments}
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="summary-card">
            <Statistic
              title="Paid Students"
              value={summary.paidStudents}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
      </Row>
          <Row gutter={16} style={{ marginTop: 20, marginBottom: 20 }}>

  <Col span={12}>
    <Input
      placeholder="Search fee By class Name..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />
  </Col>
{/* Fulter*/ }
  <Col span={8}>
    <Select
      value={durationFilter}
      onChange={(value) =>
        setDurationFilter(value)
      }
      style={{ width: "100%" }}
    >
      <Select.Option value="all">
        All Duration
      </Select.Option>

      <Select.Option value="Month">
        Monthlly
      </Select.Option>

      <Select.Option value="Quarter">
        Quarterly
      </Select.Option>

      <Select.Option value="Semester">
        Semester
      </Select.Option>

      <Select.Option value="Year">
      Yearly
      </Select.Option>
    </Select>
  </Col>

</Row>
      
            <Table
                  columns={columns}
                  dataSource={filteredFees}
                  rowKey="Id"
                  loading={loading}
                  pagination={{ pageSize: 3 }}
                />

       {/* MODAL */}

      <FeeForm
        key={
          selectedFee
            ? selectedFee.Id
            : "create-fee"
        }

        open={open}

        onCancel={() => {

          setOpen(false);

          setSelectedFee(null);

        }}

        onSubmit={
          mode === "update"
            ? handleUpdate
            : handleCreateFee
        }

        initialValues={selectedFee}

        mode={mode}
      />
    </div>
  );
};

export default ManagementFee;