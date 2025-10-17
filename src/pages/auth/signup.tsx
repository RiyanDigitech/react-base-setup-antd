import { Inputs, SignupInputs } from "@/lib/types";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Spin,
  notification,
} from "antd";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/lib/schemas"; // optionally create a signupSchema if different
import AuthService from "@/services/auth.service";
import { useState } from "react";
import { signupSchema } from "@/lib/schemas/authSchema";

export default function SignupPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupInputs>({
    resolver: zodResolver(signupSchema),
  });

  const { useHandleSignUpInService } = AuthService();
  const { mutate, isPending } = useHandleSignUpInService(reset);

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});

  const onSubmit: SubmitHandler<SignupInputs> = (data) => {
      console.log("Full form data:", data);

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    };
    console.log("Signup Payload:", payload);
    mutate(payload);
  };

  return (
    <div className="h-screen md:w-[100vw] bg-[url('/auth-bg.png')] bg-cover bg-center flex md:items-center justify-center font-manrope">
      <div className="h-fit w-10/12 p-4 font-manrope my-auto md:my-5 flex-1 md:max-w-[50%] bg-white bg-opacity-50 rounded-2xl pt-9 md:px-12 pb-9">
        <h2 className="text-xl font-bold text-[#FF6820]">App Name / logo</h2>
        <h1 className="text-lg md:text-2xl font-bold text-[#18120F] my-6">
          ADMIN SIGNUP
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="font-manrope w-full flex flex-col mt-3 "
        >
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="mb-4"
                validateStatus={errors?.name ? "error" : ""}
                help={errors?.name?.message}
              >
                <label className="text-[14px] text-[#6B6B6B] font-semibold">
                  Name
                </label>
                <Input
                  {...field}
                  placeholder="John Doe"
                  className="h-[44px] bg-[#fafafa] border-[#EBF0ED]"
                />
              </Form.Item>
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="mb-4"
                validateStatus={errors?.email ? "error" : ""}
                help={errors?.email?.message}
              >
                <label className="text-[14px] text-[#6B6B6B] font-semibold">
                  Email
                </label>
                <Input
                  {...field}
                  placeholder="a@gmail.com"
                  className="h-[44px] bg-[#fafafa] border-[#EBF0ED]"
                />
              </Form.Item>
            )}
          />

          {/* Phone Field */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="mb-4"
                validateStatus={errors?.phone ? "error" : ""}
                help={errors?.phone?.message}
              >
                <label className="text-[14px] text-[#6B6B6B] font-semibold">
                  Phone
                </label>
                <Input
                  {...field}
                  placeholder="1234567890"
                  className="h-[44px] bg-[#fafafa] border-[#EBF0ED]"
                />
              </Form.Item>
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="mb-4"
                validateStatus={errors?.password ? "error" : ""}
                help={errors?.password?.message}
              >
                <label className="text-[14px] text-[#6B6B6B] font-semibold">
                  Password
                </label>
                <Input.Password
                  {...field}
                  placeholder="Enter Password"
                  className="h-[44px] bg-[#fafafa] border-[#EBF0ED]"
                />
              </Form.Item>
            )}
          />

          <div className=" mb-2">
           Already Registered <Link onClick={() => navigate("/auth/login")}><span className="text-blue-500 underline font-bold">Login Here</span> </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={`w-11/12 sm:w-6/12 lg:w-full mt-4 mx-auto text-white py-2 rounded-md text-[14px] font-semibold ${
              !isPending ? "bg-[#ff6820]" : "bg-[#f0763e]"
            }`}
          >
            {isPending ? <Spin /> : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
