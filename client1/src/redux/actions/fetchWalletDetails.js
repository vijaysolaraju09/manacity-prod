export const fetchWalletDetails = async (mobileNumber) => {
  try {
    const response = await fetch(
      `https://manacity-server.onrender.com/api/get-wallet-details?mobileNumber=${mobileNumber}`
    );
    const data = await response.json();

    if (data.success) {
      return data.wallet;
    } else {
      console.error("Failed to fetch wallet details");
    }
  } catch (error) {
    console.error("Error fetching wallet details:", error);
  }
};
