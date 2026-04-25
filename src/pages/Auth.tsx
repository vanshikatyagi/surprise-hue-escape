import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Plane, ArrowLeft } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "You're now logged in." });
        navigate("/dashboard");
      }
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account created!", description: "Welcome to MystiGo!" });
        navigate("/");
      }
    } else {
      const { error } = await resetPassword(email);
      if (error) {
        toast({ title: "Couldn't send reset link", description: error.message, variant: "destructive" });
      } else {
        toast({
          title: "Check your inbox",
          description: "We sent a password reset link to your email.",
        });
        setMode("login");
      }
    }
    setLoading(false);
  };

  const heading =
    mode === "login"
      ? "Welcome back, explorer!"
      : mode === "signup"
      ? "Start your mystery adventure"
      : "Reset your password";

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-6 h-6 text-[#2d2d2d]" />
              <h1 className="text-2xl font-extrabold tracking-widest text-[#2d2d2d] uppercase">MYSTIGO</h1>
            </div>
            <p className="text-gray-500 text-sm">{heading}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName" className="text-gray-700 text-xs font-medium">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 border-gray-300 text-sm"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-700 text-xs font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 border-gray-300 text-sm"
                required
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 text-xs font-medium">Password</Label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-gray-500 hover:text-[#2d2d2d] underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-gray-300 text-sm pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] text-sm py-5 font-semibold rounded-lg"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "forgot" ? (
              <button
                onClick={() => setMode("login")}
                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to sign in
              </button>
            ) : (
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
