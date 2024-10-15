"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInUser,
  signUpUser,
  clearError,
  selectIsLoading,
  selectError,
} from "@/store/slices/authSlice";
import FloatingLabelInput from "@/app/(components)/FloatingLabelInput";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Popup from "@/app/(components)/Popup";
import { AppDispatch, RootState } from "@/store/store";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { push } = useRouter();
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch]);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await dispatch(
        signInUser({ email, password, rememberMe })
      );
      if (signInUser.fulfilled.match(result)) {
        push("/movies");
      } else {
        console.error("Login failed");
      }
    },
    [dispatch, email, password, rememberMe, push]
  );

  const handleRegistration = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await dispatch(
        signUpUser({ email, password, rememberMe })
      );
      if (signUpUser.fulfilled.match(result)) {
        push("/movies");
      } else {
        console.error("Registration failed");
      }
    },
    [dispatch, email, password, rememberMe, push]
  );
  return (
    <div className="flex justify-center flex-col text-center relative items-center auth-container">
      {error && (
        <Popup
          message={error}
          status={false}
          clearFunction={() => dispatch(clearError())}
        />
      )}
      <div className="auth-inner-container">
        <h1 className="mb-[45px]">{t("signIn")}</h1>
        <FloatingLabelInput
          id="email"
          name="email"
          value={email}
          setValue={setEmail}
          type="text"
          placeholder="Email"
        />
        <FloatingLabelInput
          id="password"
          name="password"
          value={password}
          setValue={setPassword}
          type="password"
          placeholder={t("password")}
        />
        <div className="flex items-center mb-4">
          <input
            id="rememberMe"
            type="checkbox"
            defaultChecked={rememberMe}
            className="hidden"
          />
          <span
            className="w-5 h-5 left-0 mr-2 flex items-center bg-[#224957] rounded"
            onClick={() => {
              setRememberMe(!rememberMe);
            }}
          />
          {rememberMe && (
            <span className="absolute w-5 h-5 rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-500 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  setRememberMe(!rememberMe);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
          )}
          <label htmlFor="rememberMe">{t("rememberMe")}</label>
        </div>
        <button
          className="primary-button-colour h-14 my-2 rounded-xl w-full"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("login")}
        </button>
        <button
          className="primary-button-colour h-14 my-2 rounded-xl w-full"
          onClick={handleRegistration}
          disabled={isLoading}
        >
          {isLoading ? t("loading") : t("registration")}
        </button>
      </div>
    </div>
  );
};

export default Auth;
