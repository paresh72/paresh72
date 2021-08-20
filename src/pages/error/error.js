import React from "react";
import Header from "../../components/header/Header";

export default function error() {
  return (
    <div>
      <Header text="&#9785; 404" />
      <h1 className="display-6 text-center p-5">
        You are looking for something which is not there
      </h1>
    </div>
  );
}
