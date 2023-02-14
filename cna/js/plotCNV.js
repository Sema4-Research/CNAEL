// function plotAxisNew(id, yscale, yPosition, leg1, leg2, grids = 5, ticks = 5)
// {  
//   d3.select(`#${id}_grid`).remove();
//   d3.select(`#${id}_tick`).remove();
//   d3.select(`#${id}_legend1`).remove();
//   d3.select(`#${id}_legend2`).remove();
//   let spec = gSvgContainerSpecs[id];
//   let container = gBackgroundContainer.append("g").attr("id", `${id}_axis`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`);

//   gBackgroundContainer.append("g").attr("id", `${id}_grid`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`).attr("class", "grid")
// 		.call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
//   gBackgroundContainer.append("g").attr("id", `${id}_tick`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`)
// 		.call(d3.axisLeft(yscale).ticks(spec.ticks));

//   gBackgroundContainer.append('g').attr("id", `${id}_legend1`).attr('transform', `translate(${gLayout.leftReserve - 40}, ${yPosition + 70})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text(leg1);
//   gBackgroundContainer.append('g').attr("id", `${id}_legend2`).attr('transform', `translate(${gLayout.leftReserve - 28}, ${yPosition + 70})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text(leg2);    
// }



///////////////////////////// Tumor Copy Number /////////////////////////////
const CIRCLE_DIS = 536870912

function constructPathByAxisV1(xstart, xend, y, xaxis, yaxis) {
	var a = xaxis(xstart);
	var b = xaxis(xend);
	a = a < 0 ? 0 : a;
	b = b - a < 1 ? a + 1 : b;
	var h = yaxis(y);
	return "M " + a + " " + h + " L " + b + " " + h;
}

///////////////////////////// Tumor Copy Number /////////////////////////////
function plotTumorCopyNumberOfProbedataV1(container, xscale, yscale, tumorCopyNumData) {
	return container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("probenumberofcopy").data(tumorCopyNumData).enter().append('path')
	.attr('d', function(d) {
		if(!showChromonly) {
			return constructPathByAxis(d.wholestart, d.wholeend, d.tumorNumCopies, xscale, yscale);
		} else {
			return constructPathByAxis(d.start, d.end, d.tumorNumCopies, xscale, yscale);
		}
	}).attr("class", "probenumberofcopy").attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).attr("stroke-width", "2").attr("stroke", "rgb(128,128,128)");		
}

function plotTumorCopyNumberOfProbedataCircle(container, xscale, yscale, tumorCopyNumData) {
	return container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("probenumberofcopy").data(tumorCopyNumData).enter().append('circle')
	.attr('cx', function(d) {
		if(!showChromonly) {
      return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d.tumorNumCopies, xscale, yscale)[1];
		} else {
      return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d.tumorNumCopies, xscale, yscale)[1];			
		}
	})
  .attr('cy', function(d) {
		if(!showChromonly) {
      return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d.tumorNumCopies, xscale, yscale)[3];
		} else {
      return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d.tumorNumCopies, xscale, yscale)[3];
		}
  })
  .attr("class", "probenumberofcopy").attr("posinfor", function(d) {
		return JSON.stringify(d);
	}).attr("r", "2").style("fill", "rgb(53,91,183)");;		
}

// cnvContainer.append("g").attr("transform", "translate(0," + y3axisLocaion + ")")
// .selectAll("alleleRatio")
// .data(probedata_1).enter().append('circle').attr('d', function(d) {
//   //return p[1] ;
// }).attr("class", "alleleRatio").attr("cx", function(d) {
//   // console.log('cx' + String(d.wholepos) + ',' + String(chromStartLocation) + ',' + String(chromEndLocation) + ',' + String(d.alleleRatio) + ',' + String(x2) + ',' + String(y2));
//   // cx881513,0,3088269808,0.9959,function l(n){return null==n||isNaN(n=+n)?e:(i||(i=r(a.map(t),u,c)))(t(f(n)))},function l(n){return null==n||isNaN(n=+n)?e:(i||(i=r(a.map(t),u,c)))(t(f(n)))}

//   if(chrom == -1) p = constructPixelPositionByAxis(d.wholepos, d.wholepos, chromStartLocation, chromEndLocation, d.alleleRatio, x2, y2);
//   else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d.alleleRatio, x2, y2);
//   return p[1]
// }).attr("cy", function(d) {
//   if(chrom == -1) p = constructPixelPositionByAxis(d.wholepos, d.wholepos, chromStartLocation, chromEndLocation, d.alleleRatio, x2, y2);
//   else p = constructPixelPositionByAxis(d.pos, d.pos, chromStartLocation, chromEndLocation, d.alleleRatio, x2, y2);
//   return p[3]
// }).attr("r", 2).style("fill", "rgb(128,128,128)");


function plotTumorCopyNumberOfSegDataV1(container, xscale, yscale, wholegenomSegdata) {
	var selections = container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("path.cnvseg").data(wholegenomSegdata).enter().append('path')
	.attr('d', function(d) {
		if(!showChromonly) {
			return constructPathByAxis(d.segWL, d.segWR, d.numCopies, xscale, yscale);
		} else {
			let p = constructPathByAxisV1(d.segL, d.segR, d.numCopies, xscale, yscale);
      console.log(d.segL, d.segR, p)
      return p;
		}
	}).attr("stroke-width", 3).attr("class", "cnvseg").attr("segmentation", d => {
		return JSON.stringify(d);
	}).attr("stroke", function(d) {
		if(d.callType == "loss") return "blue";
		else if(d.callType == "gain") return "red";
        else if(d.callType == "amplification") return "red";
		else return "black";
	});
	attachTumorToolTip(selections);
}


///////////////////////////// Allele Ratio /////////////////////////////
function plotAlleleRatioOfProbeData(container, xscale, yscale, probeData)
{  
	container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("alleleRatio")
	.data(probeData).enter().append('path').attr('d', function(d) {
		if(!showChromonly) {
			return constructPathByAxis(d.wholestart, d.wholeend, d.alleleRatio, xscale, yscale);
		} else {
			return constructPathByAxis(d.start, d.end, d.alleleRatio, xscale, yscale);
		}
	}).attr("class", "alleleRatio").attr("stroke-width", "2").attr("stroke", "rgb(128,128,128)");
}

function plotAlleleRatioOfProbeDataCircle(container, xscale, yscale, probeData)
{  
	container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("alleleRatio")
	.data(probeData).enter().append('circle')
  .attr('cx', function(d) {
		if(!showChromonly) {
			return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d.alleleRatio, xscale, yscale)[1];
		} else {
			return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d.alleleRatio, xscale, yscale)[1];
		}
	})
  .attr('cy', function(d) {
		if(!showChromonly) {
			return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d.alleleRatio, xscale, yscale)[3];
		} else {
			return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d.alleleRatio, xscale, yscale)[3];
		}
  })
  .attr("class", "alleleRatio").attr("r", "2").style("fill", "rgb(53,91,183)");
}

function plotAlleleRatioOfSegData(container, xscale, yscale, wholegenomSegdata)
{
	var selections = container.append("g").attr("transform", `translate(0, 0)`)
	.selectAll("path.alleratioseg").data(wholegenomSegdata).enter()
	.filter(d => !isNaN(d.alleleRatio)).append('path').attr('d', function(d) {
		if(!showChromonly) {
			return constructPathByAxis(d.segWL, d.segWR, d.alleleRatio, xscale, yscale);
		} else {
			return constructPathByAxis(d.segL, d.segR, d.alleleRatio, xscale, yscale);
		}
	}).attr("stroke-width", 3).attr("class", "alleratio").attr("stroke", function(d) {
		if(d.callType == "loss") return "blue";
		else if(d.callType == "gain") return "red";
        else if(d.callType == "amplification") return "red";
		else return "black";
	});
	attachTumorToolTip(selections);	
}

function prepareProbeCopyNumData()
{
  // let samplePointCnt = 8000  * dragHelper.pages;
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
	let tumorCopyNumData;
	if(showChromonly) {
    tumorCopyNumData = gprobeCNofTumor.filter(function(o) {
			  return o.chrom == defaultChromNum && 
            (Number(o.start) >= dataPosRange[0] && Number(o.end) <=dataPosRange[1]);
		});
	} else {
    tumorCopyNumData = gprobeCNofTumor.filter(function(o) {
        return (Number(o.wholestart) >= dataPosRange[0] && Number(o.wholeend) <= dataPosRange[1]);
    });
  }
	
  // // todo server side
	// tumorCopyNumData = sampling(tumorCopyNumData, 
	// 						Math.max(Math.round(tumorCopyNumData.length / samplePointCnt), 1));
  return tumorCopyNumData;
}


function prepareSegmentData()
{
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
	/*
	  plot segment data,using the clip to cut the data
	*/
	let cloneWholegenomSegdata = JSON.parse(JSON.stringify(gwholegenomSegdata));
	let wholegenomSegdata;// = chrom == -1 ? cloneWholegenomSegdata : cloneWholegenomSegdata.filter(o=>o.segChrom == chrom);
	if(!showChromonly) {
		wholegenomSegdata = cloneWholegenomSegdata.filter(function(o) {
			return ((Number(o.segWR) <= dataPosRange[1]) && (Number(o.segWL) >= dataPosRange[0])) ||
             ((Number(o.segWR) >= dataPosRange[1]) && (Number(o.segWL) <= dataPosRange[0])) || 
             ((Number(o.segWR) >= dataPosRange[0]) && (Number(o.segWL) <= dataPosRange[0])) ||
            ((Number(o.segWR) >= dataPosRange[1]) && (Number(o.segWL) <= dataPosRange[1]));
		});
	} else {
		wholegenomSegdata = cloneWholegenomSegdata.filter(function(o) {
			// return((Number(o.segL) >= dataPosRange[0]) && (Number(o.segR) <= dataPosRange[1])); 
      return o.segChrom == defaultChromNum && (
            ((Number(o.segR) <= dataPosRange[1]) && (Number(o.segL) >= dataPosRange[0])) ||
            ((Number(o.segR) >= dataPosRange[1]) && (Number(o.segL) <= dataPosRange[0])) ||
            ((Number(o.segR) >= dataPosRange[0]) && (Number(o.segL) <= dataPosRange[0])) || 
            ((Number(o.segR) >= dataPosRange[1]) && (Number(o.segL) <= dataPosRange[1])));
		})
	}
  return wholegenomSegdata;
}

function prepareProbeBafData() {
  // let samplePointCnt = 8000 * dragHelper.pages;
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let probeBafData;
	if(!showChromonly) {
		probeBafData = gprobeData.filter(function(o) {
			return (Number(o.wholestart) >= dataPosRange[0] && Number(o.wholeend) <= dataPosRange[1]);
		});
	} else {
		probeBafData = gprobeData.filter(function(o) {
			return o.chrom == defaultChromNum && 
            (Number(o.start) >= dataPosRange[0] && Number(o.end) <= dataPosRange[1]);
		});
	}
	// probeBafData = sampling(probeBafData, 
	// 						Math.max(Math.round(probeBafData.length / samplePointCnt), 1));  
  return probeBafData;
}

let gProbePlotData = {
  probeBafData : null,
  tumorCopyNumData : null,
  wholegenomSegdata : null,
};

function prepareProbePlotData() {
  gProbePlotData.probeBafData = prepareProbeBafData();
  gProbePlotData.tumorCopyNumData = prepareProbeCopyNumData();
  gProbePlotData.wholegenomSegdata = prepareSegmentData();
  // console.log(gProbePlotData);
}

function drawTumorCN() {
  let spec = gSvgContainerSpecs['tumorcn_container'];
  if (!spec.visible) {
    return;
  }
  let container = gSvgContainerTbl['tumorcn_container'];
  let plotHeight = gSvgContainerSpecs['tumorcn_container'].height
  container.selectAll("*").remove();
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  console.log(dataPosRange);  
	let tumorCopyNumData = gProbePlotData.tumorCopyNumData;
  let wholegenomSegdata = gProbePlotData.wholegenomSegdata;

  // use max copynum as yaxis range
  let maxCopyNum = d3.max(wholegenomSegdata, function(d) {return d['numCopies'];});
  maxCopyNum = maxCopyNum == undefined ? 8 : maxCopyNum;
  let maxCopyNumInProbeData = d3.max(tumorCopyNumData, function(d) {return d['tumorNumCopies'];});
  if (maxCopyNumInProbeData != undefined) {
    maxCopyNum = maxCopyNum > maxCopyNumInProbeData ? maxCopyNum : maxCopyNumInProbeData;
  }
  let copyNumRangeUp = Math.max(Math.ceil(maxCopyNum), 8);

  let yscale = d3.scaleLinear().range([plotHeight, 0]).domain([0, copyNumRangeUp]);
  let xscale = dragHelper.pathScale;
  
  plotAxisNew('tumorcn_container', yscale, plotHeight / 2, 'Number of copies in tumor', '(no tumor purity correction)');

  if (gLayout.distance < CIRCLE_DIS) {
    plotTumorCopyNumberOfProbedataCircle(container, xscale, yscale, tumorCopyNumData);
  } else {
    plotTumorCopyNumberOfProbedataV1(container, xscale, yscale, tumorCopyNumData);
  }

  plotTumorCopyNumberOfSegDataV1(container, xscale, yscale, wholegenomSegdata);	
}

function drawAlleleRatioPlot() {
  let spec = gSvgContainerSpecs['alleleratio_container'];
  if (!spec.visible) {
    return;
  }
  let container = gSvgContainerTbl['alleleratio_container'];
  let plotHeight = gSvgContainerSpecs['alleleratio_container'].height
  container.selectAll("*").remove();
  let probeBafData = gProbePlotData.probeBafData;
  let wholegenomSegdata = gProbePlotData.wholegenomSegdata;

	let xscale = dragHelper.pathScale;
  var yscale = d3.scaleLinear().range([plotHeight, 0]).domain([0, 2.0]);
  
  plotAxisNew('alleleratio_container', yscale, plotHeight / 2, "Allele Ratio", "(tumor vs normal)");
  if (gLayout.distance < CIRCLE_DIS) {
    plotAlleleRatioOfProbeDataCircle(container, xscale, yscale, probeBafData);
  } else {
    plotAlleleRatioOfProbeData(container, xscale, yscale, probeBafData);
  }

	plotAlleleRatioOfSegData(container, xscale, yscale, wholegenomSegdata);
}

function drawTumorBaf() {
  let spec = gSvgContainerSpecs['tumbaf_container'];
  if (!spec.visible) {
    return;
  }
  let container = gSvgContainerTbl['tumbaf_container'];
  let plotHeight = gSvgContainerSpecs['tumbaf_container'].height
  container.selectAll("*").remove();
  let probeBafData = gProbePlotData.probeBafData;

  let xscale = dragHelper.pathScale;
  // use max baf as yaxis up value
  var maxTumorBaf = d3.max(probeBafData, function(d) {return d['tumor.BAF'];});
	var minTumorBaf = d3.min(probeBafData, function(d) {return d['tumor.BAF'];});
	var baseBaf = Math.max(Math.abs(minTumorBaf), Math.abs(maxTumorBaf));
	var tumorBafRangeUp = Math.max(1, Math.ceil(baseBaf));
	var tumorBafRangeDown = minTumorBaf < 0 ? 0 - tumorBafRangeUp : 0;
	var yscale = d3.scaleLinear().range([plotHeight, 0]).domain([tumorBafRangeDown, tumorBafRangeUp]);
	
  plotAxisNew('tumbaf_container', yscale, plotHeight / 2, "BAF", "tumor", gBackground['gird']['tumbaf_container']);

  if (gLayout.distance < CIRCLE_DIS) {
    container.append("g").attr("transform", `translate(0, 0)`)
    .selectAll("tumorbaf").data(probeBafData).enter().append('circle').attr("class", "tumorbaf")
    .attr("cx", function(d) {
        if(!showChromonly) {
          return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d["tumor.BAF"], xscale, yscale)[1];
        } else {
          return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d["tumor.BAF"], xscale, yscale)[1];			
        }
      })
    .attr("cy", function(d) {
      if(!showChromonly) {
        return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d["tumor.BAF"], xscale, yscale)[3];
      } else {
        return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d["tumor.BAF"], xscale, yscale)[3];
      }
    }).attr("r", "2").style("fill", "rgb(53,91,183)");
  } else {
    container.append("g").attr("transform", `translate(0, 0)`)
    .selectAll("tumorbaf").data(probeBafData).enter().append('path').attr("class", "tumorbaf")
    .attr("d", function(d) {
      if (!showChromonly) {
        return constructPathByAxis(d.wholestart, d.wholeend, d["tumor.BAF"], xscale, yscale);
      } else {
        return constructPathByAxis(d.start, d.end, d["tumor.BAF"], xscale, yscale);
      }
    }).attr("stroke-width", "2").attr("stroke", "rgb(128,128,128)");
  }
}

///////////////////////////// Tumor Baf /////////////////////////////
function drawNormalBaf()
{
  let spec = gSvgContainerSpecs['norbaf_container'];
  if (!spec.visible) {
    return;
  }
  let container = gSvgContainerTbl['norbaf_container'];
  let plotHeight = gSvgContainerSpecs['norbaf_container'].height
  container.selectAll("*").remove();
  let probeBafData = gProbePlotData.probeBafData;

  let xscale = dragHelper.pathScale;


	var yscale = d3.scaleLinear().range([plotHeight, 0]).domain([0, 1]);
	plotAxisNew('norbaf_container', yscale, plotHeight / 2, "BAF", "normal", gBackground['gird']['norbaf_container']);
  if (gLayout.distance < CIRCLE_DIS) {
    container.append("g").attr("transform", `translate(0, 0)`)
    .selectAll("normalbaf").data(probeBafData).enter().append('circle')
    .attr("cx", function(d) {
      if(!showChromonly) {
        return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d["normal.BAF"], xscale, yscale)[1];
      } else {
        return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d["normal.BAF"], xscale, yscale)[1];
      }
    })
    .attr("cy", function(d) {
      if(!showChromonly) {
        return constructPixelPositionByAxis((d.wholestart + d.wholeend) / 2, (d.wholestart + d.wholeend) / 2, 0, 0, d["normal.BAF"], xscale, yscale)[3];
      } else {
        return constructPixelPositionByAxis((d.start + d.end) / 2, (d.start + d.end) / 2, 0, 0, d["normal.BAF"], xscale, yscale)[3];
      }
    })
    .attr("class", "normalbaf").attr("r", "2").style("fill", "rgb(53,91,183)");
  } else {
    container.append("g").attr("transform", `translate(0, 0)`)
    .selectAll("normalbaf").data(probeBafData).enter().append('path')
    .attr('d', function(d) {
      if(!showChromonly) {
        return constructPathByAxis(d.wholestart, d.wholeend, d["normal.BAF"], xscale, yscale);
      } else {
        return constructPathByAxis(d.start, d.end, d["normal.BAF"], xscale, yscale);
      }
    } ).attr("class", "normalbaf").attr("stroke-width", "2").attr("stroke", "rgb(128,128,128)")	
  }
}
