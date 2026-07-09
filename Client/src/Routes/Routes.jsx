import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import MainLayout from "../Layout/MainLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const Home = lazy(() => import("../Pages/Home/Home"));
const Registration = lazy(() => import("../Pages/Registration/Registration"));
const Login = lazy(() => import("../Pages/Home/Login/Login"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const Profile = lazy(() => import("../Pages/Shared/Profile"));
const DashboardHome = lazy(() => import("../Pages/Dashboard/DashboardHome"));
const CreateDonation = lazy(() => import("../Pages/Dashboard/CreateDonation"));
const EditRequest = lazy(() => import("../Pages/Dashboard/EditRequest"));
const MyDonationRequests = lazy(
  () => import("../Pages/Dashboard/MyDonationRequests"),
);
const AllDonationRequests = lazy(
  () => import("../Pages/Dashboard/AllDonationRequests"),
);
const AllUsers = lazy(() => import("../Pages/Dashboard/AllUsers"));
const ContentManagement = lazy(
  () => import("../Pages/Dashboard/ContentManagement"),
);
const AddBlog = lazy(() => import("../Pages/Dashboard/AddBlog"));
const Settings = lazy(() => import("../Pages/Dashboard/Settings"));
const Search = lazy(() => import("../Pages/Search/Search"));
const PendingDonationRequests = lazy(
  () => import("../Pages/PendingDonationRequests.jsx/PendingDonationRequests"),
);
const DonationRequestsDetails = lazy(
  () => import("../Pages/DonationRequestsDetails/DonationRequestsDetails"),
);
const PublishedBlogs = lazy(
  () => import("../Pages/PublishedBlogs/PublishedBlogs"),
);
const ErrorPage = lazy(() => import("../Pages/Shared/ErrorPage"));
const Payment = lazy(() => import("../Pages/Home/Payment"));

export const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage></ErrorPage>,
  },
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/registration",
        element: <Registration></Registration>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/searchDonors",
        element: <Search></Search>,
      },
      {
        path: "/pending-donation-requests",
        element: <PendingDonationRequests></PendingDonationRequests>,
      },
      {
        path: "/donation-request-details/:id",
        element: (
          <PrivateRoute>
            <DonationRequestsDetails></DonationRequestsDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/blogs",
        element: <PublishedBlogs></PublishedBlogs>,
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <Payment></Payment>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "createDonation",
        element: <CreateDonation></CreateDonation>,
      },
      {
        path: "request/edit/:id",
        element: <EditRequest></EditRequest>,
      },
      {
        path: "request/view/:id",
        element: <DonationRequestsDetails></DonationRequestsDetails>,
      },
      {
        path: "my-donation-requests",
        element: <MyDonationRequests></MyDonationRequests>,
      },
      {
        path: "all-donation-requests",
        element: <AllDonationRequests></AllDonationRequests>,
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "content-management",
        element: <ContentManagement></ContentManagement>,
      },
      {
        path: "content-management/add-blog",
        element: <AddBlog></AddBlog>,
      },
      {
        path: "settings",
        element: <Settings></Settings>,
      },
    ],
  },
]);
