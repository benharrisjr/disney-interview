import { get, scaleSelection, getAspectRatio, createRowContent } from './utils.js'
import { getInitialData, getRefData } from './api.js'

const { containers } = await getInitialData()
console.log(containers)
const initialContent = containers.filter((container) => !container?.set?.refId)
let refDataLoaded = false

const appRoot = document.getElementById('app')

const renderInitialContent = () => {
    const fragment = document.createDocumentFragment()
    initialContent.map((container, index) => {
        if (index > 0) {
            const row = createRowContent(container?.set, index)
            row.dataset.rowNumber = index
            fragment.appendChild(row)
        }
    })
    appRoot.appendChild(fragment)
}
const renderRefContent = () => {
    const appRoot = document.getElementById('app')
    const refFragment = document.createDocumentFragment()
    containers.map(async (container, index) => {
        if (container?.set?.refId) {
            const refData = await getRefData(container?.set?.refId)
            console.log(refData[Object.keys(refData)[0]])
            const refSubData = refData[Object.keys(refData)[0]]
            const row = createRowContent(refSubData, index)
            row.dataset.rowNumber = index
            refFragment.appendChild(row)
            appRoot.appendChild(refFragment)
            
        }
    })
    const loadMore = document.getElementById('load-more')
    loadMore.remove()
    refDataLoaded = true
}

const renderModalContent = (tileData) => {
    const modal = document.getElementById('modal')
    modal.style.display = 'block'
    const modalContent = document.createElement('div')
    modalContent.classList.add('content-modal')
    const modalTitle = document.createElement('div')
    modalTitle.classList.add('modal-title-info')
    const modalSubTitle = document.createElement('div')
    const modalLogo = document.createElement('img')
    
    const modalRuntime = document.createElement('span')
    let modalBackground
    if (tileData?.videoArt.length !== 0) {
        modalBackground = document.createElement('video')
        modalBackground.src = get(tileData?.videoArt, 'url')
        modalBackground.autoplay = true
        modalBackground.loop = true
    } else {
        modalBackground = document.createElement('div')
        const imageUrl = get(tileData?.image?.hero_collection?.['1.78'], 'url').replace('width=500', 'width=1440')
        modalBackground.style.backgroundImage = `url(${imageUrl})`
        modalBackground.style.backgroundSize = 'cover'
        modalBackground.style.backgroundRepeat = 'no-repeat'
    }
    modalBackground.classList.add('modal-background')
    

    const logoUrl = get(tileData?.image?.logo?.['2.00'] || tileData?.image?.title_treatment_layer?.['1.78'], 'url')
    modalLogo.src = logoUrl?.replace('jpeg', 'png')
    if (tileData?.ratings) {
        const modalRating = document.createElement('span')
        const rating = get(tileData?.ratings, 'value')
        modalRating.classList.add('subtitle-cards')
        modalRating.textContent = rating
        modalTitle.appendChild(modalRating)
    }
    if (tileData?.releaseDate) {
        const modalReleaseDate = document.createElement('span')
        const releaseDate = get(tileData?.releases, 'releaseDate')
        modalSubTitle.classList.add('subtitle-data')
        modalReleaseDate.textContent = releaseDate
        modalSubTitle.appendChild(modalReleaseDate)
    }
    
    modalTitle.appendChild(modalLogo)
    modalContent.appendChild(modalLogo)
    modalContent.appendChild(modalTitle)
    modalContent.appendChild(modalSubTitle)
    modalContent.appendChild(modalBackground)
    
    modal.appendChild(modalContent)
}
renderInitialContent()

const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
};
  
const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
        console.log('loading refs')
        renderRefContent()
        observer.disconnect()
    }
}, options);
let target = document.querySelector('#load-more')
observer.observe(target)

// Event Listeners

let currentRow = 1
let currentColumn = 0

// Default tile selection
const selectedTileData = containers[currentRow]?.set?.items[currentColumn]
const initialSelection = document.getElementById(`${currentRow}_${currentColumn}`)
initialSelection.classList.add('selected')

// TODO: optimize selection
// Use a map of rows and current columns to better navigate vertically
// without scrolling far down into the next category because you are 10 
// deep in another
// let currentSelectionIndex = {}
const setSelection = (row = 0, col = 0) => {

}
let activeKey = ''
let prevSelection
document.addEventListener('keydown', function(e) {
    const categoryTitle = get(containers[currentRow]?.set?.text, 'content')
    prevSelection = document.getElementById(`${currentRow}_${currentColumn}`)
    if (activeKey == e.key) return;
    activeKey = e.key;
    // let currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
    //left
    if (e.key == 'ArrowLeft') {
        console.log('start moving LEFT');
        if (currentColumn > 0) {
            currentColumn -= 1
        } else {
            currentColumn = 0
        }
        
    }
    //top
    else if (e.key == 'ArrowUp') {
        console.log('start moving UP');
        if (currentRow > 1) {
            currentRow -= 1
            // currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
        } else {
            currentRow = 1
        }
    }
    //right
    else if (e.key == 'ArrowRight') {
        if (currentColumn < containers[currentRow]?.set?.items.length) {
            console.log('start moving RIGHT');
            currentColumn += 1
            // currentRowElement = document.querySelector(`[data-index="${currentRow}"]`)
        }
    }
    //bottom
    else if (e.key == 'ArrowDown') {
        console.log('start moving DOWN');
        console.log(currentRow)
        if (currentRow < containers.length-1) {
             currentRow += 1
            //  scrollBy(0,50,{ behavior: 'smooth' })
        }
    }

    const selectedTileData = containers[currentRow]?.set?.items[currentColumn]
    const selection = document.getElementById(`${currentRow}_${currentColumn}`)
    if (selection !== prevSelection) {
        selection.classList.add('selected')
        prevSelection.classList.remove('selected') 
        // selection.scrollIntoView(false, { behavior: 'smooth', block: 'center', inline: 'center' })
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
