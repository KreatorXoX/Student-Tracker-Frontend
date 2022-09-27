import { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import HomePage from "./HomePage";
import Auth from "./user/pages/Auth";

import BusDetails from "./buses/components/BusDetails";
import UserDetails from "./user/components/UserDetails";
import StudentDetails from "./students/components/StudentDetails";
import MainNavigation from "./shared/components/Navigation/MainNavigation";

import { AuthContext } from "./shared/context/auth-context";
import { SessContext } from "./shared/context/sess-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { useSession } from "./shared/hooks/session-hook";

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
  const { userInfo, token, login, logout } = useAuth();
  const { sessionInfo, startSession, endSession, changePresence } =
    useSession();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/start" exact>
          <BusSession />
        </Route>
        <Route path="/buses" exact>
          <Buses />
        </Route>
        <Route path="/bus/new" exact>
          <NewBus />
        </Route>
        <Route path="/bus/:busId" exact>
          <BusDetails />
        </Route>
        <Route path="/users/:role" exact>
          <Users />
        </Route>
        <Route path="/user/new" exact>
          <NewUser />
        </Route>
        <Route path="/user/:userId" exact>
          <UserDetails />
        </Route>
        <Route path="/students">
          <Students />
        </Route>
        <Route path="/busStudents">
          <StudentsInTheBus />
        </Route>
        <Route path="/student/:stdId" exact>
          <StudentDetails />
        </Route>
        <Route path="/student/new/:parentId" exact>
          <NewStudent />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        userInfo: userInfo,
        token: token,
        isLoggedIn: !!token,
        login: login,
        logout: logout,
      }}
    >
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
            <Suspense>{routes}</Suspense>
          </main>
        </BrowserRouter>
      </SessContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
