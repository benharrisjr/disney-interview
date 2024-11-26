export const getInitialData = async () => {
    const response = await fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
    const data = await response.json()
    return data?.data?.StandardCollection
}

export const getRefData = async (refId) =>  {
    const response = await fetch(`https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`)
    const data = await response.json()
    return data?.data
}
