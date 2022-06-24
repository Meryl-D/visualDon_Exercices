import * as d3 from 'd3'

// Import des données
import data from '../data/countries.geojson'

/**---------------------------------------------
 * Exercice 1
 *--------------------------------------------*/

// Défini les dimensions du svg
const width = 100,
    height = 100

// Crée le svg
const svg1 = d3.select('.ex-1')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

// Dessine le trait noir
svg1.append('path')
    .attr('d', 'M 20 10 V 70 H 70 V 10 H 30 V 60 H 60 V 30 H 40 V 50 H 50 V 40')
    .attr('stroke', '#000')
    .attr('fill', 'none')

// Ajoute le cercle rouge
svg1.append('circle')
    .attr('cx', 50)
    .attr('cy', 40)
    .attr('r', 5)
    .attr('fill', 'red')


/**---------------------------------------------
 * Exercice 2
 *--------------------------------------------*/

// Filtre les données qui ont une population plus grandes que 1’000’000 (POP2005)
const popBiggerThanMio = data.features.filter(country => country.properties.POP2005 > 1000000)


// Sort la moyenne de la population par continent
const getContinentAvg = (name, regionNb) => {
    const regionCountries = popBiggerThanMio.filter(country => country.properties.REGION == regionNb)

    const countryNb = regionCountries.length
    const totalPop = regionCountries.reduce((acc, curr) => acc + curr.properties.POP2005, 0)

    return {
        name: name,
        popAvg: Math.round(totalPop / countryNb)
    }
}

// Crée un tableau d'objets avec les noms et populations moyenne de chaque continent
const continentAvgs = [
    getContinentAvg('Europe', 150),
    getContinentAvg('Asie', 142),
    getContinentAvg('Afrique', 2),
    getContinentAvg('Océanie', 9),
    getContinentAvg('Amériques', 19)
]

// trie le tableau de la valeur la plus grande à la plus petite
continentAvgs.sort((a, b) => b.popAvg - a.popAvg)

// Affiche le titre
const divEx2 = d3.select('.ex-2')
divEx2.append('h2').text('Population moyenne par continent')

// Affiche les données obtenues et formatte les miliers avec des apostrophes
continentAvgs.forEach(continent => {
    divEx2.append('p').text(`${continent.name} : ${continent.popAvg.toLocaleString('de-CH')}`)
});


/**---------------------------------------------
 * Exercice 3 - Carte
 *--------------------------------------------*/
const mapMargin = { top: 30, right: 0, bottom: 0, left: 0 },
    mapWidth = 1000 - mapMargin.left - mapMargin.right,
    mapHeight = 800 - mapMargin.top - mapMargin.bottom

// Ajoute le svg
const svg2 = d3.select(".ex-3 .map")
    .append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight)

// Carte et projection
const path = d3.geoPath();
const projection = d3.geoMercator()
    .scale(130)
    .center([0, 20])
    .translate([mapWidth / 2, mapHeight / 2]);

// Définit l'échelle de couleurs
const colorScale = d3.scaleThreshold()
    .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
    .range(d3.schemeBlues[7]);

// Charge les données externes (la carte)
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(mapData => {

    // Crée un tooltip qui est caché par défaut
    const tooltip = d3.select(".ex-3 .map")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("position", "fixed") // important si on veut pas qu'il se foute n'importe où
        .style("display", "block")
        .style("z-index", "9999")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // Crée 3 fonctions qui affiche/cache le tooltip
    const mouseover = (event, d) => {
        tooltip.style("opacity", 1)
    }

    const mousemove = (event, d) => {
        tooltip
            .html(`${d.properties.name}<br>${(d.pop).toLocaleString('de-CH')}`)
            .style("left", (event.x) - 70 + "px")
            .style("top", (event.y) - 70 + "px")
    }

    const mouseleave = (event, d) => {
        tooltip.style("opacity", 0)
    }

    // Dessine la carte
    svg2.append("g")
        .selectAll("path")
        .data(mapData.features)
        .join("path")

        // Dessine chaque pays
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // Ajoute la bonne couleur de chaque pays
        .attr("fill", d => {
            const country = data.features.find(country => country.properties.ISO3 == d.id);
            d.pop = country ? country.properties.POP2005 : 0;
            return colorScale(d.pop);
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Ajoute le titre du graphe
    svg2.append('text')
        .attr('text-anchor', 'center')
        .attr('x', mapWidth / 2)
        .attr('y', mapMargin.top)
        .text('Carte choroplète')
})


/**---------------------------------------------
 * Exercice 3 - Graphe
 *--------------------------------------------*/
// Défini les dimensions et marges du graphe
const graphMargin = { top: 20, right: 30, bottom: 40, left: 90 },
    graphWidth = 600 - graphMargin.left - graphMargin.right,
    graphHeight = 400 - graphMargin.top - graphMargin.bottom;

// Ajoute le svg à la div .graph
const svg3 = d3.select(".ex-3 .graph")
    .append("svg")
    .attr("width", graphWidth + graphMargin.left + graphMargin.right)
    .attr("height", graphHeight + graphMargin.top + graphMargin.bottom)
    .append("g")
    .attr("transform", `translate(${graphMargin.left}, ${graphMargin.top})`);

// Ajoute l'axe X
const x = d3.scaleLinear()
    .domain([0, d3.max(continentAvgs, d => d.popAvg)])
    .range([0, graphWidth]);
svg3.append("g")
    .attr("transform", `translate(0, ${graphHeight})`)
    .call(d3.axisBottom(x).tickFormat(d3.format('~s')))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Ajoute l'axe Y
const y = d3.scaleBand()
    .range([0, graphHeight])
    .domain(continentAvgs.map(d => d.name))
    .padding(.1);
svg3.append("g")
    .call(d3.axisLeft(y))

// Crée un tooltip qui est caché par défaut
const tooltip = d3.select(".ex-3 .graph")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("position", "fixed")
    .style("display", "block")
    .style("z-index", "9999")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

// Crée 3 fonctions qui affiche/cache le tooltip
const mouseover = (event, d) => {
    tooltip.style("opacity", 1)
}

const mousemove = (event, d) => {
    tooltip
        .html(`${d.name}<br>${(d.popAvg).toLocaleString('de-CH')}`)
        .style("left", (event.x) - 70 + "px")
        .style("top", (event.y) - 70 + "px")
}

const mouseleave = (event, d) => {
    tooltip.style("opacity", 0)
}

//Barres
svg3.selectAll("myRect")
    .data(continentAvgs)
    .join("rect")
    .transition() // petite transition lors du chargement
    .duration(1000)
    .attr("x", x(0))
    .attr("y", d => y(d.name))
    .attr("width", d => x(d.popAvg))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

// Ajoute les events après car sinon bug avec la transition
svg3.selectAll("rect")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)