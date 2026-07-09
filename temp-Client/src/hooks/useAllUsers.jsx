import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

export default function useAllUsers() {
  const axiosSecure = useAxiosSecure();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axiosSecure.get("/allUsers").then((res) => {
      setAllUsers(res.data);
    });
  }, [axiosSecure]);

  return allUsers;
}
