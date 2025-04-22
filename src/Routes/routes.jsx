import { createBrowserRouter } from "react-router";
import App from '../App';

import ProtectedRoute from '../context/auth/ProtectedRoute'

import {roles} from './roles'

import HomePage from "../Pages/homePage";
import Login from "../Pages/AuthPages/login";
import Signup from "../Pages/AuthPages/signup";
import Unauthorized from "../Pages/AuthPages/unauthorized";
import StockPage from '../Pages/stockPage';
import SchemePage from '../Pages/schemePage';
import QuotationPage from '../Pages/quotationPage'
import AllQuotation from "../Pages/AllQuotation";
import QuotationForBooking from '../Pages/quotationForBooking'
import BookingPage from "../Pages/booking/BookingPage";
import BookingForm from "../Pages/booking/bookingForm";
import bookingSuccess from "../Pages/booking/bookingSuccess";


export const routes = createBrowserRouter([
    {
        path:'/login',
        Component: Login
    },
    {
        path:'/signup',
        Component: Signup
    },
    {
        path:'/unauthorized',
        Component: Unauthorized
    },
    {
        element:<ProtectedRoute roles={[roles.SALES,roles.ADMIN]}/>,
        children:[
            {
                path:'/',
                Component:HomePage,
            },
            {
                path:'/stock-sheet',
                Component:StockPage
            },
            {
                path:'/scheme-sheet',
                Component: SchemePage
            },
            {
                path:'/quotation',
                Component:QuotationPage
            },
            {
                path:'/quotation-list',
                Component:QuotationForBooking
            },
            {
                path:'/booking-list',
                Component:BookingPage
            },
            {
                path:'/booking-form/:id',
                Component:BookingForm
            },
            {
                path:'/booking-success/:chassis',
                Component:bookingSuccess
            },
            {
                path:'/545d65n85g',
                Component:AllQuotation
            }
        ]
    }
])

export default routes