import { Tabs } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const ClassTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.includes("scorelist")
    ? "scorelist"
    : location.pathname.includes("inputscore")
    ? "inputscore"
    : "stulist";

  const items = [
    {
      key: "stulist",
      label: "My Students",
    },
    {
      key: "scorelist",
      label: "Score List",
    },
    {
      key: "grade",
      label: "Grade",
    },
  ];

  return (
    <>
      <style>
        {`
          .class-tabs .ant-tabs-nav-list {
            gap: 30px;
          }

          .class-tabs .ant-tabs-tab {
            padding: 12px 20px !important;
            font-size: 16px;
            font-weight: 500;
          }
        `}
      </style>

      <Tabs
        className="class-tabs"
        activeKey={activeKey}
        onChange={(key) => navigate(`/teacher/class/${key}`)}
        items={items}
        tabBarStyle={{
          marginBottom: 24,
        }}
      />

      <Outlet />
    </>
  );
};

export default ClassTab;