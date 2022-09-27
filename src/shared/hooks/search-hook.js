import { useCallback, useReducer } from "react";

const searchReducer = (state, action) => {
  switch (action.type) {
    case "BUS":
      const busArray = state.initialData.filter(
        (bus) =>
          bus.schoolName.toLowerCase().includes(action.payload) ||
          bus.busDriver.name.toLowerCase().includes(action.payload) ||
          bus.studentHandler.name.toLowerCase().includes(action.payload)
      );
      return {
        initialData: state.initialData,
        searchedData: busArray,
      };
    case "USER":
      const userArray = state.initialData.filter((user) =>
        user.name.toLowerCase().includes(action.payload)
      );

      return {
        initialData: state.initialData,
        searchedData: userArray,
      };
    case "STUDENT": {
      const studentArray = state.initialData.filter(
        (std) =>
          std.name.toLowerCase().includes(action.payload) ||
          std.schoolName.toLowerCase().includes(action.payload)
      );

      return {
        initialData: state.initialData,
        searchedData: studentArray,
      };
    }
    default:
      return state;
  }
};

export const useSearch = (initialData) => {
  const [searchState, dispatch] = useReducer(searchReducer, {
    initialData: initialData,
    searchedData: initialData,
  });

  const busHandler = useCallback((value) => {
    dispatch({
      type: "BUS",
      payload: value,
    });
  }, []);
  const userHandler = useCallback((value) => {
    dispatch({
      type: "USER",
      payload: value,
    });
  }, []);
  const studentHandler = useCallback((value) => {
    dispatch({
      type: "STUDENT",
      payload: value,
    });
  }, []);

  return { searchState, busHandler, userHandler, studentHandler };
};
