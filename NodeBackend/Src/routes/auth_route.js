const auth_con = require("../controller/auth_con");
const adminOnly = require("../middlewares/adminOnly");
const staffOnly=require("../middlewares/staffOnly");
const auth = require("../middlewares/auth");
const role=require("../middlewares/roles");

const auths = (app) => {

    // login system done
    app.get("/api/auth",auth,adminOnly,auth_con.getAll);
    app.post("/api/auth/login", auth_con.user_login);
    app.get("/api/auth/me", auth, (req, res) => {
                res.json({
                email: req.user.email,
                name: req.user.name,
                role: req.user.role
            });
            });
    app.post("/api/auth/change-password", auth,auth_con.user_changePassword);
    // forgot password done
    app.post("/api/auth/forgot-password", auth_con.forgot_Password);
    app.post("/api/auth/verify-otp",auth_con.verify__Otp);
    // reset password done
    app.post("/api/auth/reset-password", auth_con.reset_Password);
    // logout (teacher + admin) fixed
    app.post("/api/auth/logout",auth,role("teacher","admin","staff","student"),auth_con.logOut);
    // refresh token done
    app.post( "/api/auth/refresh-token", auth,role("teacher","admin","staff"),auth_con.refreshToken);
    // admin create user fixed
    app.post("/api/auth/create-auth",auth,adminOnly,auth_con.register_user);

};

module.exports = auths;