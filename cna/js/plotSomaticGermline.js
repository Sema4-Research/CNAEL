function plotRocSomaticGermlineData(chromStartLocation, chromEndLocation, germlineSomaticdata, height, chrom,datatype) {
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
	if(datatype == "somatic") backgroundColor = "rgba(80, 148, 78, 0.09)"; //change color ÷
	else backgroundColor = "rgba(80, 148, 78, 0.09)"; //136, 152, 242
	var y1axisHeight = height;
	xSomatic = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	ySomatic = d3.scaleLinear().range([40, 0]).domain([0, 100]); //[0, d3.max(data, function(d) { return d[1]; })]); //somatic ∆
	cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")").call(d3.axisLeft(ySomatic).ticks(3)).append("g");
	var somatic_1 = germlineSomaticdata.filter((v,i,a)=>a.findIndex(t=>(t.Gene === v.Gene))===i);
	
	if(chrom != -1) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == chrom
		});
	} else somatic_1 = germlineSomaticdata;
	if(chrom == -1) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
	///////////////////////////////
	var selections = cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")")
	.selectAll("rocbackground").data(somatic_1)
	.enter().append('path')
	.attr('d', function(d) {
		if(chrom == -1){
			var xstart = xSomatic(d.segWL);
			if (xstart < 0){
				xstart = 0;
			}
				var xend = xSomatic(d.segWR);
				var ystart = -2;
				var yend = 42;
				// added by jinmou, this is a rec
				return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

			//p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}
		else {
			var xstart = xSomatic(d.segL);
			if (xstart < 0){
				xstart = 0;
			}
			var xend = xSomatic(d.segR);
			var ystart = -2;
			var yend = 42;
			return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

		}

		//return p[1] ;
	}).attr("class", "rocbackground")
	.style("fill", function(d){
        if (d.reported == "0") {
            return "rgb(137, 215, 246)";
        } else if (d.reported == "1") {
            return "rgb(184, 225, 167)";
        } else {
            return "rgb(247, 202, 202)";            
        }
		// if (d.TSG_OG.includes('OG')) {
		// 	// console.log(d.TSG_OG + '=>OG');
		// 	return "rgb(247, 202, 202)";
		// } else if (d.TSG_OG == 'TSG') {
		// 	// console.log(d.TSG_OG + '=>TSG');
		// 	return "rgb(189, 228, 223)";
		// } else if (d.TSG_OG == 'Fusion') {
		// 	// console.log(d.TSG_OG + '=>Fusion');
		// 	return "rgb(215, 219, 232)";
		// } else {
		// 	return "rgba(119, 72, 212, 0.3)"; // red
		// }
	});
}

function plotRocSomaticGermlineDataV1(chrom, chromStartLocation, chromEndLocation, germlineSomaticdata, height, datatype) {
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
  let svgContainer = gSvgContainerTbl['germline_container']
	if(datatype == "somatic") {
    backgroundColor = "rgba(80, 148, 78, 0.09)"; //change color ÷
    svgContainer = gSvgContainerTbl['somatic_container'];
  } 
	else backgroundColor = "rgba(80, 148, 78, 0.09)"; //136, 152, 242
	var y1axisHeight = height;
	xSomatic = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	ySomatic = d3.scaleLinear().range([40, 0]).domain([0, 100]); //[0, d3.max(data, function(d) { return d[1]; })]); //somatic ∆
	// svgContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).call(d3.axisLeft(ySomatic).ticks(3)).append("g");
	var somatic_1 = germlineSomaticdata.filter((v,i,a)=>a.findIndex(t=>(t.Gene === v.Gene))===i);
	
	if(chrom != -1) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == chrom
		});
	} else somatic_1 = germlineSomaticdata;
	if(chrom == -1) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
	///////////////////////////////
	var selections = svgContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`)
	.selectAll("rocbackground").data(somatic_1)
	.enter().append('path')
	.attr('d', function(d) {
		if(chrom == -1){
			var xstart = xSomatic(d.segWL);
			if (xstart < 0){
				xstart = 0;
			}
				var xend = xSomatic(d.segWR);
				var ystart = -2;
				var yend = 42;
				// added by jinmou, this is a rec
				return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

			//p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}
		else {
			var xstart = xSomatic(d.segL);
			if (xstart < 0){
				xstart = 0;
			}
			var xend = xSomatic(d.segR);
			var ystart = -2;
			var yend = 42;
			return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

		}

		//return p[1] ;
	}).attr("class", "rocbackground")
	.style("fill", function(d){
        if (d.reported == "0") {
            return "rgb(137, 215, 246)";
        } else if (d.reported == "1") {
            return "rgb(184, 225, 167)";
        } else {
            return "rgb(247, 202, 202)";            
        }
		// if (d.TSG_OG.includes('OG')) {
		// 	// console.log(d.TSG_OG + '=>OG');
		// 	return "rgb(247, 202, 202)";
		// } else if (d.TSG_OG == 'TSG') {
		// 	// console.log(d.TSG_OG + '=>TSG');
		// 	return "rgb(189, 228, 223)";
		// } else if (d.TSG_OG == 'Fusion') {
		// 	// console.log(d.TSG_OG + '=>Fusion');
		// 	return "rgb(215, 219, 232)";
		// } else {
		// 	return "rgba(119, 72, 212, 0.3)"; // red
		// }
	});
}


function plotSomaticData(chromStartLocation, chromEndLocation, germlineSomaticdata, height, chrom,datatype) {
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
	if(datatype == "germline") backgroundColor = "rgba(93, 157, 131)"; //change color ÷
	else backgroundColor = "rgba(86, 94, 209)";
	var y1axisHeight = height;
	xSomatic = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	ySomatic = d3.scaleLinear().range([40, 0]).domain([0, 100]); //[0, d3.max(data, function(d) { return d[1]; })]); //somatic ∆
	cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")").call(d3.axisLeft(ySomatic).ticks(3)).append("g");
	var somatic_1;
	if(chrom != -1) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == chrom
		});
	} else somatic_1 = germlineSomaticdata;
	if(chrom == -1) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
	///////////////////////////////
	var selections = cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")").selectAll("somaticcircle").data(somatic_1).enter().append('circle').attr('d', function(d) {
		//return p[1] ;
	}).attr("class", "somaticcircle").attr("cx", function(d) {
		if(chrom == -1) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);				
		return p[1]
	}).attr("cy", function(d) {
		if(chrom == -1) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		if(datatype == "germline") p[3]=p[3]/15;
		
		return ySomatic(d["AF"]);
	}).attr("r", 2).attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).style("fill", function(d){
		if (d.pathogenicity_nm.includes('PATHOGENIC')) {
			// console.log(d.TSG_OG + '=>OG');
			return "rgb(236, 0, 0)";
		} else if (d.pathogenicity_nm.includes('VOUS')) {
			// console.log(d.TSG_OG + '=>TSG');
			return "rgb(255, 103, 0)";
		} else if (d.pathogenicity_nm.includes('BENIGN')) {
			// console.log(d.TSG_OG + '=>Fusion');
			return "rgb(78, 226, 78)";
		} else {			
			return backgroundColor;
		}
	});
    if(datatype == "germline") {
        attachGermlineToolTip(selections);
    } else {
        attachSomaticToolTip(selections)
    }
}

function plotSomaticDataV1(chrom, chromStartLocation, chromEndLocation, germlineSomaticdata, height, datatype) {
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
  let svgContainer = gSvgContainerTbl['somatic_container']
	if(datatype == "germline") {
    backgroundColor = "rgba(93, 157, 131)"; //change color ÷
    svgContainer = gSvgContainerTbl['germline_container']
  }
	else backgroundColor = "rgba(86, 94, 209)";
	var y1axisHeight = height;
	xSomatic = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	ySomatic = d3.scaleLinear().range([40, 0]).domain([0, 100]); //[0, d3.max(data, function(d) { return d[1]; })]); //somatic ∆
	svgContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).call(d3.axisLeft(ySomatic).ticks(3)).append("g");
	var somatic_1;
	if(chrom != -1) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == chrom
		});
	} else somatic_1 = germlineSomaticdata;
	if(chrom == -1) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
	///////////////////////////////
	var selections = svgContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).selectAll("somaticcircle").data(somatic_1).enter().append('circle').attr('d', function(d) {
		//return p[1] ;
	}).attr("class", "somaticcircle").attr("cx", function(d) {
		if(chrom == -1) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);				
		return p[1]
	}).attr("cy", function(d) {
		if(chrom == -1) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		if(datatype == "germline") p[3]=p[3]/15;
		
		return ySomatic(d["AF"]);
	}).attr("r", 2).attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).style("fill", function(d){
		if (d.pathogenicity_nm.includes('PATHOGENIC')) {
			// console.log(d.TSG_OG + '=>OG');
			return "rgb(236, 0, 0)";
		} else if (d.pathogenicity_nm.includes('VOUS')) {
			// console.log(d.TSG_OG + '=>TSG');
			return "rgb(255, 103, 0)";
		} else if (d.pathogenicity_nm.includes('BENIGN')) {
			// console.log(d.TSG_OG + '=>Fusion');
			return "rgb(78, 226, 78)";
		} else {			
			return backgroundColor;
		}
	});
    if(datatype == "germline") {
        attachGermlineToolTip(selections);
    } else {
        attachSomaticToolTip(selections)
    }
}


function plotAxisForSomatic(id, yscale, yPosition, ticks = 3)
{  
  let spec = gSvgContainerSpecs[id];
  d3.select(`#${id}_tick`).remove();
  d3.select(`#${id}_grid`).remove();
  d3.select(`#${id}_legend1`).remove();
  gBackgroundContainer.append("g").attr("id", `${id}_tick`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`)
		.call(d3.axisLeft(yscale).ticks(spec.ticks));
  gBackgroundContainer.append("g").attr("id", `${id}_grid`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`).attr("class", "grid")
  .call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
  gBackgroundContainer.append('g').attr("id", `${id}_legend1`).attr('transform', `translate(${gLayout.leftReserve - 28}, ${yPosition + 20})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Somatic');  
}


function plotAxisSomaticGermline(id, yscale, yPosition, leg1)
{  
  d3.selectAll(`#${id}_axis`).remove();
  let spec = gSvgContainerSpecs[id];
  let container = gBackgroundContainer.append("g").attr("id", `${id}_axis`).attr("transform", `translate(0, ${yPosition})`);
  container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).attr("class", "grid").call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
	container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).call(d3.axisLeft(yscale).ticks(spec.ticks));  
  if (leg1) {    
    container.append('g').attr('transform', `translate(${gLayout.leftReserve - 28}, 20)`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text(leg1);  
  }
}

function prepareSomaticData() {
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let germlineSomaticdata = gsomaticData;

	let somatic_1;
	if(showChromonly) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == defaultChromNum
		});
	} else somatic_1 = germlineSomaticdata;

	if(!showChromonly) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
  return somatic_1;
}

function prepareRocSomaticData() {
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let germlineSomaticdata = gsomaticData;
	let somatic_1 = germlineSomaticdata.filter((v,i,a)=>a.findIndex(t=>(t.Gene === v.Gene))===i);
	if(showChromonly) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == defaultChromNum
		});
	} else somatic_1 = germlineSomaticdata;
	if(!showChromonly) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
  return somatic_1;
}

function drawRocSomatic() {
  let container = gSvgContainerTbl['somatic_container'];  
  let xSomatic = dragHelper.pathScale;
	let somatic_1 = prepareRocSomaticData();
  
  container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`)
	.selectAll("rocbackground").data(somatic_1)
	.enter().append('path')
	.attr('d', function(d) {
		if(!showChromonly){
			var xstart = xSomatic(d.segWL);
			if (xstart < 0){
				xstart = 0;
			}
				var xend = xSomatic(d.segWR);
				var ystart = -2;
				var yend = 42;
				// added by jinmou, this is a rec
				return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

			//p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}
		else {
			var xstart = xSomatic(d.segL);
			if (xstart < 0){
				xstart = 0;
			}
			var xend = xSomatic(d.segR);
			var ystart = -2;
			var yend = 42;
			return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;
		}
		//return p[1] ;
	}).attr("class", "rocbackground")
	.style("fill", function(d){
      if (d.reported == "0") {
          return "rgb(137, 215, 246)";
      } else if (d.reported == "1") {
          return "rgb(184, 225, 167)";
      } else {
          return "rgb(247, 202, 202)";            
      }
	});
}

function drawSomatic() {
  let spec = gSvgContainerSpecs['somatic_container'];
  if (!spec.visible) {
    return;
  }
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let datatype = 'somatic'

  let container = gSvgContainerTbl['somatic_container'];
  let backgroundColor = "rgba(86, 94, 209)";  
  container.selectAll("*").remove();

	let xSomatic = dragHelper.pathScale;
	let ySomatic = d3.scaleLinear().range([spec.height, 0]).domain([0, 100]);
  // plotAxisSomaticGermline('somatic_container', ySomatic, Number(container.attr("y")), "Somatic")
  plotAxisNew('somatic_container', ySomatic, spec.height / 2, '', "Somatic")
  // plotAxisForSomatic('somatic_container', ySomatic, Number(container.attr("y")));
	let somatic_1 = prepareSomaticData();
  drawRocSomatic();
	///////////////////////////////
	let selections = container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).selectAll("somaticcircle").data(somatic_1).enter().append('circle').attr('d', function(d) {
		//return p[1] ;
	}).attr("class", "somaticcircle").attr("cx", function(d) {
		if(!showChromonly) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);				
		return p[1]
	}).attr("cy", function(d) {
		if(!showChromonly) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		if(datatype == "germline") p[3]=p[3]/15;
		
		return ySomatic(d["AF"]);
	}).attr("r", 2).attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).style("fill", function(d){
		if (d.pathogenicity_nm.includes('PATHOGENIC')) {
			// console.log(d.TSG_OG + '=>OG');
			return "rgb(236, 0, 0)";
		} else if (d.pathogenicity_nm.includes('VOUS')) {
			// console.log(d.TSG_OG + '=>TSG');
			return "rgb(255, 103, 0)";
		} else if (d.pathogenicity_nm.includes('BENIGN')) {
			// console.log(d.TSG_OG + '=>Fusion');
			return "rgb(78, 226, 78)";
		} else {			
			return backgroundColor;
		}
	});
    if(datatype == "germline") {
        attachGermlineToolTip(selections);
    } else {
        attachSomaticToolTip(selections)
    }

    
}

// germline
function plotAxisForGermline(id, yscale, yPosition, ticks = 3)
{  
  let spec = gSvgContainerSpecs[id];
  d3.select(`#${id}_tick`).remove();
  d3.select(`#${id}_grid`).remove();
  d3.select(`#${id}_legend1`).remove();
  gBackgroundContainer.append("g").attr("id", `${id}_tick`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`)
		.call(d3.axisLeft(yscale).ticks(spec.ticks));
  gBackgroundContainer.append("g").attr("id", `${id}_grid`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`).attr("class", "grid")
    .call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
  gBackgroundContainer.append('g').attr("id", `${id}_legend1`).attr('transform', `translate(${gLayout.leftReserve - 28}, ${yPosition + 20})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Germline');
}

function prepareGermlineData() {
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let germlineSomaticdata = ggermlineData;

	let somatic_1;
	if(showChromonly) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == defaultChromNum
		});
	} else somatic_1 = germlineSomaticdata;

	if(!showChromonly) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
  return somatic_1;
}

function prepareRocGermlineData() {
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let germlineSomaticdata = ggermlineData;

	let somatic_1 = germlineSomaticdata.filter((v,i,a)=>a.findIndex(t=>(t.Gene === v.Gene))===i);
	if(showChromonly) {
		somatic_1 = germlineSomaticdata.filter(function(o) {
			return o["chrom"].replace("chr", "") == defaultChromNum
		});
	} else somatic_1 = germlineSomaticdata;
	if(!showChromonly) somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.gPOS) >= Number(chromStartLocation) && Number(o.gPOS) <= Number(chromEndLocation));
	});
	else somatic_1 = somatic_1.filter(function(o) {
		return(Number(o.pos) >= Number(chromStartLocation) && Number(o.pos) <= Number(chromEndLocation));
	});
  return somatic_1;
}

function drawRocGermline() {
  let container = gSvgContainerTbl['germline_container'];  
  let xSomatic = dragHelper.pathScale;
	let somatic_1 = prepareRocGermlineData();
  
  container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`)
	.selectAll("rocbackground").data(somatic_1)
	.enter().append('path')
	.attr('d', function(d) {
		if(!showChromonly){
			var xstart = xSomatic(d.segWL);
			if (xstart < 0){
				xstart = 0;
			}
				var xend = xSomatic(d.segWR);
				var ystart = -2;
				var yend = 42;
				// added by jinmou, this is a rec
				return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

			//p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}
		else {
			var xstart = xSomatic(d.segL);
			if (xstart < 0){
				xstart = 0;
			}
			var xend = xSomatic(d.segR);
			var ystart = -2;
			var yend = 42;
			return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;
		}
		//return p[1] ;
	}).attr("class", "rocbackground")
	.style("fill", function(d){
      if (d.reported == "0") {
          return "rgb(137, 215, 246)";
      } else if (d.reported == "1") {
          return "rgb(184, 225, 167)";
      } else {
          return "rgb(247, 202, 202)";            
      }
	});
}

function drawGermline() {
  let spec = gSvgContainerSpecs['germline_container'];
  if (!spec.visible) {
    return;
  }
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let datatype = 'germline'

  let container = gSvgContainerTbl['germline_container'];
  let backgroundColor = "rgba(93, 157, 131)";
  container.selectAll("*").remove();

	let xSomatic = dragHelper.pathScale;
	let ySomatic = d3.scaleLinear().range([spec.height, 0]).domain([0, 100]);
  // plotAxisForGermline('germline_container', ySomatic, Number(container.attr("y")));
  // plotAxisSomaticGermline('germline_container', ySomatic, Number(container.attr("y")), "Germline")
  plotAxisNew('germline_container', ySomatic, spec.height / 2, '', "Germline");
	let somatic_1 = prepareGermlineData();
  drawRocGermline();
	///////////////////////////////
	let selections = container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).selectAll("somaticcircle").data(somatic_1).enter().append('circle').attr('d', function(d) {
		//return p[1] ;
	}).attr("class", "somaticcircle").attr("cx", function(d) {
		if(!showChromonly) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);				
		return p[1]
	}).attr("cy", function(d) {
		if(!showChromonly) p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		if(datatype == "germline") p[3]=p[3]/15;
		
		return ySomatic(d["AF"]);
	}).attr("r", 2).attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).style("fill", function(d){
		if (d.pathogenicity_nm.includes('PATHOGENIC')) {
			// console.log(d.TSG_OG + '=>OG');
			return "rgb(236, 0, 0)";
		} else if (d.pathogenicity_nm.includes('VOUS')) {
			// console.log(d.TSG_OG + '=>TSG');
			return "rgb(255, 103, 0)";
		} else if (d.pathogenicity_nm.includes('BENIGN')) {
			// console.log(d.TSG_OG + '=>Fusion');
			return "rgb(78, 226, 78)";
		} else {			
			return backgroundColor;
		}
	});
    if(datatype == "germline") {
        attachGermlineToolTip(selections);
    } else {
        attachSomaticToolTip(selections)
    }    
}

