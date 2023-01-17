// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useSessionStore = create(
//   persist(
//     (set) => ({
//       isActive: false,
//       students: null,
//       schoolName: null,
//       busDriver: null,
//       studentHandler: null,
//       date: null,
//       employeeId: null,
//       busId: null,
//       setSession: (allParams) =>
//         set((state) => ({
//           ...state,
//           isActive: allParams.isActive,
//           students: allParams.students,
//           schoolName: allParams.schoolName,
//           busDriver: allParams.busDriver,
//           studentHandler: allParams.studentHandler,
//           date: allParams.date,
//           employeeId: allParams.employeeId,
//           busId: allParams.busId,
//         })),
//       endSession: () => {
//         set((state) => ({
//           ...state,
//           isActive: false,
//           students: null,
//           schoolName: null,
//           busDriver: null,
//           studentHandler: null,
//           date: null,
//           employeeId: null,
//           busId: null,
//         }));
//       },
//       changePersence: (id, status) => {
//         set((state) => {
//           const updatedStudents = state.students.map((std) => {
//             if (std.id === id) {
//               std.isOnTheBus = status;
//               std.wasOnTheBus = true;
//             }
//             return std;
//           });

//           return { ...state, students: updatedStudents };
//         });
//       },
//     }),
//     {
//       name: "session-info",
//       storage: () => sessionStorage,
//     }
//   )
// );
