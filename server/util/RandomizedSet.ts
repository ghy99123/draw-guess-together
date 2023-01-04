// Insert, remove, and randomly get a data from a list in O(1) time.
// https://leetcode.com/problems/insert-delete-getrandom-o1/

export default class RandomizedSet<T> {
  indexMap = new Map<T, number>();
  itemMap = new Map<number, T>();
  size = 0;

  constructor(private data: T[]) {
    if (data.length === 0) {
      throw new Error("data length is 0.");
    }

    this.insertAll(data);
  }

  private insertAll(items: T[]) {
    items.forEach((item) => {
      this.insert(item);
    });
  }

  insert(item: T) {
    // each item should be unique
    if (this.indexMap.has(item)) return false;
    this.indexMap.set(item, this.size);
    this.itemMap.set(this.size, item);
    this.size += 1;
    return true;
  }

  /**
   * Removes an item from the set if present
   * @param item
   * @returns true if the item was present, false otherwise
   */
  remove(item: T) {
    const targetIndex = this.indexMap.get(item);
    if (targetIndex === undefined) return false;
    const lastItem = this.itemMap.get(this.size - 1) as T;
    this.indexMap.set(lastItem, targetIndex);
    this.itemMap.set(targetIndex, lastItem);
    this.indexMap.delete(item);
    this.itemMap.delete(this.size - 1);
    this.size -= 1;
    return true;
  }

  /**
   * Returns a random element from the current set of elements and removes that element from the current set.
   * @returns a random element from the current set of elements
   */
  getRandom(): T {
    let result = this.itemMap.get(Math.floor(Math.random() * this.size));
    if (result === undefined) { // reset data if all the elements have been removed
      this.insertAll(this.data);
      result = this.itemMap.get(Math.floor(Math.random() * this.size)) as T;
    }
    this.remove(result);
    return result;
  }
}
