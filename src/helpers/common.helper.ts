export async function wait(delay: number = 500) {
  await new Promise(resolve => setTimeout(resolve, delay));
}
