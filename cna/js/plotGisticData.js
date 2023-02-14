function changeGisticData(selectGistic){
	var gisticFileName = "GISTIC/"+selectGistic + "-GISTIC-combined.seg";
	d3.tsv(gisticFileName).then(function(GISTICData) {
		gGISTICData = GISTICData;
		gGISTICData  = gGISTICData.map((o) => {
			o["segChrom"]=o["chr"].replace("chr","");
			o["segL"] = o["start"];
			o["segR"] = o["end"];
			o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chr"].replace("chr","") + "_length"]);
			o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chr"].replace("chr","") + "_length"]);
			return o;
    	});
      drawGistic();
		// plotGisticData(gStartPos, gEndPos, gprobeData, 100, -1, true);
	});
}

function changeGistic(id){
	var gistic = id.options[id.selectedIndex].text;
	gOncotreeNm = gistic;
	changeGisticData(gOncotreeNm);
	// plotYaxisLabel(cnvContainer, true);
}

function prepareGisticData()
{ 
  let dataPosRange =  [dragHelper.leftXbBp, dragHelper.rightXeBp];
  let chromStartLocation = dataPosRange[0];
  let chromEndLocation = dataPosRange[1];

	var cloneGISTICData = JSON.parse(JSON.stringify(gGISTICData)); //Object.assign({}, chrs);
	var wholegenomgistic_1;
	if(showChromonly) {
    wholegenomgistic_1 = cloneGISTICData.filter(function(o) {
      return o.segChrom == defaultChromNum
    });
  } else { 
    wholegenomgistic_1 = cloneGISTICData;
  }
	
	if(!showChromonly) {
		wholegenomgistic_1 = wholegenomgistic_1.filter(function(o) {
			return((Number(o.segWR) <= dataPosRange[1]) && (Number(o.segWL) >= dataPosRange[0])) || 
            ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) ||
            ((Number(o.segWR) >= Number(chromStartLocation)) && (Number(o.segWL) <= Number(chromStartLocation))) ||
            ((Number(o.segWR) >= Number(chromEndLocation)) && (Number(o.segWL) <= Number(chromEndLocation)));
		});
		wholegenomgistic_1 = wholegenomgistic_1.map(function(o, index, arr) {
			if(index == 0) o.segWL = chromStartLocation;
			if(index == (arr.length - 1)) o.segWR = chromEndLocation;
			return o;
		});
	} else {
		wholegenomgistic_1 = wholegenomgistic_1.filter(function(o) {
			return((Number(o.segR) <= Number(chromEndLocation)) && (Number(o.segL) >= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromStartLocation)) && (Number(o.segL) <= Number(chromStartLocation))) || ((Number(o.segR) >= Number(chromEndLocation)) && (Number(o.segL) <= Number(chromEndLocation)));
		})
		wholegenomgistic_1 = wholegenomgistic_1.map(function(o, index, arr) {
			if(index == 0) o.segL = chromStartLocation;
			if(index == (arr.length - 1)) o.segR = chromEndLocation;
			return o;
		});
	};  
  return wholegenomgistic_1;
}

function plotAxisForGistic(id, yscale, yPosition, grids = 5, ticks = 5)
{  
  d3.select(`#${id}_grid`).remove();
  d3.select(`#${id}_tick`).remove();
  d3.select(`#${id}_legend1`).remove();
  d3.select(`#${id}_legend2`).remove();
  let spec = gSvgContainerSpecs[id];
  gBackgroundContainer.append("g").attr("id", `${id}_grid`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`).attr("class", "grid")
		.call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
  gBackgroundContainer.append("g").attr("id", `${id}_tick`).attr("transform", `translate(${gLayout.leftReserve}, ${yPosition})`)
		.call(d3.axisLeft(yscale).ticks(spec.ticks));

  gBackgroundContainer.append('g').attr("id", `${id}_legend1`).attr('transform', `translate(${gLayout.leftReserve - 40}, ${yPosition + 70})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('GISTIC ('+ gOncotreeNm +')');
  gBackgroundContainer.append('g').attr("id", `${id}_legend2`).attr('transform', `translate(${gLayout.leftReserve - 28}, ${yPosition + 70})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Segment');      
}

function drawGistic() {
  let spec = gSvgContainerSpecs['gistic_container'];
  if (!spec.visible) {
    return;
  }
  container = gSvgContainerTbl['gistic_container'];
  let plotHeight = gSvgContainerSpecs['gistic_container'].height
  container.selectAll("*").remove();

	var wholegenomgistic_1 = prepareGisticData();
  let xscale = dragHelper.pathScale;
  let yscale = d3.scaleLinear().range([plotHeight, 0]).domain([-300, 300]);  
  // plotAxisForGistic('gistic_container', yscale, Number(container.attr("y")))
  plotAxisNew('gistic_container', yscale, plotHeight / 2, 'GISTIC ('+ gOncotreeNm +')', 'N\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0W');
  let selections = container.append("g").attr("transform", `translate(0, 0)`)
            .selectAll("path.gisticseg").data(wholegenomgistic_1).enter().append('rect').attr('x', function (d) {
              if (!showChromonly) {
                let xstart = xscale(d.segWL);
                if(xstart<= 0) xstart = 0;
                return xstart;
              } else {
                var xstart = xscale(d.segL);
                if (xstart <= 0) xstart = 0;
                return xstart;
              }
            }).attr('y', (d)=>{
              if (d.dataset.indexOf("Narrow")>=0) {
                return plotHeight / 2;
              } else {
                return 0;
              }
            }).attr('width', (d)=>{
              if(!showChromonly) { //show whole genome
                var xstart = xscale(d.segWL);
                if(xstart<= 0)xstart = 0
                var xend = xscale(d.segWR);
                return xend - xstart;
              } else { //show chrom 
                var xstart = xscale(d.segL);
                if (xstart <= 0) xstart = 0;
                var xend = xscale(d.segR);
                return xend - xstart;
              }              
            }).attr('height', plotHeight / 2).attr('fill', (d)=>{
              if (d.score > 0) {
                return 'red';
              } else {
                return 'blue';
              }
            }).attr("class", "gisticseg")
            .attr("id", "gisticgraphid")
            .attr("segmentation", d=>{return JSON.stringify(d);})     
	attachGisticToolTip(selections);
}