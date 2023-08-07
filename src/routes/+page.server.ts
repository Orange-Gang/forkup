import { prisma } from "$lib/prisma";

export const actions = {
  createPost: async ({ locals, request }) => {
    const form = await request.formData();
    const textarea = form.get("test");

    console.log({ textarea });
  },
}
