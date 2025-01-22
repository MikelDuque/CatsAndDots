import { z } from "zod"

const emptyMessage = "Es requerido especificar este campo";
const passwordValidation = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])$/);
const usernameValidation = new RegExp(/^(?!.*?[#?!@$%^&*+-\s])$/);
const maxFileSize = 5000000;
const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
  username: z.string()
    .min(1, {message: emptyMessage})
    .max(24, {message: "El nombre de usuario es demasido largo"})
    .regex(usernameValidation),
  email: z.string()
    .min(1, {message: emptyMessage})
    .max(50, {message: "El correo introducido es demasiado largo"})
    .email({message: "El formato introducido no es correcto"}),
  password: z.string()
    .min(8, {message: "La contraseña debe contener mínimo 8 caracteres"})
    .regex(passwordValidation, {message: "La contraseña debe contener al menos una mayúscula, un número y un carácter especial"}),
  confirmPassword: z.string(),
  avatar: z.any()
    .refine((file) => file?.size <= maxFileSize, `La imagen no puede ser superior a 5MB.`)
    .refine((file) => imageTypes.includes(file?.type), "Los únicos formatos soportados son: .jpg, .jpeg, .png y .webp")
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas introducidas no coinciden",
  path: ["confirmPassword"]
});