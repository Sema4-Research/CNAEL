
function plotRocRNAData(chromStartLocation, chromEndLocation, germlineSomaticdata, height, chrom,datatype) {
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
	if(datatype == "somatic") backgroundColor = "rgba(100, 161, 63, 0.1)"; //change color ÷
	else backgroundColor = "rgba(100, 161, 63, 0.1)"; //136, 152, 242
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
	var selections = cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")")
	.selectAll("rocrnabackground").data(somatic_1)
	.enter().append('path')
	.attr('d', function(d) {
		if(chrom == -1){
			var xstart = xSomatic(d.gPOS);
				var xend = xSomatic(d.gPOS + 100000000);
				var ystart = 0;
				var yend = 40;
				return " M " + xstart + " " + ystart + " L " + xend + " " + ystart + " L " + xend + " " + yend + " L " + xstart + " " + yend + " L " + xstart + " " + ystart;

			//p = constructPixelPositionByAxis(d.gPOS, d.gPOS, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}
		else {
			p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d["AF"], xSomatic, ySomatic);
		}

		//return p[1] ;
	}).attr("class", "rocrnabackground")
	.style("fill", backgroundColor);
}

function plotRNAData(chromStartLocation, chromEndLocation, cnvUnique, height, chrom){
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
	var y1axisHeight = height;
	xRNA = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	var maxRankInSample = d3.max(grnaData, function(d) {return Number(d['logTPM']);});
    var minHeightVal = Math.floor(d3.min(grnaData, function(d) {return Number(d['logTPM']);}));
    console.log(minHeightVal)
    maxRankInSample = Math.max(maxRankInSample, 1);
    minHeightVal = Math.min(minHeightVal, 0);

	yRNA = d3.scaleLinear().range([40, 0]).domain([minHeightVal, maxRankInSample]); ///[0, d3.max(data, function(d) { return d[1]; })]); //plot RNA ∆
	cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")").call(d3.axisLeft(yRNA).ticks(3)).append("g");
	////////////////////////
	var cloneWholegenomgrnaData = JSON.parse(JSON.stringify(grnaData)); //Object.assign({}, chrs);
	
	var wholegenomgrnaData_1;
	
	if(chrom != -1) wholegenomgrnaData_1 = cloneWholegenomgrnaData.filter(function(o) {
		return o.chrom == chrom
	});
	
	else wholegenomgrnaData_1 = cloneWholegenomgrnaData;
	
	if(chrom == -1) {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segWR) <= Number(chromEndLocation)) && (Number(o.segWL) >= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromStartLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromEndLocation)));
		});
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) o.segWL = o.segWL <= chromStartLocation ? chromStartLocation : o.segWL;
			if(index == (arr.length - 1)) o.segWR = o.segWR >= chromEndLocation ? chromEndLocation : o.segWR;
			return o;
		});
	} else {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segR) <= Number(chromEndLocation)) && (Number(o.segL) >= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromStartLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromEndLocation)));
		})
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) {
				if(o.segL <= chromStartLocation) o.segL = chromStartLocation;
			}
			if(index == (arr.length - 1)) {
			    if(o.segR > chromEndLocation) o.segR = chromEndLocation;
				
			}
			return o;
		});
	}
	var selections = cytoBandContainer.append("g").attr("transform", "translate(0," + y1axisHeight + ")").selectAll("path.rnaseg").data(wholegenomgrnaData_1).enter().append('path').attr('d', function(d) {		
		var h = yRNA(d["logTPM"]);
		var a,b;
		if(chrom != -1) {
		   a=xRNA(d["segL"]);
		   b=xRNA(d["segR"]);		
		}
		else{
		   a=xRNA(d["segWL"]);
		   b=xRNA(d["segWR"]);
		   b= (b-a)<1?(b+1):b;		
		}
		var p1 = " M " + a + " " + h + " L " + b + " " + h ;
		
		return p1;
	}).attr("stroke-width", 3).attr("fill", "black").attr("class", "rnaseg").attr("segmentation", d => {
		return JSON.stringify(d);
	}).attr("stroke", "rgb(50, 48, 145)"); //change color÷
	//selections.lower();
	// attachSomaticToolTip(selections);
	// attachGermlineToolTip(selections);
	attachRnaToolTip(selections);
}

function plotRNADataV1(chrom, chromStartLocation, chromEndLocation, height){
  let rnaContainer = gSvgContainerTbl['rna_container']
	gStartPos = chromStartLocation;
	gEndPos = chromEndLocation;
	// set the ranges and set margin-top for CNV plot
	//cnvPlotHeight = height; // height - cnvMarginTop;
	//yheight = height - 100;
	var y1axisHeight = height;
	xRNA = d3.scaleLinear().range([0, width]).domain([chromStartLocation, chromEndLocation]);
	var maxRankInSample = d3.max(grnaData, function(d) {return Number(d['logTPM']);});
    var minHeightVal = Math.floor(d3.min(grnaData, function(d) {return Number(d['logTPM']);}));
    console.log(minHeightVal)
    maxRankInSample = Math.max(maxRankInSample, 1);
    minHeightVal = Math.min(minHeightVal, 0);

	yRNA = d3.scaleLinear().range([40, 0]).domain([minHeightVal, maxRankInSample]); ///[0, d3.max(data, function(d) { return d[1]; })]); //plot RNA ∆
	rnaContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).call(d3.axisLeft(yRNA).ticks(3)).append("g");
	////////////////////////
	var cloneWholegenomgrnaData = JSON.parse(JSON.stringify(grnaData)); //Object.assign({}, chrs);
	
	var wholegenomgrnaData_1;
	
	if(chrom != -1) wholegenomgrnaData_1 = cloneWholegenomgrnaData.filter(function(o) {
		return o.chrom == chrom
	});
	
	else wholegenomgrnaData_1 = cloneWholegenomgrnaData;
	
	if(chrom == -1) {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segWR) <= Number(chromEndLocation)) && (Number(o.segWL) >= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromStartLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromEndLocation)));
		});
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) o.segWL = o.segWL <= chromStartLocation ? chromStartLocation : o.segWL;
			if(index == (arr.length - 1)) o.segWR = o.segWR >= chromEndLocation ? chromEndLocation : o.segWR;
			return o;
		});
	} else {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segR) <= Number(chromEndLocation)) && (Number(o.segL) >= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromStartLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromEndLocation)));
		})
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) {
				if(o.segL <= chromStartLocation) o.segL = chromStartLocation;
			}
			if(index == (arr.length - 1)) {
			    if(o.segR > chromEndLocation) o.segR = chromEndLocation;
				
			}
			return o;
		});
	}
	var selections = rnaContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).selectAll("path.rnaseg").data(wholegenomgrnaData_1).enter().append('path').attr('d', function(d) {		
		var h = yRNA(d["logTPM"]);
		var a,b;
		if(chrom != -1) {
		   a=xRNA(d["segL"]);
		   b=xRNA(d["segR"]);		
		}
		else{
		   a=xRNA(d["segWL"]);
		   b=xRNA(d["segWR"]);
		   b= (b-a)<1?(b+1):b;		
		}
		var p1 = " M " + a + " " + h + " L " + b + " " + h ;
		
		return p1;
	}).attr("stroke-width", 3).attr("fill", "black").attr("class", "rnaseg").attr("segmentation", d => {
		return JSON.stringify(d);
	}).attr("stroke", "rgb(50, 48, 145)"); //change color÷
	attachRnaToolTip(selections);

}

function plotAxisForRna(id, yscale, yPosition, ticks = 3)
{  
  let spec = gSvgContainerSpecs[id];
  d3.select(`#${id}_tick`).remove();
  d3.select(`#${id}_grid`).remove();
  d3.select(`#${id}_legend1`).remove();  
  d3.select(`#${id}_legend2`).remove();
  gBackgroundContainer.append("g").attr("id", `${id}_tick`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`)
		.call(d3.axisLeft(yscale).ticks(spec.ticks));
  gBackgroundContainer.append("g").attr("id", `${id}_grid`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`).attr("class", "grid")
  .call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
  gBackgroundContainer.append('g').attr("id", `${id}_legend1`).attr('transform', `translate(${gLayout.leftReserve - 40}, ${yPosition + 20})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('RNA');
  gBackgroundContainer.append('g').attr("id", `${id}_legend2`).attr('transform', `translate(${gLayout.leftReserve - 28}, ${yPosition + 20})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('RNAExpression');
}

function prepareRnaData() {
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];

  var cloneWholegenomgrnaData = JSON.parse(JSON.stringify(grnaData)); //Object.assign({}, chrs);
	
	var wholegenomgrnaData_1;
	
	if(showChromonly) wholegenomgrnaData_1 = cloneWholegenomgrnaData.filter(function(o) {
		return o.chrom == defaultChromNum
	});	
	else wholegenomgrnaData_1 = cloneWholegenomgrnaData;
	
	if(!showChromonly) {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segWR) <= Number(chromEndLocation)) && (Number(o.segWL) >= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromStartLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) || ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromEndLocation)));
		});
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) o.segWL = o.segWL <= chromStartLocation ? chromStartLocation : o.segWL;
			if(index == (arr.length - 1)) o.segWR = o.segWR >= chromEndLocation ? chromEndLocation : o.segWR;
			return o;
		});
	} else {
		wholegenomgrnaData_1 = wholegenomgrnaData_1.filter(function(o) {
			return((Number(o.segR) <= Number(chromEndLocation)) && (Number(o.segL) >= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromStartLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromEndLocation)));
		})
		wholegenomgrnaData_1 = wholegenomgrnaData_1.map(function(o, index, arr) {
			if(index == 0) {
				if(o.segL <= chromStartLocation) o.segL = chromStartLocation;
			}
			if(index == (arr.length - 1)) {
			    if(o.segR > chromEndLocation) o.segR = chromEndLocation;				
			}
			return o;
		});
	}
  return wholegenomgrnaData_1
}

function drawRnaData() {
  let spec = gSvgContainerSpecs['rna_container'];
  if (!spec.visible) {
    return;
  }
  let container = gSvgContainerTbl['rna_container']
  container.selectAll("*").remove();
	let xRNA = dragHelper.pathScale;

	let maxRankInSample = d3.max(grnaData, function(d) {return Number(d['logTPM']);});
  let minHeightVal = Math.floor(d3.min(grnaData, function(d) {return Number(d['logTPM']);}));
  maxRankInSample = Math.max(maxRankInSample, 1);
  minHeightVal = Math.min(minHeightVal, 0);
	let yRNA = d3.scaleLinear().range([spec.height, 0]).domain([minHeightVal, maxRankInSample]);

  plotAxisNew('rna_container', yRNA, spec.height / 2, 'RNA', 'Expression');
  let wholegenomgrnaData_1 = prepareRnaData();
	var selections = container.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`).selectAll("path.rnaseg").data(wholegenomgrnaData_1).enter().append('path').attr('d', function(d) {
		var h = yRNA(d["logTPM"]);
		var a,b;
		if(showChromonly) {
		   a=xRNA(d["segL"]);
		   b=xRNA(d["segR"]);		
		} else {
		   a=xRNA(d["segWL"]);
		   b=xRNA(d["segWR"]);
		   b= (b-a)<1?(b+1):b;		
		}
		var p1 = " M " + a + " " + h + " L " + b + " " + h ;		
		return p1;
	}).attr("stroke-width", 3).attr("fill", "black").attr("class", "rnaseg").attr("segmentation", d => {
		return JSON.stringify(d);
	}).attr("stroke", "rgb(50, 48, 145)"); //change color÷
	attachRnaToolTip(selections);

}
