import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILogin } from "@/components/interfaces/interfaces";
import { loginSchema } from "@/lib/validations";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { logAdmin } from "@/lib/api";

const LoginForm = () => {
  const navigate = useNavigate();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: logAdmin,
    mutationKey: ["Log the admin in"],
    onSuccess: (data) => {
      console.log(data);
      toast.success(data?.message);
      Cookies.set("access", data?.token);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (err) => {
      toast.error(err.name);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const logadmin = (data: ILogin) => {
    mutate(data);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="md:max-w-[30%] w-full rounded-md p-4 border border-slate-100 bg-white shadow-xl/30">
        <h1 className="w-full text-center font-semibold text-xl text-stone-600">
          Login
        </h1>
        <form
          onSubmit={handleSubmit(logadmin)}
          className="w-full flex flex-col items-start justify-start gap-3"
        >
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Email
            </label>
            <input
              type="text"
              {...register("email")}
              placeholder="jhon@example.com"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            {errors && errors.email ? (
              <>
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
            {errors && errors.password ? (
              <>
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="w-full flex justify-end">
            <a
              className="block text-sm font-medium text-stone-300 ease duration-300 hover:text-stone-500"
              href="/"
            >
              Forgot password?
            </a>
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <button
              type="submit"
              className="w-full rounded-sm px-5 py-2 font-semibold text-lg text-white outline-none bg-blue-500 border border-blue-100 cursor-pointer ease duration-300 hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </form>
        <hr className="w-full h-1 my-8 border-slate-200" />
        <div className="w-full flex items-center justify-center">
          <p className="block text-sm font-medium  text-slate-400">
            Don't have an account?{" "}
            <a
              className="underline font-medium text-blue-400 ease duration-300 hover:text-blue-500"
              href="/auth/register"
            >
              Register account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
