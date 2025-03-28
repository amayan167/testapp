import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface EmailAuthProps {
  onSubmit?: (values: FormValues, isLogin: boolean) => void;
  onBack?: () => void;
  isConvertingFromGuest?: boolean;
}

const EmailAuth = ({
  onSubmit = () => {},
  onBack = () => {},
  isConvertingFromGuest = false,
}: EmailAuthProps) => {
  // If converting from guest, default to signup mode
  const [isLogin, setIsLogin] = useState(!isConvertingFromGuest);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values, isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">{isLogin ? "Log In" : "Sign Up"}</h2>
        <p className="text-muted-foreground mt-2">
          {isLogin
            ? "Welcome back! Please enter your details"
            : isConvertingFromGuest
              ? "Create an account to save your run data"
              : "Create an account to get started"}
        </p>
        {isConvertingFromGuest && !isLogin && (
          <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-green-800">
            Your guest run data will be transferred to your new account
            automatically.
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {isLogin && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="px-0 h-auto font-normal"
              >
                Forgot password?
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full">
            {isLogin
              ? "Log In"
              : isConvertingFromGuest
                ? "Create Account & Save Data"
                : "Sign Up"}
          </Button>

          {!isConvertingFromGuest && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <Button
                  type="button"
                  variant="link"
                  className="pl-1.5 pr-0 h-auto font-normal"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </Button>
              </p>
            </div>
          )}

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              Back to options
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailAuth;
