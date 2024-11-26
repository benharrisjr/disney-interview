import { get, scaleSelection, createRowContent } from './utils.js'
import { getInitialData, getRefData } from './api.js'
import { renderModalContent } from './modal.js'

let { containers } = await getInitialData()

const appRoot = document.getElementById('app')

const renderInitialContent = () => {
    const fragment = document.createDocumentFragment()
    let loadMoreInserted = false
    containers.map((container, index) => {
        if (container?.set?.refId && !loadMoreInserted) {
            const loadMore = document.createElement('div')
            loadMore.id = 'load-more'
            fragment.appendChild(loadMore)
            loadMoreInserted = true
        }
        //Some data issues with the first row
        if (index > 0) {
            const row = createRowContent(container?.set, index)
            row.dataset.rowNumber = index
            fragment.appendChild(row)
        }
        
    })
    appRoot.appendChild(fragment)
}
const renderRefContent = () => {
    containers.forEach(async (container, index) => {
        if (container?.set?.refId) {
            const row = document.querySelector(`[data-row-number="${index}"]`)
            const newRow = document.createElement('div')
            newRow.className = 'row'
            newRow.dataset.index = index
            const refData = await getRefData(container?.set?.refId)
            const refSubData = refData[Object.keys(refData)[0]]
            containers[index].set = { ...refSubData, ...containers[index].set}
            refSubData?.items?.map((item, i) => {
                const imageUrl = get(item?.image?.tile?.['1.78'], 'url')
                const card = document.createElement('a')
                card.id = `${index}_${i}`
                card.className ='card'
                const image = document.createElement('img')
                image.loading = 'lazy'
                image.src = imageUrl
                image.style.width = '100%'
                image.style.height = 'auto'
                card.appendChild(image)
                const prevRow = row.lastChild
                
                newRow.appendChild(card)    
                row.replaceChild(newRow, prevRow)
        
            })
            
        }
    })
    const loadMore = document.getElementById('load-more')
    loadMore.remove()
}

renderInitialContent()

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0,
};
  
const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
        renderRefContent()
        observer.disconnect()
    }
}, options);
let target = document.querySelector('#load-more')
observer.observe(target)

// Event Listeners

let currentRow = 1
let currentColumn = 0

// Default tile selection border
const initialSelection = document.getElementById(`${currentRow}_${currentColumn}`)
initialSelection.classList.add('selected')

// TODO: optimize selection
// Use a map of rows and current columns to better navigate vertically
// without scrolling far down into the next category because you are 10 
// deep in another
// let currentSelectionIndex = {}
let activeKey = ''
let prevSelection
document.addEventListener('keydown', function(e) {
    prevSelection = document.getElementById(`${currentRow}_${currentColumn}`)
    if (activeKey == e.key) return;
    activeKey = e.key;
    //left
    if (e.key == 'ArrowLeft') {
        if (currentColumn > 0) {
            currentColumn -= 1
        } else {
            currentColumn = 0
        }
        
    }
    //top
    else if (e.key == 'ArrowUp') {
        if (currentRow > 1) {
            currentRow -= 1
        } else {
            currentRow = 1
        }
    }
    //right
    else if (e.key == 'ArrowRight') {
        if (currentColumn < containers[currentRow]?.set?.items.length) {
            currentColumn += 1
        }
    }
    //bottom
    else if (e.key == 'ArrowDown') {
        if (currentRow < containers.length-1) {
             currentRow += 1
        }
    }

    const selectedTileData = containers[currentRow]?.set?.items[currentColumn]
    const selection = document.getElementById(`${currentRow}_${currentColumn}`)
    if (selection !== prevSelection) {
        selection.classList.add('selected')
        prevSelection.classList.remove('selected') 
        selection.scrollIntoViewIfNeeded()
    }
    
    scaleSelection(selection, prevSelection)
    if (e.key === 'Enter') {
        renderModalContent(selectedTileData)
    }
    if (e.key === 'Escape' || e.key === 'Backspace') {
        const modal = document.getElementById('modal')
        const modalContent = document.querySelector('.content-modal')
        modal.removeChild(modalContent)
        modal.style.display = 'none'
    }
    
});
document.addEventListener('keyup', () =>  {
    activeKey = 0;
});
