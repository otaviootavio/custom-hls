import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "./Input";
import { useHashChain } from "../context/HashChainContext";

const schema = z.object({
  secret: z.string().min(1, "Secret is required"),
  length: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Length must be a number",
    })
    .transform((val) => Number(val))
    .refine((val) => val >= 1, { message: "Length must be at least 1" }),
  key: z.string().min(1, "Key is required"),
});

type FormData = z.infer<typeof schema>;

const GenerateHash: React.FC = () => {
  const { addNewHashChain } = useHashChain();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    addNewHashChain(data.secret, Number(data.length), data.key);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 bg-gray-900 rounded-lg shadow-md"
    >
      <Controller
        name="secret"
        control={control}
        render={({ field }) => (
          <Input
            label="Secret"
            type="text"
            value={field.value}
            onChange={field.onChange}
            error={errors.secret?.message}
          />
        )}
      />
      <Controller
        name="length"
        control={control}
        render={({ field }) => (
          <Input
            label="Length"
            type="number"
            value={field.value}
            onChange={field.onChange}
            error={errors.length?.message}
          />
        )}
      />
      <Controller
        name="key"
        control={control}
        render={({ field }) => (
          <Input
            label="Key"
            type="text"
            value={field.value}
            onChange={field.onChange}
            error={errors.key?.message}
          />
        )}
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Create hash chain
      </button>
    </form>
  );
};

export default GenerateHash;
