function plotYaxisLabel(cnvContainer, refresh = false) {
	if (refresh){
		d3.select("#gisticlabelid").remove();
	}
	// var id = document.getElementById("gisticid")
	// var oncoCode = id.options[id.selectedIndex].text;
	var oncoCode = gOncotreeNm;
	var axisLabelX = -40;
	var axisLabelY = 70;
	var selections = cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')')
	.append('text').attr('text-anchor', 'middle')
	.attr('transform', 'rotate(-90)')
	.attr("id", "gisticlabelid")
	.style('fill', 'rgb(46, 59, 89)')
	.style('font-size', '11px').text('GISTIC ('+ gOncotreeNm +')');
	if (refresh){
		return;
	}
	////////////////////////////////////////////////////////////////////////
	//top graphs ÷
	axisLabelX = -40;
	axisLabelY = 90;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Gene');
	////////
	axisLabelX = -28;
	axisLabelY = 90;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Fusion');
	////////////////////////////////////
	axisLabelX = -28;
	axisLabelY = 150;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Somatic');
	////////////////////////////////////
	axisLabelX = -28;
	axisLabelY = 210;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Germline');
	////////////////////////////////////
	axisLabelX = -40;
	axisLabelY = 270;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('RNA');
	////////
	axisLabelX = -28;
	axisLabelY = 270;
	cytoBandContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Expression');
	
	
	//////////////////////////////////////////////////bottom graphs

		////////
	axisLabelX = -28;
	axisLabelY = 70;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Segment');
	////////////////////////////////////
	var axisLabelX = -40;
	var axisLabelY = 230;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Number of copies in tumor')
		////////
	axisLabelX = -28;
	axisLabelY = 230;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('(no tumor purity correction)');
	////////////////////////////////////
	var axisLabelX = -40;
	var axisLabelY = 390;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('Allele Ratio')
		////////
	axisLabelX = -28;
	axisLabelY = 390;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('(tumor vs normal)');
	////////////////////////////////////
	var axisLabelX = -40;
	var axisLabelY = 550;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('BAF')
		////////
	axisLabelX = -28;
	axisLabelY = 550;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('tumor');
	////////////////////////////////////
	var axisLabelX = -40;
	var axisLabelY = 710;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('BAF')
		////////
	axisLabelX = -28;
	axisLabelY = 710;
	cnvContainer.append('g').attr('transform', 'translate(' + axisLabelX + ', ' + axisLabelY + ')').append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text('normal');

}

function plotAxisNew(id, yscale, relativePos, leg1, leg2, axisRelative = 0)
{  
  d3.selectAll(`#${id}_axis`).remove();
  let yPosition = Number(gSvgContainerTbl[id].attr("y"))
  let spec = gSvgContainerSpecs[id];
  let container = gBackgroundContainer.append("g").attr("id", `${id}_axis`).attr("transform", `translate(0, ${yPosition})`);
  container.append("g").attr("transform", `translate(${gLayout.leftReserve}, ${axisRelative})`).attr("class", "grid").call(makeYgridlines(yscale, spec.grids).tickSize(-gLayout.content).tickFormat(""))
	container.append("g").attr("transform", `translate(${gLayout.leftReserve}, ${axisRelative})`).call(d3.axisLeft(yscale).ticks(spec.ticks));  
  if (leg1 || leg1 != '') {
    container.append('g').attr('transform', `translate(${gLayout.leftReserve - 40}, ${relativePos})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text(leg1);
  }
  if (leg2) {
    container.append('g').attr('transform', `translate(${gLayout.leftReserve - 28}, ${relativePos})`).append('text').attr('text-anchor', 'middle').attr('transform', 'rotate(-90)').style('fill', 'rgb(46, 59, 89)').style('font-size', '11px').text(leg2);
  }
}

function updateAxis(id)
{  
  d3.select(`#${id}_axis`).attr("transform", `translate(0, ${Number(gSvgContainerTbl[id].attr("y"))})`);
}
