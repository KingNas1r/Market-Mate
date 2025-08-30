import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VoiceInput } from "@/components/ui/voice-input";
import { insertProductSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function AddProductModal({ isOpen, onClose, product }: AddProductModalProps) {
  const { toast } = useToast();
  const isEditing = !!product;

  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      stock: 0,
      lowStockThreshold: 10,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description || "",
        category: product.category,
        price: product.price,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
      });
    } else {
      form.reset({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: 0,
        lowStockThreshold: 10,
      });
    }
  }, [product, form]);

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEditing) {
        return await apiRequest("PATCH", `/api/products/${product.id}`, data);
      } else {
        return await apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: isEditing ? "Product updated" : "Product added",
        description: `Product has been successfully ${isEditing ? "updated" : "added"}.`,
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "add"} product.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createProductMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Optional: Use voice input to speak the product name</p>
                    <VoiceInput
                      onTranscript={(text) => field.onChange(text)}
                      placeholder="Click 'Speak' and say the product name in English, Yoruba, or Pidgin"
                      className=""
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter product description" rows={3} {...field} />
                  </FormControl>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Optional: Use voice input to describe the product</p>
                    <VoiceInput
                      onTranscript={(text) => field.onChange(text)}
                      placeholder="Click 'Speak' and describe the product in any language"
                      className=""
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₦)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="10" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-blue hover:bg-primary-blue-dark"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending 
                  ? (isEditing ? "Updating..." : "Adding...") 
                  : (isEditing ? "Update Product" : "Add Product")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
