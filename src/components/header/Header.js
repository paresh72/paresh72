import React from "react";

export default function Header({ text }) {
  return (
    <div className="bg-lblue py-5">
      <h1 className="text-center text-capitalize text-white my-5 py-5 display-4">
        {text || "hello world"}
      </h1>
    </div>
  );
}
