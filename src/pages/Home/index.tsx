import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function Home() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/room");
  };
  return (
    <>
      <div className="container">
        <form className="login-form">
          <h2>欢迎登录</h2>
          <input type="text" placeholder="请随意输入玩家名称" />
          <button type="submit" onClick={onClick}>
            加入
          </button>
        </form>
      </div>
    </>
  );
}
