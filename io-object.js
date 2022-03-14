function makeIOObject(a = [], start = 0, step = 1) {
  let nextIndex = start;
  let uniqueEntries = new Map();

  const ioObject = {
    next: function() {
      if (nextIndex < a.length - 1) {
        nextIndex += step;
      }
      return a[nextIndex]
    },
    peekNext: function() {
      if (nextIndex < a.length - 1) {
        return a[nextIndex + step]
      }
      return a[nextIndex]
    },
    previous: function() {
      if (nextIndex == start)
        return a[nextIndex]
      if (nextIndex > start) {
        nextIndex -= step;
      }
      return a[nextIndex]
    },
    current: function() {
      return a[nextIndex]
    },
    add: function(b) {
      // Only add stories we don't already have.
      b = b.filter(i => !uniqueEntries.has(i.title));
      // Only add stories from the last 24 hrs
      b = b.filter(i => {
        let d = new Date(i["dc:date"]).getTime();
        let n = new Date().getTime();
        // This is the number of ms in 24hrs.
        return (n - d < 86362145);
      });

      b.forEach(i => uniqueEntries.set(i.title, 1));
      a = a.concat(b);
    },
    length: function() {
      return a.length;
    },
  };
  return ioObject;
}
