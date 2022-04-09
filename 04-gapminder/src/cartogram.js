import topogram from 'topogram'; // pourquoi ça marche pas wesh ?!
import * as d3 from 'd3';
import { getLifeExpectancy, swapNulls } from './data.js';

const year = 2021;
// Importe les données
const lifeExpectancy = swapNulls(year, getLifeExpectancy());

d3.select('body')
    .append('div')
    .attr('class', 'cartogram fullscreen');