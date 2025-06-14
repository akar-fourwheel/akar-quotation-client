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
import QuotationForBooking from '../Pages/quotationForBooking';
import BookingPage from "../Pages/booking/BookingPage";
import BookingForm from "../Pages/booking/bookingForm";
import bookingSuccess from "../Pages/booking/bookingSuccess";
import testDrivePage from "../Pages/testDrivePage";
import PriceList from "../Pages/priceList";
import QuotationUpdateDashboard from "../Pages/updateQuotationPage";
import StockUpdateDashboard from "../Pages/updateStockPage";
import ReceptionPage from "../Pages/receptionPage";

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
        element: <ProtectedRoute roles={[roles.MD,roles.SALES, roles.TEAML, roles.AUDITOR, roles.ADMIN]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />,
                    },
                    {
                        path: '/test-drive',
                        Component: testDrivePage
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
                        path: '/quotation-book',
                        Component: QuotationForBooking
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
                        path: '/booking-success/:chassis',
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
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute roles={[roles.GUARD]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: '/guard/test-drive',
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
                    }
                ]
            },
        ]
    },
])

export default routes