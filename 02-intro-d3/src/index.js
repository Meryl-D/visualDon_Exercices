import * as d3 from 'd3';

// Crée le svg
const svg = d3.select('body')
  .append('svg')
  .attr('width', '320')
  .attr('height', '320')

// Crée les groupes de cercles et textes
for (let i = 0; i <= 2; i++) {

  const group = svg.append('g').attr('id', `g${i + 1}`)

  group.append('circle')
    .attr('id', `c${i + 1}`)
    .attr('cx', i * 100 + 50)
    .attr('cy', i * 100 + 50)
    .attr('r', 40)

  group.append('text')
    .text(`cercle ${i + 1}`)
    .attr('x', i * 100 + 50)
    .attr('y', i * 100 + 105)
    .attr("text-anchor", "middle")

  if (i < 2) group.attr('class', 'moved')
}

// Change la couleur du 2ème cercle
d3.select("#c2")
  .attr("fill", "turquoise");

// Déplace les cercles 1 et 2 vers la droite
d3.selectAll(".moved")
  .attr('transform', 'translate(50, 0)')

// Aligne verticalement les cercles en cliquant sur le dernier cercle
d3.select('#c3').on('click', () => {

  d3.selectAll('g').attr('transform', null)
  d3.selectAll('circle').attr('cx', 250)
  d3.selectAll('text').attr('x', 250)
})

// Crée un graphique en barres
const data = [20, 5, 25, 8, 15]

const div = d3.select("body")
    .append("div")

const svgBars = div.append("svg")
        .attr("width", 300)
        .attr("height", 30)

const rect = svgBars.append("svg")

rect.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
                .attr("x", (d, i) => i * 40) // 40 = espacement entre chaque barre
                .attr("y", (d) => rect.attr("height") - d + 30)
                .attr("width", 20) // largeur de chaque barre
                .attr("height", d => d)
                .attr('fill', '#001590')











