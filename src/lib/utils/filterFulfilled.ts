export function filterFulfilled<T>(results: PromiseSettledResult<T>): results is PromiseFulfilledResult<T> {
  return results.status === 'fulfilled';
}
