import { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./HomePage";
import Auth from "./auth/pages/Auth";

import BusDetails from "./buses/components/BusDetails";
import UserDetails from "./user/components/UserDetails";
import StudentDetails from "./students/components/StudentDetails";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import { SessContext } from "./shared/context/sess-context";
import { useSession } from "./shared/hooks/session-hook";

import PrivateRoute from "./shared/util/PrivateRoute";
import AdminRoute from "./shared/util/AdminRoute";
import EmployeeRoute from "./shared/util/EmployeeRoute";

//import NewBus from "./buses/pages/NewBus";
//import Buses from "./buses/pages/Buses";

// import BusSession from "./user/pages/BusSession";
// import NewUser from "./user/pages/NewUser";
// import Users from "./user/pages/Users";

// import StudentsInTheBus from "./students/pages/StudentsInTheBus";
// import NewStudent from "./students/pages/NewStudent";
// import Students from "./students/pages/Students";

const NewBus = lazy(() => import("./buses/pages/NewBus"));
const Buses = lazy(() => import("./buses/pages/Buses"));
const BusSession = lazy(() => import("./user/pages/BusSession"));
const NewUser = lazy(() => import("./user/pages/NewUser"));
const Users = lazy(() => import("./user/pages/Users"));
const StudentsInTheBus = lazy(() =>
  import("./students/pages/StudentsInTheBus")
);
const NewStudent = lazy(() => import("./students/pages/NewStudent"));
const Students = lazy(() => import("./students/pages/Students"));

function App() {
  const { sessionInfo, startSession, endSession, changePresence } =
    useSession();

  let routes;

  routes = (
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <EmployeeRoute path="/start" exact>
        <BusSession />
      </EmployeeRoute>
      <AdminRoute path="/buses" exact>
        <Buses />
      </AdminRoute>
      <AdminRoute path="/bus/new" exact>
        <NewBus />
      </AdminRoute>
      <PrivateRoute path="/bus/:busId" exact>
        <BusDetails />
      </PrivateRoute>
      <AdminRoute path="/users/:role" exact>
        <Users />
      </AdminRoute>
      <AdminRoute path="/user/new" exact>
        <NewUser />
      </AdminRoute>
      <PrivateRoute path="/user/:userId" exact>
        <UserDetails />
      </PrivateRoute>
      <PrivateRoute path="/students">
        <Students />
      </PrivateRoute>
      <EmployeeRoute path="/busStudents">
        <StudentsInTheBus />
      </EmployeeRoute>
      <PrivateRoute path="/student/:stdId" exact>
        <StudentDetails />
      </PrivateRoute>
      <AdminRoute path="/student/new/:parentId" exact>
        <NewStudent />
      </AdminRoute>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <SessContext.Provider
      value={{
        isActive: sessionInfo.isActive,
        students: sessionInfo.students,
        schoolName: sessionInfo.schoolName,
        busDriver: sessionInfo.busDriver,
        studentHandler: sessionInfo.studentHandler,
        date: sessionInfo.date,
        employeeId: sessionInfo.employeeId,
        busId: sessionInfo.busId,
        startSess: startSession,
        endSess: endSession,
        changePresenceHandler: changePresence,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Toaster />
          <Suspense>{routes}</Suspense>
        </main>
      </BrowserRouter>
    </SessContext.Provider>
  );
}

export default App;
