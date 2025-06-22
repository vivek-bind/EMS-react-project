import React, { Component } from "react";
import "./Login.css";
import Logo from "../img/logo.png";
import { ScaleLoader } from "react-spinners";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForgotPassword: false, // Toggle for forgot password form
      email: "",
    };
  }

  // Toggle Forgot Password Form
  handleForgotPassword = () => {
    this.setState({ showForgotPassword: true });
  };

  // Handle Input Change
  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  // Handle Forgot Password Submission
  handleSubmit = (e) => {
    e.preventDefault();
    alert("Password reset link sent to: " + this.state.email);
    this.setState({ showForgotPassword: false, email: "" }); // Reset form
  };

  render() {
    return (
      <div className="container">
        <div id="main-outer-div">
          <div id="logo-div">
            <img id="logo-img" src={Logo} alt="Logo" />
          </div>

          <div id="title-div">
            <h4 className="title">{this.state.showForgotPassword ? "Reset Password" : "Sign in"}</h4>
          </div>

          {!this.state.showForgotPassword ? (
            // 🔹 LOGIN FORM
            <div id="outer-login-form-div">
              <form onSubmit={this.props.onSubmit}>
                <input className="login-form-input" type="text" placeholder="Email" required />
                <input className="login-form-input" type="password" placeholder="Password" required />

                {/* Forgot Password Button */}
                <div style={{ textAlign: "right", marginBottom: "10px" }}>
                  <button type="button" onClick={this.handleForgotPassword} style={{ fontSize: "14px", color: "#395faf", background: "none", border: "none", cursor: "pointer" }}>
                    Forgot Password?
                  </button>
                </div>

                <input className="login-form-input" type="submit" value="Sign in" id="submitBtn" />
                {!this.props.pass && <p className="alert">Invalid Username or Password</p>}
              </form>
            </div>
          ) : (
            // 🔹 FORGOT PASSWORD FORM
            <div id="forgot-password-form">
              
              <form onSubmit={this.handleSubmit}>
                <input className="login-form-input" type="email" placeholder="Enter your email" required value={this.state.email} onChange={this.handleChange} />
                <input className="login-form-input" type="submit" value="Send OTP" />
              </form>
            </div>
          )}

          {/* Loading Animation */}
          <div className="loading">
            <ScaleLoader size={150} color={"#123abc"} loading={this.props.loading} />
          </div>
        </div>
      </div>
    );
  }
}

export default Login;








