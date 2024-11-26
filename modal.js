export const renderModalContent = (tileData) => {
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