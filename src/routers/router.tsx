import { createBrowserRouter } from "react-router-dom";
import UserLayout from "../layouts/user/UserLayout";
import HomePage from "../pages/HomePage";
import AdminLayout from "../layouts/admin/AdminLayout";
import LogInPage from "../pages/LogInPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import RedirectRoute from "./RedirectRoute";
import LandingPage from "../pages/LandingPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AdminRoute from "./AdminRoute";
import ClassDetailsPage from "../pages/course/ClassDetailsPage";
import AcceptInvite from "../pages/AcceptInvite";
import ImportStudentList from "../pages/TestUpload/ImportStudentList";
import UserManagementPage from "../pages/admin/UserManagementPage";
import RequestListPage from "../pages/course/RequestListPage";
import RequestDetailsPage from "../pages/course/RequestDetailsPage";
import CourseManagementPage from "../pages/admin/CourseManagementPage";

const router = createBrowserRouter(
  [
    {
      element: <UserLayout />,
      children: [
        {
          element: <PrivateRoute />,
          children: [
            {
              path: "/",
              element: <HomePage />,
            },
            {
              path: "/import-students",
              element: <ImportStudentList />,
            },
            {
              path: "/profile",
              element: <ProfilePage />,
            },
            {
              path: "/calendar",
              element: <div>Calendar</div>,
            },
            {
              path: "/todo",
              element: <div>To-do</div>,
            },
            {
              path: "/to-review",
              element: <div>To-review</div>,
            },
            {
              path: "/course/invite",
              element: <AcceptInvite />,
            },
            {
              path: "/archived",
              element: <div>Archived class</div>,
            },
            {
              path: "/settings",
              element: <div>Settings</div>,
            },
            {
              path: "/class/:classCode",
              children: [
                {
                  path: "stream",
                  element: <ClassDetailsPage initTab={0} />,
                },
                {
                  path: "classwork",
                  element: <ClassDetailsPage initTab={1} />,
                },
                {
                  path: "people",
                  element: <ClassDetailsPage initTab={2} />,
                },
                {
                  path: "grades",
                  element: <ClassDetailsPage initTab={3} />,
                },
                {
                  path: "grades/student-requests",
                  element: <RequestListPage isStudent={true} />,
                },
                {
                  path: "grades/teacher-requests",
                  element: <RequestListPage isStudent={false} />,
                },
                {
                  path: "grades/request/:requestId",
                  element: <RequestDetailsPage />,
                },
              ],
            },
          ],
        },
        {
          element: <RedirectRoute />,
          children: [
            {
              path: "/login",
              element: <LogInPage />,
            },
            {
              path: "/forgot-password",
              element: <ForgotPasswordPage />,
            },
            {
              path: "/reset-password",
              element: <ResetPasswordPage />,
            },
            {
              path: "/register",
              element: <RegisterPage />,
            },
            {
              path: "/landing",
              element: <LandingPage />,
            },
          ],
        },
      ],
    },
    {
      element: <AdminRoute />,
      children: [
        {
          path: "/admin",
          element: <AdminLayout />,
          children: [
            {
              path: "dashboard",
              element: <div>Dashboard</div>,
            },
            {
              path: "classes",
              element: <CourseManagementPage />,
            },
            {
              path: "users",
              element: <UserManagementPage />,
            },
            {
              path: "settings",
              element: <div>Settings</div>,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL ? undefined : "/AdvancedWebFinalProject",
  }
);

export default router;
