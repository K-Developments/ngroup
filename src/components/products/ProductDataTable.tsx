
"use client";

import Image from "next/image";
import { MoreHorizontal, Edit, Trash2, PlusCircle, PackageSearch, Package, FileDigit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { ProductDialog } from "./ProductDialog";
import { useState } from "react";
import { placeholderProducts } from "@/lib/placeholder-data";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export function ProductDataTable() {
  const [products, setProducts] = useState<Product[]>(placeholderProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const userRole = currentUser?.role;
  const isAdmin = userRole === 'admin';

  const handleSaveProduct = (productToSave: Product) => {
    if (!isAdmin) return; 
    if (editingProduct) {
      setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
    } else {
      const newProduct = { ...productToSave, id: productToSave.id || Date.now().toString() };
      setProducts([...products, newProduct]); 
    }
    setEditingProduct(null);
  };

  const openDeleteConfirmation = (productId: string) => {
    if (!isAdmin) return;
    setProductToDeleteId(productId);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteProduct = () => {
    if (!isAdmin || !productToDeleteId) return; 
    setProducts(products.filter(p => p.id !== productToDeleteId));
    setIsDeleteAlertOpen(false);
    setProductToDeleteId(null);
  };

  const handleEditProduct = (product: Product) => {
    if (!isAdmin) return;
    setEditingProduct(product);
  }

  const filteredDisplayProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <CardTitle className="font-headline shrink-0">Product List</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <PackageSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {isAdmin && (
              <ProductDialog
                product={null}
                onSave={handleSaveProduct}
                trigger={
                  <Button size="sm" className="w-full sm:w-auto shrink-0">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                }
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredDisplayProducts.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                <PackageSearch className="w-16 h-16 mb-4" />
                <p className="text-xl">No products found.</p>
                {searchTerm && <p>Try adjusting your search term.</p>}
            </div>
          ) : (
            <>
              {/* Mobile Card View - hidden on md and larger screens */}
              <div className="md:hidden space-y-4">
                {filteredDisplayProducts.map((product) => (
                  <Card key={product.id} className="w-full overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <Image
                                alt={product.name}
                                className="object-cover rounded-full h-16 w-16 flex-shrink-0"
                                src={product.imageUrl || "https://placehold.co/64x64.png"}
                                width={64}
                                height={64}
                                data-ai-hint={`${product.category.toLowerCase()} product`}
                            />
                            <div className="flex-grow min-w-0"> {/* Added min-w-0 for proper truncation */}
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow min-w-0 pr-2"> {/* Added min-w-0 and pr-2 for title truncation */}
                                        <CardTitle className="text-base font-semibold leading-tight truncate" title={product.name}>
                                          {product.name}
                                        </CardTitle>
                                        <Badge variant="secondary" className="mt-1 text-xs">{product.category}</Badge>
                                    </div>
                                    {isAdmin && (
                                        <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => openDeleteConfirmation(product.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Package className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                                        <span className="truncate">Stock: <span className="font-medium text-foreground ml-1">{product.stock} units</span></span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileDigit className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                                        <span className="truncate">SKU: <span className="font-medium text-foreground ml-1">{product.sku || "N/A"}</span></span>
                                    </div>
                                    <p className="text-lg font-bold text-primary pt-1">Rs. {product.price.toFixed(2)} <span className="text-xs text-muted-foreground">(Retail)</span></p>
                                    {product.wholesalePrice !== undefined && (
                                        <p className="text-md font-semibold text-accent-foreground">
                                        Rs. {product.wholesalePrice.toFixed(2)} <span className="text-xs text-muted-foreground">(Wholesale)</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table View - hidden on screens smaller than md */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] xl:w-[100px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Wholesale Price</TableHead>
                      <TableHead className="text-right">Retail Price</TableHead>
                      {isAdmin && (
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisplayProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Image
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.imageUrl || "https://placehold.co/64x64.png"}
                            width="64"
                            data-ai-hint={`${product.category.toLowerCase()} product`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell className="text-right">
                          {product.wholesalePrice !== undefined ? `Rs. ${product.wholesalePrice.toFixed(2)}` : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">Rs. {product.price.toFixed(2)}</TableCell>
                        {isAdmin && (
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => openDeleteConfirmation(product.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
          {isAdmin && editingProduct && (
            <ProductDialog
              product={editingProduct}
              onSave={handleSaveProduct}
              trigger={<></>} 
              open={!!editingProduct}
              onOpenChange={(isOpen) => { if (!isOpen) setEditingProduct(null); }}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Yes, delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

