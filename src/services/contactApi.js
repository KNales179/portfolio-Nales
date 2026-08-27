const API_URL = "https://portfolio-nales-backend.onrender.com";

export const sendContactMessage = async (formData) => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  // Prevent JSON parsing error when backend returns
  // an empty response or non-JSON response.
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send message."
    );
  }

  return data;
};