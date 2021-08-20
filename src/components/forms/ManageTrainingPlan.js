import React, { useState } from "react";
import AddTrainingPlan from "../../components/forms/AddTrininigPlan";
import AddTplanXlsx from "../../components/forms/AddTplanXlsx";
import UpdateTrainingPlan from "../../components/forms/UpdateTrainingPlan";
import RemoveTrainingPlan from "../../components/forms/RemoveTrainingPlan";
import { FaPlusCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import "./form.scss";

export default function ManageTrainingPlan(props) {
  const [page, setPage] = useState({ selected: 1, choice: "" });
  const [renderChoice, setRenderChoice] = useState();

  const changeChoice = (ch) => {
    switch (ch) {
      case 1:
        setPage({ selected: 2, choice: "AddTrainingPlan" });
        setRenderChoice(<AddTrainingPlan props={props} />);
        break;
      case 2:
        setPage({ selected: 2, choice: "AddTplanXlsx" });
        setRenderChoice(<AddTplanXlsx props={props} />);
        break;
      case 3:
        setPage({ selected: 2, choice: "UpdateTrainingPlan" });
        setRenderChoice(<UpdateTrainingPlan props={props} />);
        break;
      case 4:
        setPage({ selected: 2, choice: "RemoveTrainingPlan" });
        setRenderChoice(<RemoveTrainingPlan props={props} />);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="px-3 py-1 border-bottom d-flex justify-content-between align-items-center">
        <nav>
          <ol className="breadcrumb mb-0 py-2">
            <li
              className={
                page.selected === 1
                  ? "breadcrumb-item active"
                  : "breadcrumb-item text-primary"
              }
              style={{ cursor: page.selected > 1 ? "pointer" : "auto" }}
              onClick={() => {
                setPage({ selected: 1, choice: "" });
              }}
            >
              Manage Training Plans
            </li>
            <li
              className={
                page.selected === 2 ? "breadcrumb-item active" : "d-none"
              }
            >
              {page.choice}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container px-3">
        <div className="form px-lg-5">
          {page.selected === 1 && (
            <div className="row g-4 listcourses py-4 pt-5">
              <div className="col-lg-3">
                <div
                  className="bg-white pt-4 pb-1 rounded citem text-center color-dback"
                  onClick={() => {
                    changeChoice(1);
                  }}
                >
                  <FaPlusCircle className="fs-1 my-2" />
                  <p className="py-2">Add New Plan</p>
                </div>
              </div>
              <div className="col-lg-3">
                <div
                  className="bg-white pt-4 pb-1 rounded citem text-center color-dback"
                  onClick={() => {
                    changeChoice(2);
                  }}
                >
                  <SiGooglesheets className="fs-1 my-2" />
                  <p className="py-2">Add Plan xlsx</p>
                </div>
              </div>
              <div className="col-lg-3">
                <div
                  className="bg-white pt-4 pb-1 rounded citem text-center color-dback"
                  onClick={() => {
                    changeChoice(3);
                  }}
                >
                  <FaEdit className="fs-1 my-2" />
                  <p className="py-2">Update Plan</p>
                </div>
              </div>
              <div className="col-lg-3">
                <div
                  className="bg-white pt-4 pb-1 rounded citem text-center color-dback"
                  onClick={() => {
                    changeChoice(4);
                  }}
                >
                  <FaTrashAlt className="fs-1 my-2" />
                  <p className="py-2">Remove Plan</p>
                </div>
              </div>
            </div>
          )}
          {page.selected === 2 && renderChoice}
        </div>
      </div>
    </>
  );
}
