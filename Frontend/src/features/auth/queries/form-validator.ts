import { z } from "zod"

const emptyMessage = "Es requerido especificar este campo";
const passwordValidation = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64}$/);
const usernameValidation = new RegExp(/^(?=.*[a-z])(?=.*\d)$/);
const maxFileSize = 10e6;
const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
  username: z.string()
    .min(1, {message: emptyMessage})
    .max(24, {message: "El nombre de usuario es demasido largo"})
    .regex(usernameValidation, {message: "El nombre de usuario no puede contener mayúsculas ni ciertos símbolos especiales"}),
  mail: z.string()
    .min(1, {message: emptyMessage})
    .max(50, {message: "El correo introducido es demasiado largo"})
    .email({message: "El formato introducido no es correcto"}),
  password: z.string()
    .min(8, {message: "La contraseña debe contener mínimo 8 caracteres"})
    .max(64, {message: "La contraseña debe contener máximo 64 caracteres"})
    .regex(passwordValidation, {message: "La contraseña debe contener al menos una mayúscula, un número y un carácter especial"}),
  confirmPassword: z.string(),
  avatar: z.any()
    .optional()
    .superRefine((file, ctx) => {
      if (!file || file.size <= 0) return;

      if (file.size > maxFileSize) {
        ctx.addIssue({
          message: "La imagen no puede ser superior a 10MB.",
          code: z.ZodIssueCode.custom
        })
      }

      if (!imageTypes.includes(file.type)) {
        ctx.addIssue({
          message: "Los únicos formatos soportados son: .jpg, .jpeg, .png y .webp",
          code: z.ZodIssueCode.custom
        })
      }
    })
    //.refine((file) => !file || file?.size <= maxFileSize, `La imagen no puede ser superior a 10MB.`)
    //.refine((file) => !file || imageTypes.includes(file?.type), "Los únicos formatos soportados son: .jpg, .jpeg, .png y .webp")
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas introducidas no coinciden",
  path: ["confirmPassword"]
});