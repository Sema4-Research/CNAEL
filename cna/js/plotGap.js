function renderWholeGenomeGapPlot(chromStartLocation, chromEndLocation, cnvUnique, height, chrom) {
	//var gapdata = ggapdata.filter((o)=>{return o.chrom==defaultChromNum;});
	var gapTypeColor = {};
	gapTypeColor["gap"] = "rgb(255,0,0)"; // red
	gapTypeColor["PAR2"] = "rgb(125, 184, 83)"; // green
	gapTypeColor["PAR1"] = "rgb(255,0,0)"; // red
	gapTypeColor["short_arm"] = "rgb(255,0,0)"; //red
	gapTypeColor["telomere"] = "rgb(118, 105, 201)"; // deep blue
	gapTypeColor["clone"] = "rgb(212, 106, 222)"; //purple
	gapTypeColor["contig"] = "rgb(222, 170, 29)"; //brown
	gapTypeColor["centromere"] = "rgb(0, 214, 182)"; // blue
	gapTypeColor["heterochromatin"] = "rgb(143, 59, 75)"; // dark red
	//var ggapdata_1 = ggapdata.filter(function(o){return (Number(o.wholepos)>=Number(chromStartLocation)&&Number(o.wholepos)<=Number(chromEndLocation)); });
	var ggapdata_1;
	if(chrom != -1) ggapdata_1 = ggapdata.filter(function(o) {
		return o.chrom == chrom;
	});
	if(chrom == -1) ggapdata_1 = ggapdata.filter(function(o) {
		return(Number(o.gchromStart) >= Number(chromStartLocation) && Number(o.gchromStart) <= Number(chromEndLocation)) || (Number(o.gchromEnd) >= Number(chromStartLocation) && Number(o.gchromEnd) <= Number(chromEndLocation));
	});
	else {
		ggapdata_1 = ggapdata_1.filter(function(o) {
			return(Number(o.chromStart) >= Number(chromStartLocation) && Number(o.chromStart) <= Number(chromEndLocation)) || (Number(o.chromEnd) >= Number(chromStartLocation) && Number(o.chromEnd) <= Number(chromEndLocation));
		});
	}
	//plot gat for whole genome data and h is the hegiht.
	cnvContainer.selectAll("path.wholegapseg").data(ggapdata_1).enter().append('path').attr('d', function(d) {
		var a, b;
		var length = chromEndLocation - chromStartLocation;
		if(chrom == -1) {
			a = x(d.gchromStart);
			b = x(d.gchromEnd);
		} else {
			a = x(d.chromStart);
			b = x(d.chromEnd);
		}
		//b = b - a < 1 ? a + 2 : b;
		var h2 = 140;
		var h = 0; //yscale(gapTypeData["map"][d.type]); //-2 + cnvPlotHeight / 10 * minCopy;
		p = "M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		h = 160;
		h2 = 300;
		p1 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		h = 320;
		h2 = 460;
		p2 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		h = 480;
		h2 = 620;
		p3 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		h = 640;
		h2 = 780;
		p4 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;

		p = p + p1 + p2 + p3 + p4;
		return p;
	}).attr("stroke-width", 0.5).attr("class", "wholegapseg").attr("stroke", function(d) {
		return gapTypeColor[d.type];
	}).attr("fill", function(d) {
		return gapTypeColor[d.type];
	}).style("opacity", 0.2);
	//d3.selectAll("path.cnv").raise();
}

function renderWholeGenomeGapPlotV1(chrom, chromStartLocation, chromEndLocation) {
  let cords = [];
  for (let i = 0; i < gBackground['seg-gap'].length; i++) {
    let h = Number(gSvgContainerTbl[gBackground['seg-gap'][i]].attr("y"));
    let h2 = Number(gSvgContainerTbl[gBackground['seg-gap'][i]].attr("height"));
    cords.push([h, h2]);
  }
  if (cords.length == 0) {
    return 0;
  }
	var gapTypeColor = {};
	gapTypeColor["gap"] = "rgb(255,0,0)"; // red
	gapTypeColor["PAR2"] = "rgb(125, 184, 83)"; // green
	gapTypeColor["PAR1"] = "rgb(255,0,0)"; // red
	gapTypeColor["short_arm"] = "rgb(255,0,0)"; //red
	gapTypeColor["telomere"] = "rgb(118, 105, 201)"; // deep blue
	gapTypeColor["clone"] = "rgb(212, 106, 222)"; //purple
	gapTypeColor["contig"] = "rgb(222, 170, 29)"; //brown
	gapTypeColor["centromere"] = "rgb(0, 214, 182)"; // blue
	gapTypeColor["heterochromatin"] = "rgb(143, 59, 75)"; // dark red
	//var ggapdata_1 = ggapdata.filter(function(o){return (Number(o.wholepos)>=Number(chromStartLocation)&&Number(o.wholepos)<=Number(chromEndLocation)); });
	var ggapdata_1;
	if(chrom != -1) ggapdata_1 = ggapdata.filter(function(o) {
		return o.chrom == chrom;
	});
	if(chrom == -1) ggapdata_1 = ggapdata.filter(function(o) {
		return(Number(o.gchromStart) >= Number(chromStartLocation) && Number(o.gchromStart) <= Number(chromEndLocation)) || (Number(o.gchromEnd) >= Number(chromStartLocation) && Number(o.gchromEnd) <= Number(chromEndLocation));
	});
	else {
		ggapdata_1 = ggapdata_1.filter(function(o) {
			return(Number(o.chromStart) >= Number(chromStartLocation) && Number(o.chromStart) <= Number(chromEndLocation)) || (Number(o.chromEnd) >= Number(chromStartLocation) && Number(o.chromEnd) <= Number(chromEndLocation));
		});
	}


	//plot gat for whole genome data and h is the hegiht.
	gBackgroundContainer.append("g").attr("transform", `translate(${gLayout.leftReserve}, 0)`)
        .selectAll("path.wholegapseg").data(ggapdata_1).enter().append('path').attr('d', function(d) {
		var a, b;
		var length = chromEndLocation - chromStartLocation;
		if(chrom == -1) {
			a = x(d.gchromStart);
			b = x(d.gchromEnd);
		} else {
			a = x(d.chromStart);
			b = x(d.chromEnd);
		}
		//b = b - a < 1 ? a + 2 : b;
    let p = "";    
    for (let i = 0; i < cords.length; i++) {
      let h = cords[i][0];
      let h2 = h + cords[i][1];
      p += "M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h + " ";
    }
    // p += " "
    // // h_begin : 
    // // h_end: 
		// var h2 = 140;
		// var h = 0; //yscale(gapTypeData["map"][d.type]); //-2 + cnvPlotHeight / 10 * minCopy;
		// p = "M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		// h = 160;
		// h2 = 300;
		// p1 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		// h = 320;
		// h2 = 460;
		// p2 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		// h = 480;
		// h2 = 620;
		// p3 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;
		// h = 640;
		// h2 = 780;
		// p4 = " M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h;

		// p = p + p1 + p2 + p3 + p4;
		return p;
	}).attr("stroke-width", 0.5).attr("class", "wholegapseg").attr("stroke", function(d) {
		return gapTypeColor[d.type];
	}).attr("fill", function(d) {
		return gapTypeColor[d.type];
	}).style("opacity", 0.2);
	//d3.selectAll("path.cnv").raise();
}

function prepareGapData() {  
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];
  let chrom = showChromonly ? defaultChromNum : -1;
	let ggapdata_1;
	if(chrom != -1) ggapdata_1 = ggapdata.filter(function(o) {
		return o.chrom == chrom;
	});
	if(chrom == -1) ggapdata_1 = ggapdata.filter(function(o) {
		return(Number(o.gchromStart) >= Number(chromStartLocation) && Number(o.gchromStart) <= Number(chromEndLocation)) || (Number(o.gchromEnd) >= Number(chromStartLocation) && Number(o.gchromEnd) <= Number(chromEndLocation));
	});
	else {
		ggapdata_1 = ggapdata_1.filter(function(o) {
			return(Number(o.chromStart) >= Number(chromStartLocation) && Number(o.chromStart) <= Number(chromEndLocation)) || (Number(o.chromEnd) >= Number(chromStartLocation) && Number(o.chromEnd) <= Number(chromEndLocation));
		});
	}
  return ggapdata_1;
}

function drawGap() {
  let container = gSvgContainerTbl['gap-container'];
  container.selectAll("*").remove();

  let cords = [];
  for (let i = 1; i <= TOTAL_PLOT_CNT; i++) {
    let nm = gSvgContainerOrder[i];
    if (nm == null) {
      continue;
    }
    let spec = gSvgContainerSpecs[nm];
    if (!spec.visible) {
      continue;
    }
    if (!spec.seg_gap) {
      continue;
    }
    let h = Number(gSvgContainerTbl[nm].attr("y"));
    let h2 = Number(gSvgContainerTbl[nm].attr("height"));
    cords.push([h, h2]);
  }
  // for (let i = 0; i < gBackground['seg-gap'].length; i++) {
  //   let spec = gSvgContainerSpecs[gBackground['seg-gap'][i]];
  //   if (!spec.visible) {
  //     continue;
  //   }
  //   let h = Number(gSvgContainerTbl[gBackground['seg-gap'][i]].attr("y"));
  //   let h2 = Number(gSvgContainerTbl[gBackground['seg-gap'][i]].attr("height"));
  //   cords.push([h, h2]);
  // }
  if (cords.length == 0) {
    return 0;
  }
	var gapTypeColor = {};
	gapTypeColor["gap"] = "rgb(255,0,0)"; // red
	gapTypeColor["PAR2"] = "rgb(125, 184, 83)"; // green
	gapTypeColor["PAR1"] = "rgb(255,0,0)"; // red
	gapTypeColor["short_arm"] = "rgb(255,0,0)"; //red
	gapTypeColor["telomere"] = "rgb(118, 105, 201)"; // deep blue
	gapTypeColor["clone"] = "rgb(212, 106, 222)"; //purple
	gapTypeColor["contig"] = "rgb(222, 170, 29)"; //brown
	gapTypeColor["centromere"] = "rgb(0, 214, 182)"; // blue
	gapTypeColor["heterochromatin"] = "rgb(143, 59, 75)"; // dark red
	//var ggapdata_1 = ggapdata.filter(function(o){return (Number(o.wholepos)>=Number(chromStartLocation)&&Number(o.wholepos)<=Number(chromEndLocation)); });
	var ggapdata_1 = prepareGapData();
  let xscale = dragHelper.pathScale;

	//plot gat for whole genome data and h is the hegiht.
	container.append("g").attr("transform", `translate(0, 0)`)
        .selectAll("path.wholegapseg").data(ggapdata_1).enter().append('path').attr('d', function(d) {
		var a, b;
		if(!showChromonly) {
			a = xscale(d.gchromStart);
			b = xscale(d.gchromEnd);
		} else {
			a = xscale(d.chromStart);
			b = xscale(d.chromEnd);
		}
    let p = "";    
    for (let i = 0; i < cords.length; i++) {
      let h = cords[i][0];
      let h2 = h + cords[i][1];
      p += "M " + a + " " + h + " L " + b + " " + h + " L " + b + " " + h2 + " L " + a + " " + h2 + " L " + a + " " + h + " ";
    }
		return p;
	}).attr("stroke-width", 0.5).attr("class", "wholegapseg").attr("stroke", function(d) {
		return gapTypeColor[d.type];
	}).attr("fill", function(d) {
		return gapTypeColor[d.type];
	}).style("opacity", 0.2);
}



