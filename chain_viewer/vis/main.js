const color = {
	"A": ["#dc143c", "#ffffff"],
	"C": ["#ffff00", "#000000"],
	"G": ["#007000", "#ffffff"],
	"T": ["#191970", "#ffffff"],
	"N": ["#5f5f5f", "#ffffff"],
	"Other": ["#000000", "#ffffff"]
};


let svg_canvas_width = window.innerWidth * 0.9;
let aspect = 12/4;
svg_canvas_height = svg_canvas_width/aspect;

let genome1_title_svg             = d3.select("#genome1_title").attr("width", svg_canvas_width);
let genome2_title_svg             = d3.select("#genome2_title").attr("width", svg_canvas_width);

let genome1_minimap_svg           = d3.select("#genome1_minimap").append("svg").attr("width", svg_canvas_width).attr("height", 30)//.attr("style", "background-color:#ffffff;");
let genome2_minimap_svg           = d3.select("#genome2_minimap").append("svg").attr("width", svg_canvas_width).attr("height", 30)//.attr("style", "background-color:#ffffff;");

let genome1_axis_svg              = d3.select("#genome1_axis").append("svg").attr("width", svg_canvas_width).attr("height", 20).attr("style", "background-color:#c6ffff;");
let genome2_axis_svg              = d3.select("#genome2_axis").append("svg").attr("width", svg_canvas_width).attr("height", 20).attr("style", "background-color:#ffffc6;");

let genome1_sequence_svg          = d3.select("#genome1_sequence").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);
let genome2_sequence_svg          = d3.select("#genome2_sequence").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);

let genome1_snp_svg               = d3.select("#genome1_snp").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);
let genome2_snp_svg               = d3.select("#genome2_snp").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);

let genome1_repeat_svg            = d3.select("#genome1_repeat").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);
let genome2_repeat_svg            = d3.select("#genome2_repeat").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);

let genome1_gene_svg              = d3.select("#genome1_gene").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);
let genome2_gene_svg              = d3.select("#genome2_gene").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);

let genome1_covered_as_source_svg = d3.select("#genome1_covered_as_source").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 40);
let genome2_covered_as_source_svg = d3.select("#genome2_covered_as_source").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 40);

let genome1_covered_as_target_svg = d3.select("#genome1_covered_as_target").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 40);
let genome2_covered_as_target_svg = d3.select("#genome2_covered_as_target").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 40);


let chain_svg = d3.select("#chain").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);


let tooltip = d3.select("body").append("div").attr("visibility", "hidden").classed("tooltip", true)




class GenomeCoordinateInfo {
	constructor(leftend, rightend, length, center, genome_name, chromosome_name, NtSize) {
		this.leftend         = leftend;
		this.rightend        = rightend;
		this.length          = length;
		this.center          = center;
		this.genome_name     = genome_name;
		this.chromosome_name = chromosome_name;
		this.NtSize          = NtSize;
	}
}
const initial_leftend  = 0
const initial_rightend = 1011000
const initial_length   = initial_rightend - initial_leftend
const initial_center   = initial_leftend + initial_length / 2
const initial_NtSize   = parseFloat(svg_canvas_width) / initial_length

let genome1 = new GenomeCoordinateInfo(initial_leftend, initial_rightend, initial_length, initial_center, "GRCh38", "chr1", initial_NtSize)
let genome2 = new GenomeCoordinateInfo(initial_leftend, initial_rightend, initial_length, initial_center, "GRCh37", "chr1", initial_NtSize)
let genome3 = new GenomeCoordinateInfo(initial_leftend, initial_rightend, initial_length, initial_center, "", "chr1", initial_NtSize)

function updateRegionInfo(){
	const genome1_leftend         = parseInt(document.getElementById("genome1_begin").value.replace(/,/g, ''));
	const genome1_rightend        = parseInt(document.getElementById("genome1_end").value.replace(/,/g, ''));
	const genome1_length          = genome1_rightend - genome1_leftend;
	const genome1_center          = genome1_leftend + genome1_length / 2;
	const genome1_genome_name     = document.getElementById("genome1_assembly").value;
	const genome1_chromosome_name = document.getElementById("genome1_chromosome").value;
	const genome1_NtSize          = parseFloat(svg_canvas_width) / genome1_length;
	if(genome1_leftend < genome1_rightend){
		genome1 = new GenomeCoordinateInfo(genome1_leftend, genome1_rightend, genome1_length, genome1_center, genome1_genome_name, genome1_chromosome_name, genome1_NtSize)
	}
	const genome2_leftend         = parseInt(document.getElementById("genome2_begin").value.replace(/,/g, ''));
	const genome2_rightend        = parseInt(document.getElementById("genome2_end").value.replace(/,/g, ''));
	const genome2_length          = genome2_rightend - genome2_leftend;
	const genome2_center          = genome2_leftend + genome2_length / 2;
	const genome2_genome_name     = document.getElementById("genome2_assembly").value;
	const genome2_chromosome_name = document.getElementById("genome2_chromosome").value;
	const genome2_NtSize          = parseFloat(svg_canvas_width) / genome2_length;
	if(genome2_leftend < genome2_rightend){
		genome2 = new GenomeCoordinateInfo(genome2_leftend, genome2_rightend, genome2_length, genome2_center, genome2_genome_name, genome2_chromosome_name, genome2_NtSize)
	}

	const genome3_leftend         = parseInt(document.getElementById("genome3_begin").value.replace(/,/g, ''));
	const genome3_rightend        = parseInt(document.getElementById("genome3_end").value.replace(/,/g, ''));
	const genome3_length          = genome3_rightend - genome3_leftend;
	const genome3_center          = genome3_leftend + genome3_length / 2;
	const genome3_genome_name     = document.getElementById("genome3_assembly").value;
	const genome3_chromosome_name = document.getElementById("genome3_chromosome").value;
	const genome3_NtSize          = parseFloat(svg_canvas_width) / genome3_length;
	if(genome3_leftend < genome3_rightend){
		genome3 = new GenomeCoordinateInfo(genome3_leftend, genome3_rightend, genome3_length, genome3_center, genome3_genome_name, genome3_chromosome_name, genome3_NtSize)
	}

}


function reflectCoordinate(genomeID){
	let genome
	switch(genomeID){
		case 1: genome = genome1;break;
		case 2: genome = genome2;break;
		case 3: genome = genome3;break;
	}
	d3.select(`#genome${genomeID}_assembly`).property("value", genome.genome_name)
	d3.select(`#genome${genomeID}_chromosome`).property("value", genome.chromosome_name)
	d3.select(`#genome${genomeID}_begin`).property("value", genome.leftend.toLocaleString())
	d3.select(`#genome${genomeID}_end`)  .property("value", genome.rightend.toLocaleString())
}
reflectCoordinate(1)
reflectCoordinate(2)
reflectCoordinate(3)


function updateScreen(genomeID){
	if(genomeID === 1 || genomeID === 2){
		drawTitle(genomeID);
		drawMinimap(genomeID);
		drawAxis(genomeID);
		drawSequence(genomeID);
		drawSnp(genomeID);
		drawRepeat(genomeID);
		drawGene(genomeID);
		drawChainCovered(genomeID);
		//drawChain();
	}
}
d3.select(window)
.on("resize", function() {
	resizeGraphArea()
	d3.selectAll("svg").attr("width", svg_canvas_width);
});



function resizeGraphArea(){
	svg_canvas_width = window.innerWidth * 1;
	svg_canvas_height = Math.min(svg_canvas_width / aspect, 1500);
	if (svg_canvas_height >= 1200 && svg_canvas_height < 1500) {
		svg_canvas_height = 1200
	}
	if (svg_canvas_height >= 900 && svg_canvas_height < 1200) {
		svg_canvas_height = 1200
	}
	if (svg_canvas_height >= 600 && svg_canvas_height < 900) {
		svg_canvas_height = 900
	}
	if (svg_canvas_height < 900) {
		svg_canvas_height = 600
	}
	d3.selectAll(".svg").attr("width", svg_canvas_width).attr("height", svg_canvas_height);
}




function clickZoomInBtn(genomeID){
	updateRegionInfo();
	let genome;
	switch(genomeID){
		case 1: genome = genome1;break;
		case 2: genome = genome2;break;
		case 3: genome = genome3;break;
	}
	const new_leftend  = Math.round((genome.leftend  + genome.center)/4);
	const new_rightend = Math.round((genome.rightend + genome.center)/4);
	//document.getElementById(`genome${genomeID}_begin`).value = new_leftend.toLocaleString();
	//document.getElementById(`genome${genomeID}_end`).value   = new_rightend.toLocaleString();
	genome.leftend = new_leftend;
	genome.rightend = new_rightend;
	reflectCoordinate(genomeID);
	updateScreen(genomeID);
	drawChain();

}
function clickZoomOutBtn(genomeID){
	updateRegionInfo();
	let genome;
	switch(genomeID){
		case 1: genome = genome1;break;
		case 2: genome = genome2;break;
		case 3: genome = genome3;break;
	}
	const new_leftend  = 4 * genome.leftend  - genome.center;
	const new_rightend = 4 * genome.rightend - genome.center;
	//document.getElementById(`genome${genomeID}_begin`).value = new_leftend.toLocaleString();
	//document.getElementById(`genome${genomeID}_end`).value   = new_rightend.toLocaleString();
	genome.leftend  = new_leftend;
	genome.rightend = new_rightend;
	reflectCoordinate(genomeID);
	updateScreen(genomeID);
	drawChain();
}

function clickScrollBtn(genomeID, distance){
	updateRegionInfo();
	let genome;
	switch(genomeID){
		case 1: genome = genome1;break;
		case 2: genome = genome2;break;
		case 3: genome = genome3;break;
	}
	const current_leftend = genome.leftend
	const width = Math.round((genome.rightend - genome.center) * distance);
	const new_leftend  = genome.leftend  + width;
	const new_rightend = genome.rightend + width;
	genome.leftend = new_leftend;
	genome.rightend = new_rightend;
	reflectCoordinate(genomeID);
	updateScreen(genomeID);
	drawChain();

}
function clickJumpBtn(genomeID, region){}
function clickUpdateBtn(genomeID){
	updateRegionInfo();
	switch(genomeID){
		case 1: updateScreen(1);break;
		case 2: updateScreen(2);break;
		case 3: updateScreen(1); updateScreen(2);break;
	}
	drawChain();
}

function alignScale(){
	updateRegionInfo();
	document.getElementById("genome1_begin").value = genome3.leftend.toLocaleString();
	document.getElementById("genome1_end").value   = genome3.rightend.toLocaleString();
	document.getElementById("genome1_chromosome").value   = genome3.chromosome_name.toLocaleString();
	document.getElementById("genome2_begin").value = genome3.leftend.toLocaleString();
	document.getElementById("genome2_end").value   = genome3.rightend.toLocaleString();
	document.getElementById("genome2_chromosome").value   = genome3.chromosome_name.toLocaleString();
	updateRegionInfo();
	updateScreen(1);
	updateScreen(2);
}


function drawTitle(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_title_svg;
		genome = genome1;
	}else{
		canvas = genome2_title_svg;
		genome = genome2;
	}
	const text = genome.genome_name + ":" + genome.chromosome_name;

	canvas.text(text).attr("style", "text-align:center").style("font-family", "Montserrat");
}

async function drawMinimap(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_minimap_svg;
		genome = genome1;
	}else{
		canvas = genome2_minimap_svg;
		genome = genome2;
	}
	const query = `http://localhost:8000/?table=sequence&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=0&end=1`;
	const res = await fetch(query, {method: 'GET'});
	const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
	const chromosomeLength = parseInt(data[0])
	canvas.select("rect").remove();
	canvas.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", svg_canvas_width)
	.attr("height", 10)
	.attr("rx", 10)
	.attr("ry", 10)
	.attr("style", "fill: #696969;")

	const begin_map = svg_canvas_width * genome.leftend  / chromosomeLength;
	const end_map   = svg_canvas_width * genome.rightend / chromosomeLength;
	canvas.selectAll("polygon").remove();
	canvas.append("polygon")
	.attr("points", `${begin_map} 10, ${begin_map - 2} 20, ${begin_map + 2} 20`)
	canvas.append("polygon")
	.attr("points", `${end_map} 10, ${end_map - 2} 20, ${end_map + 2} 20`)
}

async function drawAxis(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_axis_svg;
		genome = genome1;
	}else{
		canvas = genome2_axis_svg;
		genome = genome2;
	}
	length = genome.length;

	let ticksize = Math.min(genome.length, 20);

	const xScale = d3.scaleLinear().domain([genome.leftend, genome.rightend]).range([0, svg_canvas_width]);
	canvas.select("g").remove();
	canvas.append("g")
	.attr("class", "x_axis")
	.call(d3.axisBottom(xScale).ticks(ticksize).tickFormat(d3.format("d")));
}

function drawOneCharacter(canvas, x, y, width, char){
	let backgroundColor;
	let textColor;
	if(char in color){
		backgroundColor = color[char][0];
		textColor = color[char][1];
	}else{
		backgroundColor = color["Other"][0];
		textColor = color["Other"][1];
	}

	canvas.append("rect")
	.attr("x", x)
	.attr("y", y - 10)
	.attr("width", width)
	.attr("height", 20)
	.attr("style", `fill:${backgroundColor}`);

	if(width > 15){
		canvas
		.append("text")
		.text(char)
		.attr("x", x + width / 2)
		.attr("y", y)
		.attr("width", width)
		.attr("height", 10)
		.style('fill', textColor)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
		.attr("font-family", "Share Tech Mono")
	}
}



async function drawSequence(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_sequence_svg;
		genome = genome1;
	}else{
		canvas = genome2_sequence_svg;
		genome = genome2;
	}
	canvas.selectAll("text").remove();
	canvas.selectAll("rect").remove();
	if(genome.length <= svg_canvas_width){
		const query = `http://localhost:8000/?table=sequence&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
		const res = await fetch(query, {method: 'GET'});
		const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
		const seq = data[1];
		const width = genome.NtSize;
		canvas.selectAll("text").remove();
		for(let i = 0; i < seq.length; i++){
			drawOneCharacter(canvas, i * width, 10, width, seq[i]);
		}
	}else{
		canvas
		.append("text")
		.text("Zoom to describe a sequence")
		.attr("x", svg_canvas_width / 2)
		.attr("y", 5)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
	}
}

function leftLinebreak(array, dy, x){
	let string = `<tspan x="${x}"></tspan>`;
	array.forEach((t, i) =>{
		string += `<tspan dy="${dy}" x=${x}>${t}</tspan>`;
	});
	return string;
}

function drawOneSNP(canvas, genome, snp, offset){
	assembly = snp[0]
	chr      = snp[1]
	position = (parseInt(snp[2]) - genome.leftend) * genome.NtSize;
	id       = snp[3]
	ref      = snp[4]
	alt      = snp[5]
	qual     = snp[6]
	filter   = snp[7]
	info     = snp[8].replaceAll(";", "<br>")


	let backgroundColor;
	let textColor;
	if(alt in color){
		backgroundColor = color[alt][0];
		textColor = color[alt][1];
	}else{
		backgroundColor = color["Other"][0];
		textColor = color["Other"][1];
	}
	const info_text = "<table>" + 
		`<tr><th>assembly  </th><th>${assembly } </th></tr>` +
		`<tr><th>chromosome</th><th>${chr      } </th></tr>` +
		`<tr><th>position  </th><th>${snp[2]   } </th></tr>` +
		`<tr><th>id        </th><th>${id       } </th></tr>` +
		`<tr><th>ref       </th><th>${ref      } </th></tr>` +
		`<tr><th>alt       </th><th>${alt      } </th></tr>` +
		`<tr><th>qual      </th><th>${qual     } </th></tr>` +
		`<tr><th>filter    </th><th>${filter   } </th></tr>` +
		`<tr><th>info      </th><th>${info     } </th></tr>` +
		"</table>"


	const offset_px = offset * 20;
	console.log(offset, offset_px)

	canvas.append("rect")
	.attr("x", position)
	.attr("y", 0 + offset_px)
	.attr("width", genome.NtSize)
	.attr("height", 20)
	.attr("style", `fill:${backgroundColor}`)
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	if(genome.NtSize > 15){
		canvas
		.append("text")
		.text(alt)
		.attr("x", position + genome.NtSize / 2)
		.attr("y", 10 + offset_px)
		.attr("width", genome.NtSize)
		.attr("height", 10)
		.style('fill', textColor)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
		.attr("font-family", "Share Tech Mono")
		.on("mouseover", function(d) {
			tooltip.style("visibility", "visible")
			.html(info_text)
			.style("left", d.screenX +  20 + "px")
			.style("top",  d.screenY - 100 + "px")
			.style("bottom", "auto")
		})
		.on("mouseout", function(d) {
			tooltip.style("visibility", "hidden");
		})
	}
}


async function drawSnp(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_snp_svg;
		genome = genome1;
	}else{
		canvas = genome2_snp_svg;
		genome = genome2;
	}
	canvas.selectAll("text").remove();
	canvas.selectAll("rect").remove();
	if(genome.length <= svg_canvas_width * 50){
		const query = `http://localhost:8000/?table=snp&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
		const res = await fetch(query, {method: 'GET'});
		const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
		let vis_index = Array(genome.rightend - genome.leftend)
		vis_index.fill(0)
		for(let i = 0; i < data.length; i++){
			currentSNP = data[i];
			const position = parseInt(currentSNP[2]);
			const id = currentSNP[3];
			const ref = currentSNP[4];
			const alt = currentSNP[5];
			const dx = position - genome.leftend;
			const width = genome.NtSize;
			//drawOneSNP(canvas, dx * width, 10, width, alt, currentSNP);
			console.log(data[i][2] - genome.leftend, vis_index[data[i][2] - genome.leftend])
			drawOneSNP(canvas, genome, data[i], vis_index[data[i][2] - genome.leftend]);
			vis_index[data[i][2] - genome.leftend]++;
		}

	}else{
		canvas
		.append("text")
		.text("Zoom to describe SNP/SNV")
		.attr("x", svg_canvas_width / 2)
		.attr("y", 5)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
	}
}


function drawOneRepeat(canvas, genome, repeat, showText){
	const repeat_begin  = (parseInt(repeat[2]) - genome.leftend) * genome.NtSize;
	const repeat_end    = (parseInt(repeat[3]) - genome.leftend) * genome.NtSize;
	const repeat_name   = repeat[4];
	const repeat_strand = repeat[6];
	const width = repeat_end - repeat_begin;
	const lineIndex = parseInt(repeat[7]) * 10;

	const length = parseInt(repeat[3]) - parseInt(repeat[2])
	const info_text = "<table>" + 
	`<tr><th>repeat name </th><th> ${repeat_name   } </th></tr> ` +
	`<tr><th>start       </th><th> ${repeat[2]     } </th></tr> ` +
	`<tr><th>end         </th><th> ${repeat[3]     } </th></tr> ` +
	`<tr><th>length      </th><th> ${length        } </th></tr> ` +
	`<tr><th>strand      </th><th> ${repeat_strand } </th></tr> ` +
	"</table>"



	let main_line = canvas
	.append("rect")
	.attr("x", repeat_begin)
	.attr("y", lineIndex)
	.attr("width", width)
	.attr("height", 5)
	.style("fill", "#4161e1")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	canvas
	.append("line")
	.attr("x1",repeat_begin)
	.attr("x2",repeat_begin)
	.attr("y1",lineIndex - 5)
	.attr("y2",lineIndex + 8)
	.attr("stroke-width", 1)
	.attr("stroke","#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})

	canvas
	.append("line")
	//.attr("id", name)
	.attr("x1",repeat_end)
	.attr("x2",repeat_end)
	.attr("y1",lineIndex - 5)
	.attr("y2",lineIndex + 8)
	.attr("stroke-width", 1)
	.attr("stroke","#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
}

async function drawRepeat(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_repeat_svg;
		genome = genome1;
	}else{
		canvas = genome2_repeat_svg;
		genome = genome2;
	}
	canvas.selectAll("text").remove();
	canvas.selectAll("rect").remove();
	canvas.selectAll("line").remove();
	const query = `http://localhost:8000/?table=repeat&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
	const res = await fetch(query, {method: 'GET'});
	const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
	const showFlag = data.length < 10
	for(let i = 0; i < data.length; i++){
		currentRepeat = data[i];
		//console.log(currentRepeat);
		//drawOneRepeat(canvas, repeat_begin, 10 * lineIndex, width, repeat_name, repeat_strand);
		drawOneRepeat(canvas, genome, currentRepeat, showFlag)
	}
}


function appendTextbox(text, classedAS, id, x, y){
	let tooltip = d3.select("body")
	.append("div")
	.classed(classedAS, true)
	.html(text)
	.style("visibility", "visible")
	.style("left", x + "px")
	.style("top",  y + "px")
	.style("bottom", "auto")
}


function drawOneTranscript(canvas, genome, transcript){
	//console.log(canvas, genome, transcript)
	const assembly           = transcript[0]
	const chr                = transcript[1]
	const start              = (parseInt(transcript[2]) - genome.leftend) * genome.NtSize;
	const end                = (parseInt(transcript[3]) - genome.leftend) * genome.NtSize;
	const gene_name          = transcript[4]
	const transcript_name    = transcript[5]
	const gene_id            = transcript[6]
	const transcript_id      = transcript[7]
	const gene_biotype       = transcript[8]
	const transcript_biotype = transcript[9]
	const exons_rawtext      = transcript[10]
	const vis_index          = parseInt(transcript[11])
	// parse exons
	const exons = exons_rawtext.split(":").map(x => x.split("-").map(x => (parseInt(x) - genome.leftend) * genome.NtSize))


	const info_text = "<table>" + 
		`<tr><th>assembly           </th><th> ${assembly                      } </th></tr>` +
		`<tr><th>chr                </th><th> ${chr                           } </th></tr>` +
		`<tr><th>start              </th><th> ${transcript[2]                 } </th></tr>` +
		`<tr><th>end                </th><th> ${transcript[3]                 } </th></tr>` +
		`<tr><th>length             </th><th> ${transcript[3] - transcript[2] } </th></tr>` +
		`<tr><th>gene_name          </th><th> ${gene_name                     } </th></tr>` +
		`<tr><th>transcript_name    </th><th> ${transcript_name               } </th></tr>` +
		`<tr><th>gene_id            </th><th> ${gene_id                       } </th></tr>` +
		`<tr><th>transcript_id      </th><th> ${transcript_id                 } </th></tr>` +
		`<tr><th>gene_biotype       </th><th> ${gene_biotype                  } </th></tr>` +
		`<tr><th>transcript_biotype </th><th> ${transcript_biotype            } </th></tr>` +
		"</table>"

	canvas
	.append("line")
	.attr("x1",start)
	.attr("x2",end)
	.attr("y1",vis_index * 15)
	.attr("y2",vis_index * 15)
	.attr("stroke-width", 2)
	.attr("stroke","#0e9aa7")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})

	for(let i = 0; i < exons.length; i++){
		exon_begin = exons[i][0]
		exon_end   = exons[i][1]
		canvas
		.append("rect")
		.attr("x", exon_begin)
		.attr("y", vis_index * 15 - 5)
		.attr("width", exon_end - exon_begin)
		.attr("height", 8)
		.style("fill", "#4161e1")
		.on("mouseover", function(d) {
			tooltip.style("visibility", "visible")
			.html(info_text)
			.style("left", d.screenX +  20 + "px")
			.style("top",  d.screenY - 100 + "px")
			.style("bottom", "auto")
		})
		.on("mouseout", function(d) {
			tooltip.style("visibility", "hidden");
		})
	}
}

async function drawGene(genomeID){
	let canvas;
	let genome;
	if(genomeID == 1){
		canvas = genome1_gene_svg;
		genome = genome1;
	}else{
		canvas = genome2_gene_svg;
		genome = genome2;
	}
	canvas.selectAll("text").remove();
	canvas.selectAll("rect").remove();
	canvas.selectAll("line").remove();
	d3.select("body").selectAll(".gene_tooltip").remove()

		const query = `http://localhost:8000/?table=transcript&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
		const res = await fetch(query, {method: 'GET'});
		const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
		//console.log(data.length);
		for(let i = 0; i < data.length; i++){
			currentTranscript = data[i];
			//console.log(currentTranscript);
			drawOneTranscript(canvas, genome, currentTranscript);
		}
}



function drawOneCoveredAsSourceRange(genomeID, chain){
	//covered as sourceで64,000個くらいオブジェクトを生成してるが、絶対そんなにいらない。
	let canvas
	let this_genome
	let opposite_genome
	if(genomeID == 1){
		canvas          = genome1_covered_as_source_svg;
		this_genome     = genome1
		opposite_genome = genome2
	}else{
		canvas          = genome2_covered_as_source_svg;
		this_genome     = genome2
		opposite_genome = genome1
	}
	const source_assembly   = chain[0]
	const source_chromosome = chain[1]
	const source_start      = (parseInt(chain[2]) - this_genome.leftend) * this_genome.NtSize;
	const source_end        = (parseInt(chain[3]) - this_genome.leftend) * this_genome.NtSize;
	const target_assembly   = chain[4]
	const target_chromosome = chain[5]
	const length            = chain[8]

	const info_text = "<table>" + 
		`<tr><th>source assembly  </th><th>${source_assembly}</th></tr>` +
		`<tr><th>source chromosome</th><th>${source_chromosome}</th></tr>` +
		`<tr><th>source start     </th><th>${parseInt(chain[2])}</th></tr>` +
		`<tr><th>source end       </th><th>${parseInt(chain[3])}</th></tr>` +
		`<tr><th>target assembly  </th><th>${target_assembly}</th></tr>` +
		`<tr><th>target chromosome</th><th>${target_chromosome}</th></tr>` +
		`<tr><th>target start     </th><th>${parseInt(chain[6])}</th></tr>` +
		`<tr><th>target end       </th><th>${parseInt(chain[7])}</th></tr>` +
		`<tr><th>length           </th><th>${length}</th></tr>` +
		"</table>"

	let offset = 0
	let color;//inter chainかintra chainかで色を分ける
	if(target_chromosome === opposite_genome.chromosome_name){
		color = "#ffb6c1"
	}else{
		color = "#da70d6"
		offset = 15
	}
	
	canvas
	.append("line")
	.attr("x1",source_start)
	.attr("x2",source_end)
	.attr("y1",5 + offset)
	.attr("y2",5 + offset)
	.attr("stroke-width", 10)
	.attr("stroke", color)
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)

	canvas.append("line")
	.attr("x1", source_start)
	.attr("x2", source_start)
	.attr("y1", 0  + offset)
	.attr("y2", 10 + offset)
	.attr("stroke-width", 1)
	.attr("stroke", "#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)


	canvas.append("line")
	.attr("x1", source_end)
	.attr("x2", source_end)
	.attr("y1", 0  + offset)
	.attr("y2", 10 + offset)
	.attr("stroke-width", 1)
	.attr("stroke", "#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)

}

function drawOneCoveredAsTargetRange(genomeID, chain){
	let canvas
	let this_genome
	let opposite_genome
	if(genomeID == 1){
		canvas          = genome1_covered_as_target_svg;
		this_genome     = genome1
		opposite_genome = genome2
	}else{
		canvas          = genome2_covered_as_target_svg;
		this_genome     = genome2
		opposite_genome = genome1
	}
	const source_assembly   = chain[0]
	const source_chromosome = chain[1]
	const source_start      = (parseInt(chain[2]) - this_genome.leftend) * this_genome.NtSize;
	const source_end        = (parseInt(chain[3]) - this_genome.leftend) * this_genome.NtSize;
	const target_assembly   = chain[4]
	const target_chromosome = chain[5]
	const target_start      = (parseInt(chain[6]) - this_genome.leftend) * this_genome.NtSize;
	const target_end        = (parseInt(chain[7]) - this_genome.leftend) * this_genome.NtSize;

	const length            = chain[8]

	const info_text = "<table>" + 
		`<tr><th>source assembly  </th><th>${source_assembly}</th></tr>` +
		`<tr><th>source chromosome</th><th>${source_chromosome}</th></tr>` +
		`<tr><th>source start     </th><th>${parseInt(chain[2])}</th></tr>` +
		`<tr><th>source end       </th><th>${parseInt(chain[3])}</th></tr>` +
		`<tr><th>target assembly  </th><th>${target_assembly}</th></tr>` +
		`<tr><th>target chromosome</th><th>${target_chromosome}</th></tr>` +
		`<tr><th>target start     </th><th>${parseInt(chain[6])}</th></tr>` +
		`<tr><th>target end       </th><th>${parseInt(chain[7])}</th></tr>` +
		`<tr><th>length           </th><th>${length}</th></tr>` +
		"</table>"


	let offset = 0
	let color;//inter chainかintra chainかで色を分ける
	if(source_chromosome === opposite_genome.chromosome_name){
		color = "#ffb6c1"
	}else{
		color = "#da70d6"
		offset = 15
	}
	
	canvas
	.append("line")
	.attr("x1",target_start)
	.attr("x2",target_end)
	.attr("y1",5 + offset)
	.attr("y2",5 + offset)
	.attr("stroke-width", 10)
	.attr("stroke", color)
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)

	canvas.append("line")
	.attr("x1", target_start)
	.attr("x2", target_start)
	.attr("y1", 0  + offset)
	.attr("y2", 10 + offset)
	.attr("stroke-width", 1)
	.attr("stroke", "#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)

	canvas.append("line")
	.attr("x1", target_end)
	.attr("x2", target_end)
	.attr("y1", 0  + offset)
	.attr("y2", 10 + offset)
	.attr("stroke-width", 1)
	.attr("stroke", "#dc143c")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)
}


async function drawChainCovered(genomeID){
	if(genomeID == 1){
		[genome1_covered_as_source_svg, genome1_covered_as_target_svg].map(function(x){
			x.selectAll("text").remove();
			x.selectAll("rect").remove();
			x.selectAll("line").remove();
		})
		d3.select("body").selectAll(".covered_range_tooltip").remove()
		//genome1 がsource
		//const covered_range_on_genome1_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}&source-start=${genome1.leftend}&source-end=${genome1.rightend}`;
		const covered_range_on_genome1_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}`;
		const covered_range_on_genome1_res   = await fetch(covered_range_on_genome1_query, {method: 'GET'});
		const covered_range_on_genome1_data  = await covered_range_on_genome1_res.json();
		for (let i = 0; i < covered_range_on_genome1_data.length; i++){
			//ここで全部描画するのが良くない。描画領域に合わせて描画するべき。
			let chain   = covered_range_on_genome1_data[i];
			const left  = parseInt(chain[2]);//座標, not pixcel
			const right = parseInt(chain[3]);//座標, not pixcel
			// left > genome1.rightend or right < canvas.leftendだったら描画しない。
			//console.log(left, genome1.leftend,left > genome1.leftend, right, genome1.rightend, right < genome1.rightend);
			if (left > genome1.rightend || right < genome1.leftend){
				//描画しない
			}else{
				drawOneCoveredAsSourceRange(1, covered_range_on_genome1_data[i]);

			}
		}
	}else{
		[genome2_covered_as_source_svg, genome2_covered_as_target_svg].map(function(x){
			x.selectAll("text").remove();
			x.selectAll("rect").remove();
			x.selectAll("line").remove();
		})
		//genome2 がtarget
		//const covered_range_on_genome2_query = `http://localhost:8000/?table=chain&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}&target-start=${genome2.leftend}&target-end=${genome2.rightend}`;
		const covered_range_on_genome2_query = `http://localhost:8000/?table=chain&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}`;
		const covered_range_on_genome2_res   = await fetch(covered_range_on_genome2_query, {method: 'GET'});
		const covered_range_on_genome2_data  = await covered_range_on_genome2_res.json();
		for (let i = 0; i < covered_range_on_genome2_data.length; i++){
			let chain   = covered_range_on_genome2_data[i];
			const left  = parseInt(chain[6]);
			const right = parseInt(chain[7]);
			if (left < genome2.rightend && right > genome2.leftend){
				drawOneCoveredAsTargetRange(2, covered_range_on_genome2_data[i])
			}
		}
	}
}

function drawOneChainRectangle(chain){
	//console.log(chain)
	const source_assembly   = chain[0]
	const source_chromosome = chain[1]
	const target_assembly   = chain[4]
	const target_chromosome = chain[5]


	let source_side_genome
	let target_side_genome
	if(genome1.genome_name == source_assembly){
		source_side_genome = genome1
		target_side_genome = genome2
	}else{
		source_side_genome = genome2
		target_side_genome = genome1
	}

	const source_start      = (parseInt(chain[2]) - source_side_genome.leftend) * source_side_genome.NtSize;
	const source_end        = (parseInt(chain[3]) - source_side_genome.leftend) * source_side_genome.NtSize;
	const target_start      = (parseInt(chain[6]) - target_side_genome.leftend) * target_side_genome.NtSize;
	const target_end        = (parseInt(chain[7]) - target_side_genome.leftend) * target_side_genome.NtSize;
	const length            = chain[8]
	const info_text = "<table>" + 
		`<tr><th>source assembly  </th><th>${source_assembly}</th></tr>` +
		`<tr><th>source chromosome</th><th>${source_chromosome}</th></tr>` +
		`<tr><th>source start     </th><th>${parseInt(chain[2])}</th></tr>` +
		`<tr><th>source end       </th><th>${parseInt(chain[3])}</th></tr>` +
		`<tr><th>target assembly  </th><th>${target_assembly}</th></tr>` +
		`<tr><th>target chromosome</th><th>${target_chromosome}</th></tr>` +
		`<tr><th>target start     </th><th>${parseInt(chain[6])}</th></tr>` +
		`<tr><th>target end       </th><th>${parseInt(chain[7])}</th></tr>` +
		`<tr><th>length           </th><th>${length}</th></tr>` +
		"</table>"


	let source_start_x, source_start_y
	let source_end_x,   source_end_y
	let target_start_x, target_start_y
	let target_end_x,   target_end_y

	if(genome1.genome_name == source_assembly){
		source_start_x = source_start
		source_start_y = 10
		source_end_x   = source_end
		source_end_y   = 10
		target_start_x = target_start
		target_start_y = 140
		target_end_x   = target_end
		target_end_y   = 140
	}else{
		source_start_x = source_start
		source_start_y = 140
		source_end_x   = source_end
		source_end_y   = 140
		target_start_x = target_start
		target_start_y = 10
		target_end_x   = target_end
		target_end_y   = 10
	}
	const points = `${source_start_x}, ${source_start_y} ${target_start_x}, ${target_start_y} ${target_end_x}, ${target_end_y} ${source_end_x}, ${source_end_y}`
	chain_svg.append("polygon")
	.attr("points", points)
	.attr("fill","#ffc0cb50")
	.attr("stroke-width", 1)
	.attr("stroke","#ff69b4")
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible")
		.html(info_text)
		.style("left", d.screenX +  20 + "px")
		.style("top",  d.screenY - 100 + "px")
		.style("bottom", "auto")
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
	.classed("covered_range_tooltip", true)
}


async function drawChain(){
	chain_svg.selectAll('polygon').remove();
	//const chain_rectangle_area_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}&source-start=${genome1.leftend}&source-end=${genome1.rightend}&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}&target-start=${genome2.leftend}&target-end=${genome2.rightend}`;
	const chain_rectangle_area_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}`;

	const chain_rectangle_area_res   = await fetch(chain_rectangle_area_query, {method: 'GET'});
	const chain_rectangle_area_data  = await chain_rectangle_area_res.json();
//	console.log(chain_rectangle_area_query)
	for(let i = 0; i < chain_rectangle_area_data.length; i++){
		drawOneChainRectangle(chain_rectangle_area_data[i])
	}

}




updateScreen(1);
updateScreen(2);
drawChain();