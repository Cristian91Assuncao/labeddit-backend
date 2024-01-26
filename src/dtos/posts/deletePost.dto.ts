import { z } from "zod";

export const DeletePostInputSchema = z.object({
  idToDelete: z.string(),
});

export type DeletePostInputDTO = z.infer<typeof DeletePostInputSchema>;