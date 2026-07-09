import useAxiosSecure from "./useAxiosSecure";

export default function useAllDonationRequests() {
  const axiosSecure = useAxiosSecure();

  const fetchAllDonationRequests = async () => {
    const response = await axiosSecure.get("/allDonationRequestsAd");
    return response.data;
  };

  return fetchAllDonationRequests;
}