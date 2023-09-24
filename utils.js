export function replaceEmptyStringWithNull(data) {
  return data.map((obj) => {
    for (const key in obj) {
      if (obj[key] === "") {
        obj[key] = null;
      }
    }
    return obj;
  });
}
