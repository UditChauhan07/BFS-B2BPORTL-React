import React, { useEffect } from "react";
import AppLayout from "./AppLayout";
import Loading from "./Loading";
import { DestoryAuth } from "../lib/store";

const Logout = () => {
  useEffect(() => {
    // DestoryAuth();
    localStorage.clear()
    window.location.href = window.location.origin + "/dashboard";
}, []);
  return <AppLayout><Loading height={'50vh'}/></AppLayout>;
};

export default Logout;
