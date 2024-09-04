import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createUser, updateUser } from "@/lib/server";
import { formSchema } from "@/schema/formSchema";

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface UserData {
  name: string;
  email: string;
}

export function UserDialog({ isOpen, onClose, user }: UserDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    } else {
      form.reset({
        name: "",
        email: "",
      });
    }
  }, [user, form]);

  const createUserMutation = useMutation({
    mutationFn: (userData: UserData) => createUser(userData) as Promise<User>,
    onSuccess: (data: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) => [
        ...oldData,
        data,
      ]);
      onClose();
      toast.success("User created successfully");
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (updatedUser: User) =>
      updateUser(updatedUser.id, updatedUser) as Promise<User>, // Ensure the return type is User
    onSuccess: (data: User) => {
      queryClient.setQueryData<User[]>(["users"], (oldData = []) =>
        oldData.map((u) => (u.id === data.id ? data : u))
      );
      onClose();
      toast.success("User updated successfully");
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (user) {
      updateUserMutation.mutate({ id: user.id, ...values });
    } else {
      createUserMutation.mutate(values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{user ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
