import React, { useEffect } from "react";
import LoginHeader from "../components/All Headers/loginHeader/LoginHeader";
import LoginUI from "../components/loginUI/LoginUI";
import { AuthCheck, DestoryAuth } from "../lib/store";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // AuthCheck().then((user)=>{
    //   if(user){
    //     // navigate("/dashboard")
    //   }
    // }).catch((err)=>{
    //   console.error({err});
    //   DestoryAuth();
    // })
  });
  return (
    <>
      <LoginHeader />
      <LoginUI />
    </>
  );
};

export default Login;
