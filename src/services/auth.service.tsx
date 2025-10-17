import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/config/axios-instance";
import { useNavigate } from "react-router-dom";
import tokenService from "./token.service";
import { notification } from "antd";
import { ChangePasswordType, errorType, userType } from "@/lib/types";
import {
  ForgotEmailResponse,
  ForgotEmailType,
  LoginApiResponse,
} from "@/lib/types/auth";
import { UserInfo } from "@/lib/types/user";
import { buildUrlWithParams } from "@/lib/helpers";

// import;
const AuthService = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const useHandleLoginInService = (reset: () => void) => {
    function handleLogInRequest(data: userType): Promise<LoginApiResponse> {
      return axios.post(`api/auth/login`, data);
    }
    const onSuccess = (response: LoginApiResponse) => {
      console.log("console checking.... after login", response);

      const userObject = {
        id: response?.data?.details?.id,
        username: response?.data?.details?.name,
        email: response?.data?.details?.email,
        phone: response?.data?.details?.phone,
      };
      
        tokenService?.setLastUserData(userObject);
        tokenService.setUser(response?.data?.details);
        tokenService.setTokenRetries(5);
        tokenService.saveLocalRefreshToken("");
        tokenService.saveLocalAccessToken(response?.data?.token);
      
      notification.success({
        message: "Login Successful",
        description: "You have successfully logged in!",
        placement: "topRight",
      });
      navigate("/dashboard");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      reset();
    };

    const onError = (error: errorType) => {
      console.log(error, "error");
      notification.error({
        message: "Login Failed",
        description: error?.response?.data?.message || "Login Failed",
        placement: "topRight",
      });
    };
    return useMutation({
      mutationFn: handleLogInRequest,
      onSuccess,
      onError,
      retry: 0,
    });
  };
  const useHandleForGotPassword = (reset: () => void) => {
    function handleForgotRequest(
      data: ForgotEmailType
    ): Promise<ForgotEmailResponse> {
      return axios.post(`/admin/forgot-password`, data);
    }
    const onSuccess = (response: ForgotEmailResponse) => {
      console.log(response);

      notification.success({
        message: "request Successful",
        description: "Link has been sent on your email account",
        placement: "topRight",
      });
      // navigate("/otpforgetpassword");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      reset();
    };
    const onError = (error: errorType) => {
      console.log(error);
      notification.error({
        message: "Failed",
        description:
          error?.response?.data?.message || "Failed to Forget-password",
        placement: "topRight",
      });
    };
    return useMutation({
      mutationFn: handleForgotRequest,
      onSuccess,
      onError,
      retry: 0,
    });
  };
  const useHandleChangePassword = (reset: () => void) => {
    function handleChangeRequest(
      data: ChangePasswordType
    ): Promise<ForgotEmailResponse> {
      return axios.post(`/admin/change-password`, data);
    }
    const onSuccess = (response: ForgotEmailResponse) => {
      console.log(response);

      notification.success({
        message: "request Successful",
        description: "password changed successfully",
        placement: "topRight",
      });
      tokenService.clearStorage();

      navigate("/auth/login");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      reset();
    };
    const onError = (error: errorType) => {
      console.log(error);
      notification.error({
        message: "Failed",
        description:
          error?.response?.data?.message || "Failed to update the password",
        placement: "topRight",
      });
    };
    return useMutation({
      mutationFn: handleChangeRequest,
      onError,
      onSuccess,
      retry: 0,
    });
  };
  const useHandleResetPassword = (reset: () => void, safeToken: string) => {
    function handleresetRequest(
      data: ChangePasswordType
    ): Promise<ForgotEmailResponse> {
      return axios.post(`/admin/reset-password/${safeToken}`, data);
    }
    const onSuccess = (response: ForgotEmailResponse) => {
      console.log(response);

      notification.success({
        message: "request Successful",
        description: "password changed successfully",
        placement: "topRight",
      });

      navigate("/auth/login");
      queryClient.invalidateQueries({ queryKey: ["user", safeToken] });
      reset();
    };
    const onError = (error: errorType) => {
      console.log(error);
      notification.error({
        message: "Failed",
        description:
          error?.response?.data?.message || "Failed to update the password",
        placement: "topRight",
      });
    };
    return useMutation({
      mutationFn: handleresetRequest,
      onError,
      onSuccess,
      retry: 0,
    });
  };
  const useHandleUpdateProfile = () => {
    function handleLogInRequest(data: UserInfo): Promise<LoginApiResponse> {
      return axios.put(`/admin/update`, data);
    }
    const onSuccess = (response: LoginApiResponse) => {
      console.log("console checking....", response);
      // const userObject = {
      //   name: response?.data?.data?.username,
      //   email: response?.data?.data?.email,
      //   phone: response?.data?.data?.phone,
      //   address: response?.data?.data?.address || "",
      // };
      // tokenService?.setLastUserData(userObject);

      notification.success({
        message: "updated profile Successful",
        description: "You have successfully updated the profile!",
        placement: "topRight",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    };

    const onError = (error: errorType) => {
      console.log(error, "error");
      notification.error({
        message: "Login Failed",
        description: error?.response?.data?.message || "Login Failed",
        placement: "topRight",
      });
    };
    return useMutation({
      mutationFn: handleLogInRequest,
      onSuccess,
      onError,
      retry: 0,
    });
  };
  const useFetchTargetedAdmin = () => {
    async function fetchTeam(): Promise<ApiResponseAccountDetails> {
      const url = buildUrlWithParams(`/admin`, {});
      return axios.get(url).then((res) => res.data);
    }

    return useQuery({
      queryFn: fetchTeam,
      queryKey: ["user"],
      retry: 0,
      refetchOnWindowFocus: false,
    });
  };
  return {
    useHandleLoginInService,
    useHandleForGotPassword,
    useHandleChangePassword,
    useHandleUpdateProfile,
    useHandleResetPassword,
    useFetchTargetedAdmin,
  };
};

export default AuthService;
