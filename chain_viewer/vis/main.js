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

let genome1_title_svg         = d3.select("#genome1_title").attr("width", svg_canvas_width);
let genome2_title_svg         = d3.select("#genome2_title").attr("width", svg_canvas_width);

let genome1_minimap_svg       = d3.select("#genome1_minimap").append("svg").attr("width", svg_canvas_width).attr("height", 30).attr("style", "background-color:#ffffff;");
let genome2_minimap_svg       = d3.select("#genome2_minimap").append("svg").attr("width", svg_canvas_width).attr("height", 30).attr("style", "background-color:#ffffff;");

let genome1_axis_svg          = d3.select("#genome1_axis").append("svg").attr("width", svg_canvas_width).attr("height", 20).attr("style", "background-color:#c6ffff;");
let genome2_axis_svg          = d3.select("#genome2_axis").append("svg").attr("width", svg_canvas_width).attr("height", 20).attr("style", "background-color:#ffffc6;");

let genome1_sequence_svg      = d3.select("#genome1_sequence").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);
let genome2_sequence_svg      = d3.select("#genome2_sequence").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);

let genome1_snp_svg           = d3.select("#genome1_snp").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);
let genome2_snp_svg           = d3.select("#genome2_snp").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);

let genome1_repeat_svg        = d3.select("#genome1_repeat").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);
let genome2_repeat_svg        = d3.select("#genome2_repeat").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);

let genome1_gene_svg          = d3.select("#genome1_gene").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);
let genome2_gene_svg          = d3.select("#genome2_gene").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width).attr("height", 500);

let genome1_chain_covered_svg = d3.select("#genome1_chain_covered").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);
let genome2_chain_covered_svg = d3.select("#genome2_chain_covered").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);

let chain_svg = d3.select("#chain").append("svg").attr("preserveAspectRatio", "xMidYMid").attr("width", svg_canvas_width);







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
let genome1;
let genome2;


function updateRegionInfo(){
	const genome1_leftend         = parseInt(document.getElementById("genome1_begin").value.replace(/,/g, ''));
	const genome1_rightend        = parseInt(document.getElementById("genome1_end").value.replace(/,/g, ''));
	const genome1_length          = genome1_rightend - genome1_leftend;
	const genome1_center          = genome1_leftend + genome1_length / 2;
	const genome1_genome_name     = document.getElementById("genome1_assembly").value;
	const genome1_chromosome_name = document.getElementById("genome1_chromosome").value;
	const genome1_NtSize          = parseFloat(svg_canvas_width) / genome1_length;
	genome1 = new GenomeCoordinateInfo(genome1_leftend, genome1_rightend, genome1_length, genome1_center, genome1_genome_name, genome1_chromosome_name, genome1_NtSize)

	const genome2_leftend         = parseInt(document.getElementById("genome2_begin").value.replace(/,/g, ''));
	const genome2_rightend        = parseInt(document.getElementById("genome2_end").value.replace(/,/g, ''));
	const genome2_length          = genome2_rightend - genome2_leftend;
	const genome2_center          = genome2_leftend + genome2_length / 2;
	const genome2_genome_name     = document.getElementById("genome2_assembly").value;
	const genome2_chromosome_name = document.getElementById("genome2_chromosome").value;
	const genome2_NtSize          = parseFloat(svg_canvas_width) / genome2_length;
	genome2 = new GenomeCoordinateInfo(genome2_leftend, genome2_rightend, genome2_length, genome2_center, genome2_genome_name, genome2_chromosome_name, genome2_NtSize)
}

function updateScreen(genomeID){
	updateRegionInfo(genomeID);
	//resizeGraphArea()
	drawTitle(genomeID);
	drawMinimap(genomeID);
	drawAxis(genomeID);
	drawSequence(genomeID);
	drawSnp(genomeID);
	drawRepeat(genomeID);
	drawGene(genomeID);

}
d3.select(window)
.on("resize", function() {
	resizeGraphArea()
	/*
	drawTitle(1);
	drawTitle(2);
	drawMinimap(1);
	drawMinimap(2);
	drawAxis(1);
	drawAxis(2);
	drawSequence(1);
	drawSequence(2);
	drawSnp(1);
	drawSnp(2);
	drawRepeat(1);
	drawRepeat(2);
	drawGene(1);
	drawGene(2);
	drawChain();
	*/
	d3.selectAll("svg").attr("width", svg_canvas_width);
});



function resizeGraphArea(){
	svg_canvas_width = window.innerWidth * 0.90;
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
	let genome;
	if(genomeID == 1){
		genome = genome1;
	}else{
		genome = genome2;
	}
	const new_leftend  = Math.round((genome.leftend  + genome.center)/2)
	const new_rightend = Math.round((genome.rightend + genome.center)/2)
	document.getElementById(`genome${genomeID}_begin`).value = new_leftend.toLocaleString();
	document.getElementById(`genome${genomeID}_end`).value   = new_rightend.toLocaleString();
	updateRegionInfo();
	updateScreen(genomeID);
	drawChain();

}
function clickZoomOutBtn(genomeID){
	let genome;
	if(genomeID == 1){
		genome = genome1;
	}else{
		genome = genome2;
	}
	const new_leftend  = 2 * genome.leftend - genome.center
	const new_rightend = 2 * genome.rightend - genome.center
	document.getElementById(`genome${genomeID}_begin`).value = new_leftend.toLocaleString();
	document.getElementById(`genome${genomeID}_end`).value   = new_rightend.toLocaleString();
	updateRegionInfo();
	updateScreen(genomeID);
	drawChain();
}

function clickScrollBtn(genomeID, distance){
	let genome;
	if(genomeID == 1){
		genome = genome1;
	}else{
		genome = genome2;
	}
	const width = Math.round((genome.rightend - genome.center) * distance);
	const new_leftend  = genome.leftend  + width;
	const new_rightend = genome.rightend + width;
	document.getElementById(`genome${genomeID}_begin`).value = new_leftend.toLocaleString();
	document.getElementById(`genome${genomeID}_end`).value   = new_rightend.toLocaleString();
	updateRegionInfo();
	updateScreen(genomeID);
	drawChain();

}
function clickJumpBtn(genomeID, region){}
function clickUpdateBtn(genomeID){
	updateScreen(genomeID);
	drawChain();
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

function drawOneSNP(canvas, x, y, width, char, data){
	let backgroundColor;
	let textColor;
	if(char in color){
		backgroundColor = color[char][0];
		textColor = color[char][1];
	}else{
		backgroundColor = color["Other"][0];
		textColor = color["Other"][1];
	}
	const info_text = leftLinebreak(data[8].split(";"), 10, x)
	let tooltip = canvas
	.append("text")
	.attr("x", x)
	.attr("y", y + 20)
	.style("font-size", 10)
	.style("visibility", "hidden")
	.html(info_text)

	canvas.append("rect")
	.attr("x", x)
	.attr("y", y - 10)
	.attr("width", width)
	.attr("height", 20)
	.attr("style", `fill:${backgroundColor}`)
	.on("mouseover", function(d) {
		tooltip.style("visibility", "visible");
	})
	.on("mouseout", function(d) {
		tooltip.style("visibility", "hidden");
	})
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
		.on("mouseover", function(d) {
			tooltip.style("visibility", "visible");
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
		for(let i = 0; i < data.length; i++){
			currentSNP = data[i];
			const position = parseInt(currentSNP[2]);
			const id = currentSNP[3];
			const ref = currentSNP[4];
			const alt = currentSNP[5];
			const dx = position - genome.leftend;
			const width = genome.NtSize;
			drawOneSNP(canvas, dx * width, 10, width, alt, currentSNP);
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
	const repeat_strand = repeat[5];
	const width = repeat_end - repeat_begin;
	const lineIndex = parseInt(repeat[7]) * 10;
	const info_text = repeat_name

	let tooltip = canvas
	.append("text")
	.attr("x", repeat_begin)
	.attr("y", lineIndex + 2)
	.attr("width", width)
	.attr("height", 3)
	.style("visibility", "hidden")
	.style("background-color", "orange")
	.html(info_text)

	let main_line = canvas
	.append("rect")
	.attr("x", repeat_begin)
	.attr("y", lineIndex)
	.attr("width", width)
	.attr("height", 5)
	.style("fill", "#4161e1")
	if(showText != true){
		main_line
		.on("mouseover", function(d) {
			let x = d3.pointer(d)[0];
			tooltip.style("visibility", "visible")
			.attr("x", x)
			.attr("y", lineIndex)
			console.log(x)
		})
		.on("mouseout", function(d) {
			tooltip.style("visibility", "hidden");
		})
	}
	canvas
	.append("line")
	.attr("x1",repeat_begin)
	.attr("x2",repeat_begin)
	.attr("y1",lineIndex - 5)
	.attr("y2",lineIndex + 8)
	.attr("stroke-width", 1)
	.attr("stroke","#dc143c");

	canvas
	.append("line")
	//.attr("id", name)
	.attr("x1",repeat_end)
	.attr("x2",repeat_end)
	.attr("y1",lineIndex - 5)
	.attr("y2",lineIndex + 8)
	.attr("stroke-width", 1)
	.attr("stroke","#dc143c");

	if(showText == true){
		canvas
		.append("text")
		.text(repeat_name)
		.attr("x", repeat_begin + width / 2)
		.attr("y", lineIndex + 20)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central");
	}
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
	if(genome.length <= svg_canvas_width * 50){
		const query = `http://localhost:8000/?table=repeat&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
		const res = await fetch(query, {method: 'GET'});
		const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
		const showFlag = data.length < 10
		console.log(showFlag)
		for(let i = 0; i < data.length; i++){
			currentRepeat = data[i];
			//console.log(currentRepeat);
			//drawOneRepeat(canvas, repeat_begin, 10 * lineIndex, width, repeat_name, repeat_strand);
			drawOneRepeat(canvas, genome, currentRepeat, showFlag)
		}

	}else{
		canvas
		.append("text")
		.text("Zoom to describe Repeat")
		.attr("x", svg_canvas_width / 2)
		.attr("y", 5)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
	}
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

	const info_text = [gene_id, gene_name, gene_biotype, transcript_id, transcript_name, transcript_biotype].join("<br>")


	let tooltip = d3.select("body")
	.append("div")
	.classed("gene_tooltip", true)
	.html(info_text)


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
		.style("left", d.screenX + 20  + "px")
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

	if(genome.length <= svg_canvas_width * 50){
		const query = `http://localhost:8000/?table=transcript&assembly=${genome.genome_name}&chr=${genome.chromosome_name}&start=${genome.leftend}&end=${genome.rightend}`;
		const res = await fetch(query, {method: 'GET'});
		const data = await res.json();//.then(response => response.json()).then(data => {return data.length}).catch((err) => {console.log(err)});
		//console.log(data.length);
		for(let i = 0; i < data.length; i++){
			currentTranscript = data[i];
			//console.log(currentTranscript);
			drawOneTranscript(canvas, genome, currentTranscript);
		}

	}else{
		canvas
		.append("text")
		.text("Zoom to describe Transcript")
		.attr("x", svg_canvas_width / 2)
		.attr("y", 5)
		.attr("text-anchor", "middle")
		.attr("dominant-baseline", "central")
	}
}

async function drawChain(){
/*
	chain_svg
	genome1_chain_covered_svg
	genome2_chain_covered_svg
	http://localhost:8000/?table=chain&source-assembly=GRCh38&source-chromosome=chr1&source-start=0&source-end=24000000
	*/
	const covered_range_on_genome1_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}&source-start=${genome1.leftend}&source-end=${genome1.rightend}`;
	const covered_range_on_genome1_res   = await fetch(covered_range_on_genome1_query, {method: 'GET'});
	const covered_range_on_genome1_data  = await covered_range_on_genome1_res.json();

	const covered_range_on_genome2_query = `http://localhost:8000/?table=chain&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}&target-start=${genome2.leftend}&target-end=${genome2.rightend}`;
	const covered_range_on_genome2_res   = await fetch(covered_range_on_genome2_query, {method: 'GET'});
	const covered_range_on_genome2_data  = await covered_range_on_genome2_res.json();

	const chain_rectangle_area_query = `http://localhost:8000/?table=chain&source-assembly=${genome1.genome_name}&source-chromosome=${genome1.chromosome_name}&source-start=${genome1.leftend}&source-end=${genome1.rightend}&target-assembly=${genome2.genome_name}&target-chromosome=${genome2.chromosome_name}&target-start=${genome2.leftend}&target-end=${genome2.rightend}`;
	const chain_rectangle_area_res   = await fetch(chain_rectangle_area_query, {method: 'GET'});
	const chain_rectangle_area_data  = await chain_rectangle_area_res.json();




}




updateScreen(1);
updateScreen(2);
drawChain();