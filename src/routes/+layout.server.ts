export async function load({ locals }) {
  const { user, session } = await locals.auth.validateUser();
  console.log({ session });
  return { user };
}
