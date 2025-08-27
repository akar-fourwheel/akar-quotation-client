import { createBrowserRouter } from "react-router";
import App from '../App';
import Layout from '../Components/Layout';
import ProtectedRoute from '../context/auth/ProtectedRoute';
import { roles } from './roles';

import HomePage from "../Pages/homePage";
import Login from "../Pages/AuthPages/login";
import Signup from "../Pages/AuthPages/signup";
import Unauthorized from "../Pages/AuthPages/Unauthorized";
import StockPage from '../Pages/stockPage';
import SchemePage from '../Pages/schemePage';
import QuotationPage from '../Pages/quotationPage';
import AllQuotation from "../Pages/AllQuotation";
import BookingPage from "../Pages/booking/BookingPage";
import BookingForm from "../Pages/booking/bookingForm";
import bookingSuccess from "../Pages/booking/bookingSuccess";
import testDrivePage from "../Pages/testDrivePage";
import PriceList from "../Pages/priceList";
import QuotationUpdateDashboard from "../Pages/updateQuotationPage";
import StockUpdateDashboard from "../Pages/updateStockPage";
import ReceptionPage from "../Pages/receptionPage";
import bookTestDrive from "../Pages/bookTestDrive";
import TestDriveHistoryPage from "../Pages/TestDriveHistoryPage";
import CustomerList from "../Pages/customerList";
import CustomerAssignEditPage from '../Pages/CustomerAssignEditPage'
import TeamStructure from "../Pages/teamStructure/TeamStructure";
import AllocateVehicle from "../Pages/booking/AllocateVehicle";
import DashboardSelector from "../Pages/dashboards/DashboardSelector";

export const routes = createBrowserRouter([
    {
        path: '/login',
        Component: Login
    },
    {
        path: '/signup',
        Component: Signup
    },
    {
        path: '/unauthorized',
        Component: Unauthorized
    },
    {
        element: <ProtectedRoute roles={[roles.SALES, roles.TEAML, roles.SM, roles.GM, roles.AUDITOR, roles.MD, roles.ADMIN]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/dashboard',
                        element: <DashboardSelector />,
                    },
                    {
                        path: '/stock-sheet',
                        Component: StockPage
                    },
                    {
                        path: '/scheme-sheet',
                        Component: SchemePage
                    },
                    {
                        path: '/quotation',
                        Component: QuotationPage
                    },
                    {
                        path: '/booking-list',
                        Component: BookingPage
                    },
                    {
                        path: '/booking-form/:id',
                        Component: BookingForm
                    },
                    {
                        path: '/booking-success/:id',
                        Component: bookingSuccess
                    },
                    {
                        path: '/all-quotations',
                        Component: AllQuotation
                    },
                    {
                        path: '/price-list',
                        Component: PriceList
                    },
                    {
                        path: '/update-quotation',
                        Component : QuotationUpdateDashboard
                    },
                    {
                        path: '/update-stock',
                        Component : StockUpdateDashboard
                    },
                    {
                        path:'/book-test-drive',
                        Component:bookTestDrive
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.GUARD, roles.SALES, roles.TEAML, roles.SM, roles.MD, roles.ADMIN, roles.AUDITOR]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/test-drive-history',
                        Component: TestDriveHistoryPage
                    }
                ]
            },
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.TEAML, roles.MD, roles.ADMIN, roles.GM, roles.SM]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/team-structure',
                        Component: TeamStructure
                    }
                ]
            },
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.ADMIN, roles.GM, roles.SM]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/allocate-vehicle',
                        Component: AllocateVehicle
                    }
                ]
            },
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.GUARD, roles.MD, roles.ADMIN]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/test-drive',
                        Component: testDrivePage
                    }
                ]
            },
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.RECEPTION,roles.CRE]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/reception',
                        Component: ReceptionPage
                    }, 
                    {
                        path: '/reception/edit/:phone?',
                        Component: CustomerAssignEditPage
                    },

                ]
            },
        ]
    },
    {
        element: (
            <ProtectedRoute roles={[roles.RECEPTION, roles.SALES, roles.TEAML, roles.CRE, roles.AUDITOR, roles.SM, roles.GM, roles.MD, roles.ADMIN]} />
        ),
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/customer-list',
                        element: <CustomerList />
                    }
                ]
            }
        ]
    },
])

export default routes