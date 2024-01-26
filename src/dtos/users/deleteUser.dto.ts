import { z } from "zod";

export const DeleteUserInputSchema = z.object({
  idToDelete: z.string(),
});

export type DeleteUserInputDTO = z.infer<typeof DeleteUserInputSchema>;