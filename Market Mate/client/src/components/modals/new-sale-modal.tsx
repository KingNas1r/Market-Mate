import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VoiceInput } from "@/components/ui/voice-input";
import { insertSaleSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const saleFormSchema = insertSaleSchema.extend({
  notes: z.string().optional(),
});

export default function NewSaleModal({ isOpen, onClose }: NewSaleModalProps) {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [total, setTotal] = useState(0);

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const form = useForm({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      productId: "",
      quantity: 1,
      unitPrice: "",
      totalAmount: "",
      paymentMethod: "",
      notes: "",
    },
  });

  const quantity = form.watch("quantity");
  const productId = form.watch("productId");

  useEffect(() => {
    if (productId && Array.isArray(products)) {
      const product = products.find((p: any) => p.id === productId);
      setSelectedProduct(product);
      if (product) {
        form.setValue("unitPrice", product.price);
        const newTotal = parseFloat(product.price) * (quantity || 1);
        setTotal(newTotal);
        form.setValue("totalAmount", newTotal.toFixed(2));
      }
    }
  }, [productId, quantity, products, form]);

  const createSaleMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/sales", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Sale completed",
        description: "Sale has been successfully processed.",
      });
      onClose();
      form.reset();
      setSelectedProduct(null);
      setTotal(0);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to process sale.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    createSaleMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Sale</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.isArray(products) ? products.map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₦{parseFloat(product.price).toFixed(2)}
                        </SelectItem>
                      )) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Available Stock</FormLabel>
                <Input 
                  type="text" 
                  readOnly 
                  value={selectedProduct ? `${selectedProduct.stock} units` : "--"} 
                  className="bg-gray-50"
                />
              </FormItem>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Unit Price</FormLabel>
                <Input 
                  type="text" 
                  readOnly 
                  value={selectedProduct ? `₦${parseFloat(selectedProduct.price).toFixed(2)}` : "₦0.00"} 
                  className="bg-gray-50"
                />
              </FormItem>

              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <Input 
                  type="text" 
                  readOnly 
                  value={`₦${total.toFixed(2)}`} 
                  className="bg-gray-50 font-medium"
                />
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="digital">Digital Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any notes about this sale" rows={2} {...field} />
                  </FormControl>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Optional: Add voice notes about this sale</p>
                    <VoiceInput
                      onTranscript={(text) => field.onChange(text)}
                      placeholder="Click 'Speak' to add voice notes in English, Yoruba, or Pidgin"
                      className=""
                    />
                  </div>
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
                className="bg-success-green hover:bg-success-green-dark"
                disabled={createSaleMutation.isPending || !selectedProduct || (quantity > selectedProduct?.stock)}
              >
                {createSaleMutation.isPending ? "Processing..." : "Complete Sale"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
