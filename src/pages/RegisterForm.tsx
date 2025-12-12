import { RegisterNewUser } from "@/components/api/auth.api";
import { IRegister } from "@/components/interfaces/interfaces";
import { registerSchema } from "@/lib/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: RegisterNewUser,
    mutationKey: ["Register New Admin"],
  });

  const { register, handleSubmit } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const registerAdmin = (data: IRegister) => {
    mutate(data);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="md:max-w-[40%] w-full rounded-md px-4 pt-2 pb-4 border border-slate-100 bg-white shadow-xl/30">
        <h1 className="w-full text-center font-semibold text-xl text-stone-600">
          Register
        </h1>
        <form
          onSubmit={handleSubmit(registerAdmin)}
          className="w-full flex flex-col items-start justify-start gap-2"
        >
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jhon Doe"
              {...register("name")}
              className={`w-full rounded-sm px-5 py-2 font-regural text-sm outline-none border   shadow-md/30 shadow-slate-50`}
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Contact
            </label>
            <input
              type="text"
              placeholder="977 - 9812345670"
              {...register("contact")}
              className={`w-full rounded-sm px-5 py-2 font-regural text-sm outline-none border   shadow-md/30 shadow-slate-50`}
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Role
            </label>
            <select
              id="role"
              {...register("role")}
              className="w-full bg-slate-50 border border-slate-100 rounded-md px-3 py-2 
                   text-gray-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 tracking-wide">
              Email
            </label>
            <input
              type="text"
              placeholder="jhon@example.com"
              {...register("email")}
              className={`w-full rounded-sm px-5 py-2 font-regural text-sm outline-none border  shadow-md/30 shadow-slate-50`}
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password")}
              className={`w-full rounded-sm px-5 py-2 font-regural text-sm outline-none border  shadow-md/30 shadow-slate-50`}
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("confirm_password")}
              className={`w-full rounded-sm px-5 py-2 font-regural text-sm outline-none border  shadow-md/30 shadow-slate-50`}
            />
          </div>
          <div className="w-full flex flex-col items-start justify-center gap-2">
            <button
              type="submit"
              className={`w-full rounded-sm px-5 py-2 font-semibold text-lg text-white outline-none bg-blue-500 border border-blue-100  ease duration-300 hover:bg-blue-600`}
            >
              Register
            </button>
          </div>
        </form>
        <hr className="w-full h-1 my-8 border-slate-200" />
        <div className="w-full flex items-center justify-center">
          <p className="font-thin text-slate-400">
            Already have an account?{" "}
            <a
              className="underline font-medium text-blue-400 ease duration-300 hover:text-blue-500"
              href="/auth/login"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
