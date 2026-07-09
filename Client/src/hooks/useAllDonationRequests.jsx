import useAxiosSecure from "./useAxiosSecure";

export default function useAllDonationRequests() {
  const axiosSecure = useAxiosSecure();

  const fetchAllDonationRequests = async () => {
    const response = await axiosSecure.get("/allDonationRequestsAd");
    const sortedRequests = [...(response.data || [])].sort((a, b) => {
      const aTime = new Date(
        a.createdAt || a.updatedAt || a._id?.$oid || 0,
      ).getTime();
      const bTime = new Date(
        b.createdAt || b.updatedAt || b._id?.$oid || 0,
      ).getTime();
      return bTime - aTime;
    });
    return sortedRequests;
  };

  return fetchAllDonationRequests;
}
