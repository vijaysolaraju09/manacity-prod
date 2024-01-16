export const fetchUserDetails = async (phoneNumber) => {
  try {
    const formattedPhoneNumber = phoneNumber.replace("+", "");
    const response = await fetch(
      `http://localhost:3001/api/user-details?phoneNumber=${formattedPhoneNumber}`
    );
    const data = await response.json();

    if (data.success) {
      return data.user;
    } else {
      console.error("Error fetching user details:", data.message);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};
