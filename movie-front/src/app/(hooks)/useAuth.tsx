import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import Cookies from "js-cookie";

export function useAuth() {
  const { push } = useRouter();
  const isAuthorized = useSelector(selectIsAuthenticated);
  useEffect(() => {
    const checkUserAuth = async () => {
      const savedToken = Cookies.get("auth_token");

      if (!isAuthorized && !savedToken) {
        push("/auth");
      }
    };

    checkUserAuth();
  }, [isAuthorized, push]);
}
