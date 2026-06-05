import "../styles/homepage.css";

import {
  useNavigate
} from "react-router-dom";


import {
  useSettings
} from "../context/SettingsContext";

const HomePage = () => {

  const navigate =
    useNavigate();

  const {
    settings
  } = useSettings();

  return (

    <div className="Container">

      {/* LOGO */}

      <div className="img-info">

        <img
          src={
            settings?.Logo
          }
          alt="logo"
        />

      </div>

      {/* SCHOOL NAME */}

      <h1>

        សូមស្វាគមន៍មកកាន់

        {
          settings?.SchoolKhName
        }

        <h2>

          Welcome to {
            settings?.SchoolName
          }

        </h2>

      </h1>

      {/* LOGIN BUTTON */}

      <button
        onClick={() =>
          navigate("/login")
        }
        className="sub-btn"
      >

        Welcome Back to Log In

      </button>

      {/* SCHOOL IMAGE */}

      <div className="school-img">

        <img
  src={
    settings?.SchoolPicture
  }
  alt=""
/>

      </div>

    </div>
  );
};

export default HomePage;