export function wrapErrors(errors: { [ field: string ]: string }): { errors: { [ field: string ]: string } } {
  return {
    errors,
  };
}
