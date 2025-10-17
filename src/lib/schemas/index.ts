import { z } from "zod";
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string(),
});
const schemaForgotPassword = z.object({
  email: z.string().email("Invalid email address"),
});
const ChangePasswordSchema = z.object({
  newPassword: z.string().min(1, "New Password is required"),
  confirmPassword: z.string().min(1, "New Password is required"),
});

const schemaFranchise = z.object({
  username: z.string().min(1, "Your name is required"),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, {
    message:
      "Phone number must start with +91 and be followed by 10 digits starting with 6, 7, 8, or 9.",
  }),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  officeName: z.string().min(1, "Office name is required"),
  officeAddress: z.string().min(1, "Office address is required"),
  // state: z.string().min(1, "State is required"),
  // district: z.string().optional(),
  // taluk: z.string().optional(),
  // panchayat: z.string().optional(),
  // postOffice: z.string().min(1, "Post office is required"),
  // pin: z
  //   .string()
  //   .min(1, "Pin is required")
  //   .refine((val) => !isNaN(Number(val)), {
  //     message: "Pin must be a 6 digit number",
  //   })
  //   .transform((val) => Number(val)),
  leadState: z.string().min(1, "leadState is required"),
  leadDistrict: z.string().nullable().optional(),
});
const schemaCreateService = z.object({
  title: z.string().min(1, "Your title is required"),
  description: z.string().min(1, "Your description is required").optional(),
  // feeAmount: z.coerce
  //   .number()
  //   .min(1, "Your fee amount is required and must be a positive number"),
  // serviceCharge: z.coerce
  //   .number()
  //   .min(
  //     1,
  //     "Your service charge is required and must be a positive number greater than 0"
  //   ),
  // image: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => file?.type.startsWith("image/"), "File must be an image"),
});
 const teamSchema = z.object({
    name: z.string().min(3, { message: 'Team name must be at least 3 characters long.' }),
    pokemons: z
        .array(z.string())
        .min(1, { message: 'Please select at least one Pokémon.' })
        .max(6, { message: 'You can select a maximum of 6 Pokémon.' }),
});
export {
  schema,
  schemaForgotPassword,
  ChangePasswordSchema,
  schemaFranchise,
  schemaCreateService,
  teamSchema
};
