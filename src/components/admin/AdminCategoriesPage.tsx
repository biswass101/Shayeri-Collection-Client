import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useGetCategoriesQuery } from "@/features/home/homeApi";
import { useCreateCategoryMutation, useDeleteCategoryMutation, useUpdateCategoryMutation } from "@/features/admin/adminApi";

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
};

type CategoryEntity = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");

export default function AdminCategoriesPage() {
  const { addToast } = useToast();
  const { data: categories = [], refetch, isLoading } = useGetCategoriesQuery();
  const [createCategory, createState] = useCreateCategoryMutation();
  const [updateCategory, updateState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteState] = useDeleteCategoryMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [formState, setFormState] = useState<CategoryFormState>({
    name: "",
    slug: "",
    description: "",
  });

  const sortedCategories = useMemo(
    () => [...(categories as CategoryEntity[])].sort((a, b) => a.name.localeCompare(b.name)),
    [categories]
  );

  const resetForm = () => {
    setEditingId(null);
    setFormState({ name: "", slug: "", description: "" });
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      addToast({
        title: "Missing fields",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    const resolvedSlug = formState.slug.trim() ? slugify(formState.slug) : slugify(formState.name);
    if (!resolvedSlug) {
      addToast({
        title: "Invalid slug",
        description: "Please provide a valid slug or name.",
        variant: "destructive",
      });
      return;
    }

    const descriptionValue = formState.description.trim() ? formState.description.trim() : null;

    try {
      if (editingId) {
        await updateCategory({
          id: editingId,
          name: formState.name,
          slug: resolvedSlug,
          description: descriptionValue ?? undefined,
        }).unwrap();
        addToast({
          title: "Category updated",
          description: "The category was updated successfully.",
        });
      } else {
        await createCategory({
          name: formState.name,
          slug: resolvedSlug,
          description: descriptionValue ?? undefined,
        }).unwrap();
        addToast({
          title: "Category created",
          description: "The category was created successfully.",
        });
      }

      resetForm();
      setShowForm(false);
      refetch();
    } catch (error: any) {
      addToast({
        title: editingId ? "Update failed" : "Create failed",
        description: error?.data?.error ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Categories</div>
          <div className="text-xs text-muted-foreground">Manage video categories for the platform.</div>
        </div>
        <Button
          variant="secondary"
          className="h-10 rounded-full border border-border bg-background px-4 text-sm"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={16} className="mr-1" />
          Add Category
        </Button>
      </div>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <Card className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold">{editingId ? "Edit Category" : "Add Category"}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Name</label>
                <Input
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Slug</label>
                <Input
                  value={formState.slug}
                  onChange={(event) => setFormState((prev) => ({ ...prev, slug: event.target.value }))}
                  placeholder="Auto-generated if empty"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  className="min-h-[90px] w-full resize-none rounded-md border border-border bg-background p-3 text-sm"
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Optional description"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-2">
                <Button
                  className="gap-2"
                  disabled={createState.isLoading || updateState.isLoading}
                  onClick={handleSubmit}
                >
                  {editingId ? <Pencil size={16} /> : <Plus size={16} />}
                  {editingId ? "Save Changes" : "Create Category"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <Card className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg">
            <div className="mb-3 text-sm font-semibold">Delete category?</div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete “{confirmDelete.name}”? This action cannot be undone.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                disabled={deleteState.isLoading}
                onClick={async () => {
                  try {
                    await deleteCategory(confirmDelete.id).unwrap();
                    addToast({
                      title: "Category deleted",
                      description: "The category was removed successfully.",
                    });
                    refetch();
                  } catch (error: any) {
                    addToast({
                      title: "Delete failed",
                      description: error?.data?.error ?? "Please try again.",
                      variant: "destructive",
                    });
                  } finally {
                    setConfirmDelete(null);
                  }
                }}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy={isLoading}>
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <div key={`category-skeleton-${index}`} className="admin-category-skeleton-card">
                <div className="admin-category-skeleton-head">
                  <div className="admin-category-skeleton-title skeleton" />
                  <div className="admin-category-skeleton-slug skeleton" />
                </div>
                <div className="admin-category-skeleton-actions">
                  <div className="admin-category-skeleton-action skeleton" />
                  <div className="admin-category-skeleton-action skeleton" />
                </div>
                <div className="admin-category-skeleton-desc skeleton" />
                <div className="admin-category-skeleton-desc skeleton short" />
              </div>
            ))
          : sortedCategories.map((category) => (
              <Card key={category.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{category.name}</div>
                    <div className="text-xs text-muted-foreground">/{category.slug}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 rounded-full px-3 text-xs"
                      onClick={() => {
                        setEditingId(category.id);
                        setFormState({
                          name: category.name,
                          slug: category.slug,
                          description: category.description ?? "",
                        });
                        setShowForm(true);
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-2 rounded-full px-3 text-xs text-destructive hover:text-destructive"
                      onClick={() => setConfirmDelete({ id: category.id, name: category.name })}
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {category.description ?? "No description provided."}
                </p>
              </Card>
            ))}
      </div>
    </div>
  );
}
