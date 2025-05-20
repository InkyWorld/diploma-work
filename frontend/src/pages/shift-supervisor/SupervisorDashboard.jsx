import { useState } from "react";
import WorkersSection from "./WorkersSection";
import CompletedTasksSection from "./CompletedTasksSection";
import ShiftPlan from "./ShiftPlan";
import ShiftPlanSection from "./ShiftPlanSection";
import getShiftPlan from "../../services/shift-supervisor/getShiftPlan";
import ShiftPlanForm from "../../features/shift-supervisor/ShiftPlanForm";
import updateShiftPlan from "../../services/shift-supervisor/updateShiftPlan";

export default function SupervisorDashboard() {
  return (
    <div className="p-6 space-y-8 bg-gray-100">
      <h1 className="text-2xl font-bold">Головна сторінка бригадира</h1>
      {/* <button className="border-1 bg-amber-200" onClick={updateShiftPlan}>
        UPDATE SHIFT PLAN
      </button> */}

      {/* 🔄 Отримання shift_plan */}
      {/* <div className="w-full bg-white rounded-xl shadow-sm pb-6 md:pb-0 mx-auto overflow-hidden">
        <h2 className="w-full text-center text-gray-600 font-semibold mb-4 lg:text-left bg-gray-200 px-6 py-3">
          Shift plan за вказаний період (створення/оновлення)
        </h2>
        <ShiftPlanForm isLoading={false} />
      </div> */}

      {/* ✅ Виконані завдання */}
      {/* <CompletedTasksSection shiftType={shiftType} date={selectedDate} /> */}

      {/* 👷‍♂️ Список працівників */}
      {/* <WorkersSection /> */}

      {/* 📦 Shift план */}
      <ShiftPlan />
      {/* <ShiftPlanSection /> */}
    </div>
  );
}
