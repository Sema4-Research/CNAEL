
/***
*
*
*init tooltip and create div information
@param tootipName is the id 
***/
function initTooltip(tooltipName, tooltipClass) {
	var Tooltip = d3.select('#general').append('div').attr('id', tooltipName).attr('class', tooltipClass)
	.style('background-color', 'rgb(165, 191, 212)').style('border', 'solid')
	.style('border-width', '0px').style('border-color', 'rgb(89, 119, 143)')
	.style('padding', '5px').style('left', "-1000px").style('top', "1000px")
	.attr('style', 'position: absolute; opacity: 0;').on('mouseover', (event) => {
		//Tooltip.style('visibility', 'hidden');
	});
}

function attach3pBreakpointToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('somatic', true).transition() //Set transition 
		var displayHtml = "Pressing this will jump from 3p " + i["gene_3p"] + " to 5p " + i["gene_5p"];
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('somatic', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#cnvtooltip').style('left', e.pageX +40+ "px").style('top', e.pageY - 40 + "px");
	}).on('click', function(d, i) {
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
		d3.select(this).classed('somatic', false).transition();
		moveFunsion(i["segWL"], i["segWR"], "5p");
	});
}

function attach5pBreakpointToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('somatic', true).transition() //Set transition 
		var displayHtml = "Pressing this will jump from 5p " + i["gene_5p"] + " to 3p " + i["gene_3p"];
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('somatic', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#cnvtooltip').style('left', e.pageX +40+ "px").style('top', e.pageY - 40 + "px");
	}).on('click', function(d, i) {
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
		d3.select(this).classed('somatic', false).transition();
		moveFunsion(i["seg3pWL"], i["seg3pWR"], "3p");
	});
}

function attachSomaticToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('somatic', true).transition() //Set transition
		var displayHtml = "<table class=\"table\">";
		const keys = Object.keys(i);
		keys.forEach((key, index) => {
			// added by jinmou
			if((key == "Genomic coordinates") || (key == "Gene") || (key == "Transcript") || (key == "Cdot") || (key == "Pdot") || (key == "Effect") || (key == "Exon") || (key == "AF") || (key == "CAV")) {
                // if (key == "CAV") {
                //     displayHtml += `<tr class="text-left"><td>${key}:</td><a href="${i['CAV_link']}"><td> ${i[key]}</td></a></tr>`;
                // } else {
                    displayHtml += "<tr class=\"text-left\"><td>" + key + ":</td><td>" + i[key] + "</td></tr>";
                // }
			}
		});
		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('somatic', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#cnvtooltip').style('left', e.pageX +40+ "px").style('top', e.pageY - 180 + "px");
	}).on('click', function(d, i) {
	});
}

function attachGermlineToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('germline', true).transition() //Set transition
		var displayHtml = "<table class=\"table\">";
		const keys = Object.keys(i);
		keys.forEach((key, index) => {
			// added by jinmou
			if((key == "Genomic coordinates") || (key == "Gene") || (key == "Transcript") 
                || (key == "Cdot") || (key == "Pdot") 
                || (key == "Effect") || (key == "Exon") || (key == "AF") 
                || (key == "VISta classification") || (key == "Curation status")) {
				displayHtml += "<tr class=\"text-left\"><td>" + key + ":</td><td>" + i[key] + "</td></tr>";
			}			
		});
		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('germline', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#cnvtooltip').style('left', e.pageX +40+ "px").style('top', e.pageY - 180 + "px");
	}).on('click', function(d, i) {
		/*gBrush.call(brush.move, [0, 677777770].map(x));*/
	});
}

function attachRnaToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('rna', true).transition() //Set transition
		var displayHtml = "<table class=\"table\">";
		const keys = Object.keys(i);
		keys.forEach((key, index) => {
			if((key == "Filter") || (key == "Gene")||(key == "chrom")||(key == "rankWithinSample")||(key == "AM")||(key == "TPM")||(key == "ZScore")||(key == "NumReads")||(key == "FoldChange")) {
				displayHtml += "<tr class=\"text-left\"><td>" + key + ":</td><td>" + i[key] + "</td></tr>";
			}
		});
		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('rna', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#cnvtooltip').style('left', e.pageX +40+ "px").style('top', e.pageY - 180 + "px");
	}).on('click', function(d, i) {
		/*gBrush.call(brush.move, [0, 677777770].map(x));*/
	});
}

function attachFusionToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('noBands', true).transition() //Set transition
			.style('stroke', 'rgb(25, 134, 181, 1)');
		var displayHtml = "<table  class=\"table\">";
		const keys = Object.keys(i);
		keys.forEach((key, index) => {
			if(key != "path") displayHtml += "<tr class=\"text-left\"><td>" + key + ":</td><td>" + i[key] + "</td></tr>";
		});
		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
    let rightEdge = e.pageX + 40;
    if (rightEdge + $('#cnvtooltip').width() > window.innerWidth) { // Out on the right
      rightEdge = rightEdge - $('#cnvtooltip').width() - 5;
    }
		d3.select('#cnvtooltip').style('left', e.pageX +40 + "px").style('top', e.pageY - 310 + "px");
	}).on('click', function(d, i) {
		/*gBrush.call(brush.move, [0, 677777770].map(x));*/
	});
}

function attachGisticToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('gistic', true).transition() //Set transition
			.style('stroke', 'rgb(25, 134, 181, 1)');
		var displayHtml = "<table  class=\"table\">";
		const keys = Object.keys(i);
		keys.forEach((key, index) => {
			if((key != "path")&& (key != "segL")&& (key != "segR")&& (key != "segWL")&& (key != "segWR")&& (key != "segChrom")) 
			{
				var displayVal = i[key]; 
				if (key == "dataset")
				{
					displayHtml += "<tr class=\"text-left\"><td>tumor:</td><td>" + displayVal.split("-")[1] + "</td></tr>";
					displayVal = displayVal.split("-")[2];
				}
				displayHtml += "<tr class=\"text-left\"><td>" + key[0].toUpperCase() + key.substring(1) + ":</td><td>" + displayVal + "</td></tr>";
			}
			
		});
		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('gistic', false).transition().style('stroke', '#222222');
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
    let rightEdge = e.pageX + 40;
    if (rightEdge + $('#cnvtooltip').width() > window.innerWidth) { // Out on the right
      rightEdge = rightEdge - $('#cnvtooltip').width() - 5;
    }
		d3.select('#cnvtooltip').style('left', rightEdge + "px").style('top', e.pageY - 310 + "px");		
	}).on('click', function(d, i) {
		/*gBrush.call(brush.move, [0, 677777770].map(x));*/
	});
}

//.-.
function attachTumorToolTip(selections) {
	selections.on('mouseover', function(d, o) {
		d3.select(this).classed('tumor', true).transition() //Set transition
    // d3.select(this).style("stroke", "purple")
		var displayHtml = "<table  class=\"table\">";
		// const keys = Object.keys(o);
    keyOrder = ["segChrom", "segL", "segR", "callType", "numCopies", /*"oriCopyNum"*/, "MEAN_LOG_COPY_RATIO"];
    // console.log(keyOrder.length, o);
    for (var i = 0; i < keyOrder.length; i++) {
      if (keyOrder[i] in o) {
        key = keyOrder[i];
        var displayVal = o[key];
        if (key == 'MEAN_LOG_COPY_RATIO' || key == "numCopies") {
          displayVal = Number(displayVal).toFixed(2)
        }
        // console.log(key, displayVal)
				displayHtml += "<tr class=\"text-left\"><td>" + key[0].toUpperCase() + key.substring(1) + ":</td><td>" + displayVal + "</td></tr>";
      }
    }

    displayHtml += "<tr class=\"text-left\"><td>OG:</td><td></td></tr>";
    displayHtml += "<tr class=\"text-left\"><td>TSG:</td><td></td></tr>";

		displayHtml += "</table>";
		d3.select('#cnvtooltip').style('opacity', 1).html(displayHtml);
	}).on('mouseout', function(d) {
		d3.select(this).classed('tumor', false).transition();
		d3.select('#cnvtooltip').style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
    let rightEdge = e.pageX + 40;
    if (rightEdge + $('#cnvtooltip').width() > window.innerWidth) { // Out on the right
      rightEdge = rightEdge - $('#cnvtooltip').width() - 5;
    }
		d3.select('#cnvtooltip').style('left', rightEdge + "px").style('top', e.pageY - 310 + "px");
	}).on('click', function(d, i) {
		/*gBrush.call(brush.move, [0, 677777770].map(x));*/
	});
}
/* 
 * generate tooltip information for  mouse over of each arm of the cytoband
 * 
 */
function attachToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		d3.select(this).classed('noBands', true).transition() //Set transition
			.style('stroke', 'rgb(25, 134, 181, 1)');
		d3.select('#tooltip').style('opacity', 1).html("<span class='highlight'>" + i.name + "</span>");
	}).on('mouseout', function(d) {
		d3.select(this).classed('noBands', false).transition().style('stroke', '#222222');
		d3.select('#tooltip').style('opacity', 0).style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).style('stroke', '#222222').on("mousemove", function(e) {
		d3.select('#tooltip').style('left', e.pageX + "px").style('top', e.pageY - 40 + "px");
	}).on('click', function(d, i) {})
}
/***
 ***/
function attachTriangleToolTip(selections) {
	selections.on('mouseover', function(d, i) {
		var counter = 0;
		var html = '<table class = "table"> <tr>';
		var geneArray = allGenes[i.name + ":chr" + defaultChromNum];
		for(var i = 0; i < geneArray.length;i++){
			if (geneArray[i] == "NA"){
				continue;
			}
			counter = counter + 1;
			html = html + '<td class="text-left">' + geneArray[i] + "</td>";
			if (counter >= 3){
				html = html + "</tr> <tr>";
				counter = 0;
			}
		}
		html = html + "</tr> </table>";
		d3.select('#triangletooltip').style('opacity', 1).html(html);
	}).on('mouseout', function(d) {
		d3.select('#triangletooltip').style('opacity', 0).style('opacity', 0).style('left', "-1000px").style('top', "-1000px");
	}).on("mousemove", function(e) {
		d3.select('#triangletooltip').style('left', e.pageX - 120 + "px").style('top', e.pageY + 20 + "px");
	}).on('click', function(d, i) {})
}
