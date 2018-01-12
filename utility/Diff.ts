export class Diff {

  public static compare(objectA: any, objectB: any, excludeNulls?: boolean, exclueProps?: string[]): any {
    const res = {
      equal: true,
      diff: {},
    };

    if (!objectA && !objectB) {
      res.equal = false;
      return res;
    }

    if (!objectA || !objectB) {
      res.equal = false;
      res.diff = {
        old: objectA,
        new: objectB,
      };
      return res;
    }

    for (const i in objectB) {
      if (!objectB.hasOwnProperty(i)) {
        continue;
      }
      if (excludeNulls && objectB[i] == null) {
        continue;
      }
      if (!!exclueProps && (exclueProps.indexOf(i) != -1)) {
        continue;
      }
      if (objectA[i] !== null && Array.isArray(objectA[i])) {
        if (!this.matchArrays(objectA[i], objectB[i])) {
          res.equal = false;
          res.diff[i] = {
            old: objectA[i],
            new: objectB[i],
          };
        }
        continue;
      }
      if (objectA[i] !== null && typeof objectA[i] === "object") {
        const subDiff: any = this.compare(objectA[i], objectB[i], excludeNulls, exclueProps);
        if (!subDiff.equal) {
          res.equal = false;
          res.diff[i] = subDiff.diff;
        }
        continue;
      }
      if (objectA[i] !== null && typeof objectA[i] === "function") {
        continue;
      }
      if (objectA[i] !== objectB[i]) {
        res.equal = false;
        res.diff[i] = {
          old: objectA[i],
          new: objectB[i],
        };
        continue;
      }
    }
    return res;
  }

  private static matchArrays(arrayA, arrayB): boolean {
    if (!arrayA || !arrayB) {
      return false;
    }
    if (arrayA.length != arrayB.length) {
      return false;
    }
    for (let i = 0; i < arrayA.length; i++) {

      if (arrayA[i] instanceof Array && arrayB[i] instanceof Array) {
        if (!this.matchArrays(arrayA[i], arrayB[i])) {
          return false;
        }
      } else if (arrayA[i] != arrayB[i]) {
        return false;
      }
    }
    return true;
  }
}
