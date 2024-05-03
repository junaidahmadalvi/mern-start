import { BULK_WRITE_BATCH_SIZE } from "../config/constant";

BULK_WRITE_BATCH_SIZE;
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function createAndGetBatches(arr, batchSize = BULK_WRITE_BATCH_SIZE) {
  const batches = [];
  for (let i = 0; i < arr.length; i += batchSize) {
    const batch = arr.slice(i, i + batchSize);
    batches.push(batch);
  }
  return batches;
}
