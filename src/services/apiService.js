import { DEFAULT_API_BASE_URL } from '../utils/constants';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // If service is suspended or returns HTML
      if (text.includes('Service Suspended')) {
        throw new ApiError(
          'Backend service on Render is currently suspended. Please unsuspend your service on the Render dashboard or run the backend locally.',
          response.status,
          { raw: text, isSuspended: true }
        );
      }
      data = { message: text || `HTTP ${response.status} ${response.statusText}` };
    }

    if (!response.ok) {
      // Build detailed error message
      let errorMsg = data.message || data.error || `Request failed with status ${response.status}`;
      if (data.details && Array.isArray(data.details) && data.details.length > 0) {
        const fieldDetails = data.details
          .map((d) => (typeof d === 'string' ? d : d.message || JSON.stringify(d)))
          .join(', ');
        errorMsg += `: ${fieldDetails}`;
      }

      throw new ApiError(errorMsg, response.status, data);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new ApiError('Network request timed out. Please check your internet connection or server status.', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Unable to connect to the backend server. Make sure the backend is active.',
      0,
      { originalError: error }
    );
  }
};

export const apiService = {
  // Check backend server health
  getHealth: () =>
    request('/api/health', {
      method: 'GET',
    }),

  // 1. Live Preview of College Email (No OTP, No Turnstile)
  generateCollegeEmail: (fullName, studentNumber) =>
    request('/api/otp/generate-email', {
      method: 'POST',
      body: JSON.stringify({ fullName, studentNumber }),
    }),

  // 2. Request OTP (Protected by Cloudflare Turnstile)
  sendOtp: ({ fullName, studentNumber, turnstileToken }) =>
    request('/api/otp/send', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        studentNumber,
        turnstileToken,
        turnstileAction: 'otp_send',
      }),
    }),

  // 3. Resend OTP (Protected by Turnstile & 60s Cooldown)
  resendOtp: ({ fullName, studentNumber, turnstileToken }) =>
    request('/api/otp/resend', {
      method: 'POST',
      body: JSON.stringify({
        fullName,
        studentNumber,
        turnstileToken,
        turnstileAction: 'otp_send',
      }),
    }),

  // 4. Verify 6-digit OTP
  verifyOtp: ({ email, otp }) =>
    request('/api/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  // 5. Pre-Flight Review (Check OTP status & uniqueness without DB write)
  reviewRegistration: (registrationPayload) =>
    request('/api/registrations/review', {
      method: 'POST',
      body: JSON.stringify(registrationPayload),
    }),

  // 6. Final Confirmed Registration
  submitRegistration: (registrationPayload) =>
    request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationPayload),
    }),

  // 7. Get Ticket / Receipt Details
  getRegistrationReceipt: (registrationId, studentNumber) =>
    request(`/api/registrations/${registrationId}?studentNumber=${encodeURIComponent(studentNumber)}`, {
      method: 'GET',
    }),
};
