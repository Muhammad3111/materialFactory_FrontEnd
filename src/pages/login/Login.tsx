import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import api from "@/api/axiosIntstance";
import { useUser } from "@/hooks/useUser";

interface LoginFormInputs {
  phone: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();

  const { user, setUser } = useUser(); // User contextni ishlatamiz
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]); // User o'zgarsa, localStorage'ga yozamiz

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await api.post("/auth/login", data); // Login request yuboramiz

      const response = await api.get("/users/me"); // User ma'lumotlarini olish
      setUser(response.data); // Statega saqlaymiz

      toast.success("Kirish muvaffaqiyatli!");

      if (response.data.role === "admin") {
        return navigate("/");
      } else {
        return navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Login yoki parol noto‘g‘ri!");
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-sm bg-white shadow-lg rounded-xl">
        <CardContent className="p-6 flex flex-col items-center">
          <h1 className="text-2xl font-semibold mb-4">Kirish</h1>
          <img src="/login-image.svg" alt="Login" className="w-32 h-32 mb-4" />
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Tel raqam"
                {...register("phone", {
                  required: "Fodalanuvchi raqamini kiritish shart",
                })}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Parol"
                {...register("password", { required: "Parol kiritish shart" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Kirish..." : "Kirish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
