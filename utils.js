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

export const createRowContent = (rowData, index) => {
    const div = document.createElement('div')
    const rowTitle = document.createElement('span')
    const categoryTitle = get(rowData?.text, 'content')
    rowTitle.classList.add('row-title')
    rowTitle.textContent = categoryTitle
    const row = document.createElement('div')
    row.className = 'row'
    row.dataset.index = index
    
    // currentSelectionIndex[index] = 0

    rowData?.items?.map((item, i) => {
        // const imageUrl = item.collectionId ? get(item?.image?.tile?.['0.71'], 'url') : get(item?.image?.tile?.['1.78'], 'url')
        const imageUrl = get(item?.image?.tile?.['1.78'], 'url')
        const card = document.createElement('a')
        card.id = `${index}_${i}`
        card.className ='card'
        const image = document.createElement('img')
        if (rowData?.refId) {
            image.loading = 'lazy'
        }
        image.src = imageUrl
        image.style.width = '100%'
        image.style.height = 'auto'
        // image.style.minHeight = '130px'
        card.appendChild(image)
        row.appendChild(card)    

    })
    div.appendChild(rowTitle)
    div.appendChild(row)
    return div
}
  