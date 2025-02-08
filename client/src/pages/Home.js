import React, { useEffect } from "react";
import MUI_Tabs from "../layouts/MUI_Tabs";
import "./../App.css";

const Home = () => {
  return (
    <div class="home-bg-image">
      <div className="w-[100%] flex justify-center text-center items-center h-screen">
        <div className="w-[75%] sm:w-[35%] bg-gray-100 rounded-lg p-5">
          <h1 className="bg-black text-white rounded-lg p-5 text-xl">
            Real Time Chat Application
          </h1>
          <MUI_Tabs />
        </div>
      </div>
    </div>
  );
};

export default Home;
