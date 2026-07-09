import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Registration from "../Pages/Registration/Registration";
import Login from "../Pages/Home/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Profile from "../Pages/Shared/Profile";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import CreateDonation from "../Pages/Dashboard/CreateDonation";
import EditRequest from "../Pages/Dashboard/EditRequest";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import AllDonationRequests from "../Pages/Dashboard/AllDonationRequests";
import AllUsers from "../Pages/Dashboard/AllUsers";
import ContentManagement from "../Pages/Dashboard/ContentManagement";
import AddBlog from "../Pages/Dashboard/AddBlog";
import Settings from "../Pages/Dashboard/Settings";
import Search from "../Pages/Search/Search";
import PendingDonationRequests from "../Pages/PendingDonationRequests.jsx/PendingDonationRequests";
import DonationRequestsDetails from "../Pages/DonationRequestsDetails/DonationRequestsDetails";
import PublishedBlogs from "../Pages/PublishedBlogs/PublishedBlogs";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ErrorPage from "../Pages/Shared/ErrorPage";
import Payment from "../Pages/Home/Payment";

export const router = createBrowserRouter([
  {
    path:"*",
    element:<ErrorPage></ErrorPage>
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
        element:<PrivateRoute><Payment></Payment></PrivateRoute>
      }
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
        path: "/dashboard",
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "/dashboard/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/dashboard/createDonation",
        element: <CreateDonation></CreateDonation>,
      },
      {
        path: "/dashboard/request/edit/:id",
        element: <EditRequest></EditRequest>,
      },
      {
        path: "/dashboard/request/view/:id",
        element: <DonationRequestsDetails></DonationRequestsDetails>,
      },
      {
        path: "/dashboard/my-donation-requests",
        element: <MyDonationRequests></MyDonationRequests>,
      },
      {
        path: "/dashboard/all-donation-requests",
        element: <AllDonationRequests></AllDonationRequests>,
      },
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoute>
            <AllUsers></AllUsers>
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/content-management",
        element: <ContentManagement></ContentManagement>,
      },
      {
        path: "/dashboard/content-management/add-blog",
        element: <AddBlog></AddBlog>,
      },
      {
        path: "/dashboard/settings",
        element: <Settings></Settings>,
      },
    ],
  },
]);
