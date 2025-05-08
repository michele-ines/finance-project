export async function handleRequest<T>(handler: () => Promise<T>): Promise<T | void> {
  try {
    return await handler();
  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro. Tente novamente.");
  }
}