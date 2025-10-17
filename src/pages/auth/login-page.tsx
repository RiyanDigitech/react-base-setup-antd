import { Inputs } from "@/lib/types";
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import {
  Checkbox,
  Form,
  Tooltip,
  Input,
  TooltipProps,
  Spin,
  notification,
} from "antd";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useMemo, useState } from "react";
import { GoQuestion } from "react-icons/go";
import "../../index.css";
// import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/lib/schemas";
import AuthService from "@/services/auth.service";
import { CheckboxChangeEvent } from "antd/es/checkbox";
export default function LoginPage() {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }, // Correctly destructure errors
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const text = <span>Your Default Password Have Been Sent On Your Emial</span>;
  const [arrow] = useState<"Show" | "Hide" | "Center">("Show");
  const mergedArrow = useMemo<TooltipProps["arrow"]>(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const { useHandleLoginInService } = AuthService();
  const { mutate, isPending } = useHandleLoginInService(reset);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false); // State to track checkbox

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsRememberMeChecked(e.target.checked);
  };
  const onError: SubmitErrorHandler<Inputs> = (errors) => {
    console.log("errors from login page", errors);
  };
  const email = watch("email");
  const password = watch("password");
  const isButtonDisabled = !email || !password || isPending;
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // if (!captchaToken) {
    //   notification.error({
    //     message: "CAPTCHA Required",
    //     description: "Please complete the CAPTCHA to proceed.",
    //   });
    //   return;
    // }
    const payload = {
      ...data,
      // rememberMe: isRememberMeChecked,
    };

    console.log("Submitting data:", payload);
    mutate(payload);
  };
    const navigate = useNavigate();

  return (
    <div className="h-screen  md:w-[100vw]  bg-[url('/auth-bg.png')] bg-cover bg-center  relative flex md:items-center justify-center font-manrope">
      <div className="h-fit w-10/12 p-4 font-manrope my-auto md:my-5 flex-1 md:max-w-[50%] bg-white bg-opacity-50 rounded-2xl pt-9 md:px-12 md:h-fit xmd:h-fit lg:h-fit pb-6 md:pb-9 lg:pb-8">
        <h2 className="text-xl font-bold text-[#FF6820]">App Name / logo</h2>
        <h1 className="text-lg md:text-2xl font-bold text-[#18120F] my-6">
          ADMIN LOGIN
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="font-manrope w-full flex flex-col mt-3 "
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="w-full sm:w-full mb-4"
                validateStatus={errors?.email ? "error" : ""}
                help={errors?.email?.message}
              >
                <label
                  htmlFor="email"
                  className="text-[14px] max-md:block text-[#6B6B6B] font-manrope font-semibold leading-[1.125rem]"
                >
                  USER ID
                </label>
                <Input
                  {...field}
                  id="email"
                  placeholder="a@gmail.com"
                  className="h-[44px] w-full md:w-full bg-[#fafafa] border-[1px] border-[#EBF0ED] mt-1"
                />
              </Form.Item>
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Form.Item
                className="w-full sm:w-full  mb-1"
                validateStatus={errors?.password ? "error" : ""}
                help={errors?.password?.message}
              >
                <label
                  htmlFor="password"
                  className="text-[14px] text-[#6B6B6B] font-manrope font-semibold leading-[1.125rem] flex"
                >
                  PASSWORD{" "}
                  <Tooltip
                    className="ml-2 text-[#008444] custom-tooltip"
                    placement="top"
                    title={text}
                    arrow={mergedArrow}
                  >
                    <GoQuestion className=" text-[#008444]" />
                  </Tooltip>
                </label>
                <Input.Password
                  {...field}
                  id="password"
                  placeholder="Enter Password"
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                    }
                  }}
                  className="h-[44px] w-full md:w-full bg-[#fafafa] border-[1px] border-[#EBF0ED] mt-1"
                />
              </Form.Item>
            )}
          />
          <div className="w-full   flex justify-between mt-[-2px] items-center">
            <div className="flex items-center">
              {/* <div>
                <Checkbox onChange={handleCheckboxChange} />
              </div> */}
              {/* <div className="ml-2 font-DMSans text-sm text-[#525B75]">
                {" "}
                Remember me
              </div> */}
            </div>
            {/* <p className="text-[12px] text-[#008444] font-DMSans">
              <Link to={"/admin/forgot-password"}>Forgot Password?</Link>
            </p> */}
          </div>
          {/* <div className="my-5 md:w-[120px]">
            {" "}
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div> */}
           <div className=''>
                    <Link onClick={() => navigate('/auth/signup')}>signup  here</Link>

                </div>
          <button
            disabled={isButtonDisabled} // Button disabled logic
            type="submit"
            className={`w-11/12 sm:w-6/12 lg:w-full mt-4  mx-auto text-white py-2 rounded-md text-[14px] font-semibold ${
              !isButtonDisabled ? "bg-[#ff6820]" : "bg-[#f0763e]"
            }`}
          >
            {isPending ? <Spin /> : "Login"}
          </button>{" "}
        </form>
      </div>
    </div>
  );
}
