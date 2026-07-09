import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

export default function useAllUsers() {
  const axiosSecure = useAxiosSecure();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get("/allUsers").then((res) => {
      const sortedUsers = [...(res.data || [])].sort((a, b) => {
        const aTime = new Date(
          a.createdAt || a.updatedAt || a._id?.$oid || 0,
        ).getTime();
        const bTime = new Date(
          b.createdAt || b.updatedAt || b._id?.$oid || 0,
        ).getTime();
        return bTime - aTime;
      });
      setAllUsers(sortedUsers);
    });
  }, [axiosSecure]);

  return allUsers;
}
