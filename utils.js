export const dig = (obj, target) =>
    target in obj
      ? obj[target]
      : Object.values(obj).reduce((acc, val) => {
          if (acc !== undefined) return acc;
          if (typeof val === 'object') return dig(val, target);
        }, undefined);

export const get = (obj, targetKey) => {
    for (const key in obj) {
      if (key === targetKey) {
        return obj[key]; // Found the key!
      } else if (typeof obj[key] === 'object') {
        const result = get(obj[key], targetKey);
        if (result !== undefined) {
          return result; // Found in nested object!
        }
      }
    }
    return undefined; // Key not found
  }
export const scaleSelection = (selection, prevSelection) => {
    if (selection !== prevSelection) {
        selection.style.transform = 'scale(1.05, 1.05)'
        prevSelection.style.transform = 'scale(1, 1)'
    }
}

export const slideRow = (row, dir) => {
    // console.low(row)
    if (dir === -1) {
        row.style.transform = 'translate(-500px,0)'    
    }
    if (dir === 1) {
        row.style.transform = 'translate(500px, 0)'    
    }
}
  