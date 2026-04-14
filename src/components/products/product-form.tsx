"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product } from "@/modules/products/types";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";

type ProductFormProps = {
  mode: "create" | "edit";
  initialProduct?: Product | null;
  onCancel: () => void;
  onSubmitProduct: (values: ProductFormValues) => Promise<void>;
};

const emptyValues: ProductFormValues = {
  name: "",
  genericName: "",
  barcode: "",
  sku: "",
  category: "",
  laboratory: "",
  requiresPrescription: false,
  controlled: false,
  costPrice: 0,
  salePrice: 0,
  stock: 0,
  active: true,
};

export function ProductForm({ mode, initialProduct, onCancel, onSubmitProduct }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ defaultValues: emptyValues });

  useEffect(() => {
    if (!initialProduct) {
      reset(emptyValues);
      return;
    }

    reset({
      name: initialProduct.name,
      genericName: initialProduct.genericName,
      barcode: initialProduct.barcode,
      sku: initialProduct.sku,
      category: initialProduct.category,
      laboratory: initialProduct.laboratory,
      requiresPrescription: initialProduct.requiresPrescription,
      controlled: initialProduct.controlled,
      costPrice: initialProduct.costPrice,
      salePrice: initialProduct.salePrice,
      stock: initialProduct.stock,
      active: initialProduct.active,
    });
  }, [initialProduct, reset]);

  async function onSubmit(values: ProductFormValues) {
    const parsed = productSchema.safeParse(values);

    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      if (fields.name?.[0]) setError("name", { message: fields.name[0] });
      if (fields.genericName?.[0]) setError("genericName", { message: fields.genericName[0] });
      if (fields.barcode?.[0]) setError("barcode", { message: fields.barcode[0] });
      if (fields.sku?.[0]) setError("sku", { message: fields.sku[0] });
      if (fields.category?.[0]) setError("category", { message: fields.category[0] });
      if (fields.laboratory?.[0]) setError("laboratory", { message: fields.laboratory[0] });
      return;
    }

    await onSubmitProduct(parsed.data);
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Nombre" error={errors.name?.message} {...register("name")} />
        <Input placeholder="Nombre genérico" error={errors.genericName?.message} {...register("genericName")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="SKU" error={errors.sku?.message} {...register("sku")} />
        <Input placeholder="Barcode" error={errors.barcode?.message} {...register("barcode")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input placeholder="Categoría" error={errors.category?.message} {...register("category")} />
        <Input placeholder="Laboratorio" error={errors.laboratory?.message} {...register("laboratory")} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          type="number"
          step="0.01"
          placeholder="Costo"
          error={errors.costPrice?.message}
          {...register("costPrice", { valueAsNumber: true })}
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Precio venta"
          error={errors.salePrice?.message}
          {...register("salePrice", { valueAsNumber: true })}
        />
        <Input
          type="number"
          placeholder="Stock"
          error={errors.stock?.message}
          {...register("stock", { valueAsNumber: true })}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-2 rounded-lg border border-white/12 bg-slate-950/50 px-3 py-2 text-sm">
          <input type="checkbox" {...register("requiresPrescription")} /> Requiere récipe
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-white/12 bg-slate-950/50 px-3 py-2 text-sm">
          <input type="checkbox" {...register("controlled")} /> Controlado
        </label>
        <label className="flex items-center gap-2 rounded-lg border border-white/12 bg-slate-950/50 px-3 py-2 text-sm">
          <input type="checkbox" {...register("active")} /> Activo
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" className="bg-slate-700 text-slate-100 hover:bg-slate-600" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Crear producto" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}
