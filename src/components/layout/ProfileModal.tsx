import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUI } from "@/components/layout/UIContext";
import { useUpdateUserProfileMutation } from "@/features/user/userApi";
import { X } from "lucide-react";

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { user, setAuthSession } = useUI();
  const { addToast } = useToast();
  const [updateProfile, updateState] = useUpdateUserProfileMutation();
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    avatarFile: null as File | null,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPortalTarget(document.body);
    }
  }, []);

  useEffect(() => {
    if (open && user) {
      setFormState({
        name: user.name ?? "",
        email: user.email ?? "",
        avatarFile: null,
      });
      setAvatarPreview(user.avatarUrl ?? null);
    }
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    if (formState.avatarFile) {
      const objectUrl = URL.createObjectURL(formState.avatarFile);
      setAvatarPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    setAvatarPreview(user?.avatarUrl ?? null);
  }, [formState.avatarFile, open, user?.avatarUrl]);

  if (!open || !portalTarget || !user) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid min-h-[100dvh] w-screen place-items-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X size={16} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Profile picture</label>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile preview" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No photo
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    avatarFile: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            className="gap-2"
            disabled={updateState.isLoading}
            onClick={async () => {
              const name = formState.name.trim();
              const email = formState.email.trim();

              if (!name && !email && !formState.avatarFile) {
                addToast({
                  title: "Nothing to update",
                  description: "Please change at least one field.",
                });
                return;
              }

              try {
                const response = await updateProfile({
                  id: user.id,
                  name: name || undefined,
                  email: email || undefined,
                  avatarFile: formState.avatarFile,
                }).unwrap();

                const updatedUser = response?.data ?? user;
                const token = localStorage.getItem("sayeri_token");
                if (token) {
                  setAuthSession(updatedUser, token);
                }

                addToast({
                  title: "Profile updated",
                  description: "Your profile was updated successfully.",
                });
                onClose();
              } catch (error) {
                addToast({
                  title: "Update failed",
                  description: "Please try again.",
                  variant: "destructive",
                });
              }
            }}
          >
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>,
    portalTarget
  );
}
