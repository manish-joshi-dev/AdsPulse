export const formatApiError = (error) => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error.request) {
    return 'Network error: Please check your connection.';
  }
  return error.message || 'An unexpected error occurred.';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const getFieldErrors = (error) => {
  if (error.response?.data?.error?.details) {
    return error.response.data.error.details.reduce((acc, detail) => {
      acc[detail.field || detail.param] = detail.message;
      return acc;
    }, {});
  }
  return {};
};
