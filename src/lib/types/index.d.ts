export type userType = {
  roles: string[];
};
import React, { ReactElement } from "react";
import {
  UseControllerProps,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";
import schema, { ChangePasswordSchema, schemaForgotPassword } from "../schemas";
export * from "@/_utils/types/auth";

type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export type errorType = {
  response: {
    data: {
      message: string | string[];
    };
  };
};

export type userType = {
  email: string;
  password: string;
};

export interface userManagmentDataType {
  key: React.Key;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
}

export interface teamManagmentDataType {
  key: React.Key;
  teamName: string;
  City: string;
  Region: string;
  Area: string;
  Date: string;
}

// defined for login page
export type Inputs = z.infer<typeof schema>;

// defined for forgotpage

export type InputsForgotPassword = z.infer<typeof schemaForgotPassword>;

//General Types For API Responses

export type paginationType = {
  total: number;
  lastPage: number;
  page: number;
};

export type PaginatedResponse<T> = {
  message: string;
  data: T;
} & paginationType;

export type ApiResponse<T> = {
  message: string;
  data: T;
};
export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;


export interface SignupInputs {
  name: string;
  email: string;
  password: string;
  phone: string;
}
