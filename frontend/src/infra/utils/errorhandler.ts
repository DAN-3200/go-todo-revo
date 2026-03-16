// *só usar isso pra tratar error, não tem motivo de não usar pra não tratar error
type Result<E, T> = [E] | [undefined, T];
type PromiseResutl<E, T> = Promise<Result<E, T>>;

export function tryErr<E extends Error, T>(exe: () => T): Result<E, T> {
   try {
      const r = exe();
      return [undefined, r as T];
   } catch (e) {
      return [e as E];
   }
}

export async function tryErrAsync<E extends Error, T>(
   exe: Promise<T>,
): PromiseResutl<E, T> {
   try {
      const r = await exe;
      return [undefined, r as T];
   } catch (e) {
      return [e as E];
   }
}
