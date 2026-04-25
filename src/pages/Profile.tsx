import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Eye, EyeOff, User as UserIcon, KeyRound } from "lucide-react";

const Profile = () => {
  const { user, updatePassword, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!error && data) {
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
      setLoadingProfile(false);
    })();
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        { user_id: user.id, email: user.email, full_name: fullName, avatar_url: avatarUrl },
        { onConflict: "user_id" }
      );
    setSavingProfile(false);
    if (error) {
      toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved", description: "Your info has been updated." });
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSavingPwd(true);
    const { error } = await updatePassword(newPassword);
    setSavingPwd(false);
    if (error) {
      toast({ title: "Couldn't update password", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
        <p className="text-muted-foreground mb-8">Manage your profile and password.</p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="w-5 h-5" /> Profile Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={user?.email || ""} disabled className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                  disabled={loadingProfile}
                />
              </div>
              <div>
                <Label className="text-xs">Avatar URL (optional)</Label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                  disabled={loadingProfile}
                />
              </div>
              <Button type="submit" disabled={savingProfile || loadingProfile}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="w-5 h-5" /> Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <Label className="text-xs">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <Label className="text-xs">Confirm New Password</Label>
                <Input
                  type={showPwd ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  minLength={6}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={savingPwd}>
                {savingPwd ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
