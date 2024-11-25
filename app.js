import { dig, get, scaleSelection, slideRow } from './utils.js'
import { getInitialData, getRefData } from './api.js'

let currentRow = 0
let currentColumn = 0

let activeKey = ''
// Event Listeners
document.addEventListener('keydown', function(e) {
    console.log(e.key)
    const prevSelection = document.getElementById(`${containers[currentRow]?.set?.items[currentColumn]?.contentId || containers[currentRow]?.set?.items[currentColumn]?.collectionId}`)
    if (activeKey == e.key) return;
    activeKey = e.key;
    let currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
    //left
    if (e.key == 'ArrowLeft') {
        console.log('start moving LEFT');
        if (currentColumn > 0) {
            currentColumn -= 1
            // slideRow(currentRowElement, -1)
        } else {
            currentColumn = 0
        }
        
    }
    //top
    else if (e.key == 'ArrowUp') {
        console.log('start moving UP');
        if (currentRow > 0) {
            currentRow -= 1
            currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
        } else {
            currentRow = 0
        }
    }
    //right
    else if (e.key == 'ArrowRight') {
        
        console.log(containers[currentRow]?.set?.items.length)
        if (currentColumn < containers[currentRow]?.set?.items.length) {
            console.log('start moving RIGHT');
            currentColumn += 1
            currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
            // slideRow(currentRowElement, 1)
        }
    }
    //bottom
    else if (e.key == 'ArrowDown') {
        console.log('start moving DOWN');
        console.log(containers)
        if (currentRow < maxRow) {
            currentRow += 1
        }
    }
    console.log(currentColumn)
    console.log(currentRow)
    console.log(document.getElementById(`${containers[currentRow]?.set?.items[currentColumn]?.contentId}`))
    const selectedTileData = containers[currentRow]?.set?.items[currentColumn]
    const selection = document.getElementById(`${selectedTileData?.contentId || selectedTileData?.collectionId}`)
    if (selection !== prevSelection) {
        selection.classList.add('selected')
        prevSelection.classList.remove('selected')
        selection.scrollIntoView(false, { behavior: 'smooth' })
    }
    
    // console.log(currentRowElement)
    scaleSelection(selection, prevSelection)
    if (e.key === 'Enter') {
        const modal = document.getElementById('modal')
        modal.style.display = 'block'
        const modalContent = document.createElement('div')
        modalContent.classList.add('content-modal')
        modalContent.style.backgroundImage = `url(${get(selectedTileData?.image?.hero_collection?.['1.78'], 'url')})`
        // modalContent.style.height = 'auto'
        // modalContent.style.width = '100%'
        modal.appendChild(modalContent)
    }
    if (e.key === 'Escape' || e.key === 'Backspace') {
        const modal = document.getElementById('modal')
        const modalContent = document.querySelector('.content-modal')
        modal.removeChild(modalContent)
        modal.style.display = 'none'
    }
    
});
document.addEventListener('keyup', function(e) {
    switch (e.key) {
        case 'left': // left
        case 'right': // right
            console.log('stop moving HOR');
            dx = 0;
            break;

        case 'up': // up
        case 'down': // down
            console.log('stop moving VER');
            dy = 0;
            break;
    }

    activeKey = 0;
});

const { containers } = await getInitialData()
console.log(containers)

const initialContent = containers.filter((container) => !container?.set?.refId)
const refContent = containers.filter((container) => container?.set?.refId)

let maxRow = initialContent.length - 1
console.log(initialContent)
console.log(refContent)
const appRoot = document.getElementById('app')
const fragment = document.createDocumentFragment()

const renderInitialContent = () => {
    initialContent.map((container, index) => {
        let items = container?.set?.items
        console.log(container)
        if (container?.set?.refId) {
            const refData = getRefData(container?.set?.refId)
            items = get(refData, items)
            console.log(refData)
        }
        const div = document.createElement('div')
        const categoryTitle = get(container.set.text, 'content')
        const row = document.createElement('div')
        row.className = 'row'
        row.dataset.index = index
        div.textContent = categoryTitle
    
        container?.set?.items?.map((item) => {
            // Get 16:9 aspect ratio tiles
            const imageUrl = get(item?.image?.tile?.['1.78'], 'url')
            const card = document.createElement('a')
            card.id = item.contentId || item.collectionId
            card.className ='card'
            const image = document.createElement('img')
            image.loading = 'lazy'
            image.src = imageUrl
            image.style.width = '100%'
            image.style.height = 'auto'
            image.style.minHeight = '130px'
            card.appendChild(image)
            row.appendChild(card)    
    
        })
        div.appendChild(row)
        fragment.appendChild(div)
    })
}
const renderRefContent = () => {

}
renderInitialContent()

const options = {
    root: document.querySelector("#app"),
    rootMargin: "0px",
    threshold: 0.5,
  };

const callback = () => {

}
  
const observer = new IntersectionObserver(callback, options);
let target = document.querySelector('#app').lastElementChild
console.log(document.querySelector('#app'))
// observer.observe(target)



console.log(document.getElementById(`${containers[currentRow]?.set?.items[currentColumn]?.contentId}`))
appRoot.appendChild(fragment)
