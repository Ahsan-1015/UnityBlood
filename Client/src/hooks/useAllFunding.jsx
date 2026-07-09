import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

export default function useAllFunding() {
  const axiosSecure = useAxiosSecure();

  const { data: allFunding = [], refetch } = useQuery({
    queryKey: ["allFunding"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allFunding");
      return res.data;
    },
  });

  return [allFunding, refetch];
}
