import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Plane } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { updatePassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase auto-handles the recovery hash and emits PASSWORD_RECOVERY
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) {
      toast({ title: "Couldn't update password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can use your new password now." });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#2d2d2d] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Plane className="w-6 h-6 text-[#2d2d2d]" />
              <h1 className="text-2xl font-extrabold tracking-widest text-[#2d2d2d] uppercase">MYSTIGO</h1>
            </div>
            <p className="text-gray-500 text-sm">Set a new password</p>
          </div>

          {!ready ? (
            <p className="text-center text-sm text-gray-500">
              Verifying your reset link… If nothing happens, request a new link from the login page.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-700 text-xs font-medium">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="border-gray-300 text-sm pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 text-xs font-medium">Confirm Password</Label>
                <Input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="mt-1 border-gray-300 text-sm"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2d2d2d] text-white hover:bg-[#3d3d3d] text-sm py-5 font-semibold rounded-lg"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
