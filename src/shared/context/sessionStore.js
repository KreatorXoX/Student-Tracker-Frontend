import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSessionStore = create(
  persist(
    (set) => ({
      sessionInfo: {
        isActive: false,
        students: [],
        schoolName: null,
        busDriver: null,
        studentHandler: null,
        date: null,
        employeeId: null,
        busId: null,
      },
      setSession: (allParams) =>
        set((state) => ({
          ...state,
          sessionInfo: {
            isActive: allParams.isActive,
            students: allParams.students,
            schoolName: allParams.schoolName,
            busDriver: allParams.busDriver,
            studentHandler: allParams.studentHandler,
            date: allParams.date,
            employeeId: allParams.employeeId,
            busId: allParams.busId,
          },
        })),
      endSession: () => {
        set((state) => ({
          ...state,
          sessionInfo: {
            isActive: false,
            students: [],
            schoolName: null,
            busDriver: null,
            studentHandler: null,
            date: null,
            employeeId: null,
            busId: null,
          },
        }));
      },
      changePersence: (id, status) => {
        set((state) => {
          const updatedStudents = state.sessionInfo.students.map((std) => {
            if (std.id === id) {
              std.isOnTheBus = status;
              std.wasOnTheBus = true;
            }
            return std;
          });

          return {
            ...state,
            sessionInfo: { ...state.sessionInfo, students: updatedStudents },
          };
        });
      },
    }),
    {
      name: "session-info",
    }
  )
);
