export const sendContactMessage = async (formData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to send message."
    );
  }

  return data;
};