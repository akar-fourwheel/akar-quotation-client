import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

export const postBookingApproval = async (requestData) => {
    try {
        const response = await axiosInstance.post('/booking-approval', requestData);
        return response.data;
    } catch (error) {
        console.error('Error posting booking approval:', error);
        return error;
    }
}

export const fetchPendingRequests = async () => {
    try {
      const response = await axiosInstance.get('/pending-booking-requests');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return error;
    }
};


export const fetchBookingDetails = async (bookingId) => {
    try {
        const response = await axiosInstance.get(`/booking-details`, { params: { id: bookingId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        return error;
    }
};

export const createBookingRequest = async (bookingData) => {
    try {
      const response = await axiosInstance.post('/booking-request', bookingData);
      return response.data;
    } catch (error) {
      console.error("Booking request failed:", error);
      return error;
    }
};

export const fetchBookingData = async (quoteID) => {
    try {
      const response = await axiosInstance.get('/booking-form', {
        params: { quoteID },
      });
      
      return response.data;
    } catch (error) {
      console.error("Failed to fetch booking data:", error);
      return error;
    }
  };

export const fetchBookingColor = async (year, variant) => {
    try {
      const response = await axiosInstance.get('/booking-color', {
            params: {
              year,
              variant,
            },
          });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch colors:", error);
        return error;
    }
};

export const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.get('/booking-cancel', {
        params: { bookingId }
      });

      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return error;
    }
};

export const fetchBookings = async (params) => {
    try {
      const response = await axios.get('/all-bookings', { params });

      if (response?.data) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return error;
    }
};
  
export const retryBooking = async (bookingData) => {
  try {
    const response = await axios.post('/booking-process', {
      quotation_id: bookingData.quotation_id,
      id: bookingData.id
    });

    return response.data;
  } catch (error) {
    console.error('Retry booking failed:', error);
    return error;
  }
};

export const handleGeneratePDF = async (id) => {
  try {
    const response = await axios.post('/generate-booking-pdf', {
      bookingId : id
    });
    return response.data;
  } catch (error) {
    console.error('Generate PDF failed:', error);
    return error;
  }
};
