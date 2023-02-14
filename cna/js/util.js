function deleteLocationV1(oldDtRowId){	  
  gwholegenomSegdata = gwholegenomSegdata.filter(o=>{	      
	      return o["DT_RowId"] != oldDtRowId;
	});
}

 function displaySVG(){
	 if (!showChromonly) {
		displayWholeGenome(gStartPos, gEndPos, cnvMarginTop);
	 } else {
		displayChromOnly(gStartPos, gEndPos);
	}
 
 }

//{"sample":"ISM556060-2","segChrom":"1","segL":"152278926","segR":"186303915","callType":"gain","numCopies":"2.5590","numCopies_ciLow":"2.5491","numCopies_ciHigh":"2.5726","alleleRatio":"1.1614","alleleRatio_ciLow":"1.1526","alleleRatio_ciHigh":"1.1672","MEAN_LOG_COPY_RATIO":"0.3584","segWL":152278926,"segWR":186303915}
//{"sample":"ISM556060-2","segChrom":"1","segL":"152278926","segR":"248263866","callType":"gain","numCopies":"4.1067","numCopies_ciLow":"2.5491","numCopies_ciHigh":"2.5726","alleleRatio":"1.1614","alleleRatio_ciLow":"1.1526","alleleRatio_ciHigh":"1.1672","MEAN_LOG_COPY_RATIO":"0.3584","segWL":152278926,"segWR":186303915}
function saveAsPNG(){
    var html = d3.select("svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;
	     
		  var imgsrc = 'data:image/svg+xml;base64,'+ btoa(unescape(encodeURIComponent(html)));
		  var img = '<img src="'+imgsrc+'">'; 
        //var canvas = document.querySelector("canvas");
        var canvas =  document.createElement('canvas');
            context = canvas.getContext("2d");
            canvas.width=1500;
            canvas.height=1000;
		  var image = new Image;
		  image.src = imgsrc;
		  image.width = 1500;
		  image.height = 1000;
		  image.onload = function() {
        context.drawImage(image, 0, 0);

        var canvasdata = canvas.toDataURL("image/png");

            var pngimg = '<img width="1500" height="1000" src="'+canvasdata+'">'; 
            // d3.select("#pngdataurl").html(pngimg);

            var a = document.createElement("a");
            a.download = "sample.png";
            a.href = canvasdata;
            a.click();
        };

}

/***
*
*
*get each chromosome information give chromsome number
@param tootipName is the id 
***/
function getChromLength(chromsomeID) {
	var chr = chrBands[chromsomeID];
	var firstband = chr[0];
	var lastband = chr[chr.length - 1];
	return [firstband["bp"].start, lastband["bp"].stop]
}

function averageEvery(arr, n) {
	return  arr.filter(function(value, index, Arr) {
		return index % n== 0;
	});
}

function sampling(arr, interval) {
	return  arr.filter(function(value, index, Arr) {
		return index % interval == 0;
	});
}

/**
 * TODO: use regex
 * input 1.1-2 return [1.1, 2]
 * input error return []
 */
function getInputValueRagne(rangeStr) {
	var ranges = [];
	var tokens  = rangeStr.split('-');
	if (tokens.length != 2) {
		return ranges;
	}
	var val1 = Number(tokens[0]);
	var val2 = Number(tokens[1]);
	if (isNaN(val1) || isNaN(val2)) {
		return ranges;
	}
	ranges[0] = val1;
	ranges[1] = val2;
	return ranges;
}

  function replaceLocationV1(oldDtRowId, newL){
    //segL	segR	callType	numCopies
     gwholegenomSegdata = gwholegenomSegdata.map(o=>{
      if( o["DT_RowId"] == oldDtRowId) {
        var chrom = newL.split(":")[5];
        if(showChromonly == false){
          o["segWL"]=Number(newL.split(":")[0]);
          o["segWR"]=Number(newL.split(":")[1]);
          // added by jinmou update segL/R
          o["segL"]= String(Number(o["segWL"]) - Number(wholeGenome["chr" + chrom + "_length"]));
          o["segR"]= String(Number(o["segWR"]) - Number(wholeGenome["chr" + chrom + "_length"]));
        } else {
          o["segL"]=newL.split(":")[0];
          o["segR"]=newL.split(":")[1];			
          // added by jinmou update segWL/WR
          o["segWL"]= String(Number(o["segL"]) + Number(wholeGenome["chr" + chrom + "_length"]));
          o["segWR"]= String(Number(o["segR"]) + Number(wholeGenome["chr" + chrom + "_length"]));
        }
        o["callType"]= newL.split(":")[4];
        o["numCopies"]= Number(newL.split(":")[3]);
      }
      return o;
    });
  }
      

function initContextmenu(){
  const contextMenu = document.getElementById("context-menu");
      const scope = document.querySelector("body");

      const normalizePozition = (mouseX, mouseY) => {
        // ? compute what is the mouse position relative to the container element (scope)
        let {
          left: scopeOffsetX,
          top: scopeOffsetY,
        } = scope.getBoundingClientRect();
        
        scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX;
        scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY;
       
        const scopeX = mouseX - scopeOffsetX;
        const scopeY = mouseY - scopeOffsetY;

        // ? check if the element will go out of bounds
        const outOfBoundsOnX =
          scopeX + contextMenu.clientWidth > scope.clientWidth;

        const outOfBoundsOnY =
          scopeY + contextMenu.clientHeight > scope.clientHeight;

        let normalizedX = mouseX;
        let normalizedY = mouseY;

        // ? normalize on X
        if (outOfBoundsOnX) {
          normalizedX =
            scopeOffsetX + scope.clientWidth - contextMenu.clientWidth;
        }

        // ? normalize on Y
        if (outOfBoundsOnY) {
          normalizedY =
            scopeOffsetY + scope.clientHeight - contextMenu.clientHeight;
        }

        return { normalizedX, normalizedY };
      };
	  //////////////////
	  var element = document.getElementById('svgcontainer'); //replace elementId with your element's Id.
var rect = element.getBoundingClientRect();
var elementLeft,elementTop; //x and y
var scrollTop = document.documentElement.scrollTop?
                document.documentElement.scrollTop:document.body.scrollTop;
var scrollLeft = document.documentElement.scrollLeft?                   
                 document.documentElement.scrollLeft:document.body.scrollLeft;
elementTop = rect.top+scrollTop;
elementLeft = rect.left+scrollLeft;

	  
	  //////////////////

      scope.addEventListener("contextmenu", (event) => {
        event.preventDefault();
		

        const { clientX: mouseX, clientY: mouseY } = event;

        const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY);
		if ((normalizedY>=elementTop)||(normalizedX>=elementLeft)) return false;

        contextMenu.classList.remove("visible");

        contextMenu.style.top = `${normalizedY}px`;
        contextMenu.style.left = `${normalizedX}px`;

        setTimeout(() => {
          contextMenu.classList.add("visible");
        });
      });

      scope.addEventListener("click", (e) => {
        // ? close the menu if the user clicks outside of it
        if (e.target.offsetParent != contextMenu) {
          contextMenu.classList.remove("visible");
        }
      });

}
function initDropShadow() {
    var defs = d3.select('svg').append("defs");

    var filter = defs.append("filter")
        .attr("id", "drop-shadow")
        .attr("height", "130%");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 5)
        .attr("result", "blur");

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter.append("feOffset")
        .attr("in", "blur")
        .attr("dx", 5)
        .attr("dy", 5)
        .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");

}
// gridlines in x axis function
function makeXgridlines(x) {
	return d3.axisBottom(x).ticks(5)
}
// gridlines in y axis function
function makeYgridlines(y, tickSize = 5) {
	return d3.axisLeft(y).ticks(tickSize)
}
/****
 * give a key group by and return array
 ****/
function groupBySubArm(objectArray, groupKey, valueKey = null, chromKey = null) {
	return objectArray.reduce((acc, obj) => {
		const key = obj[groupKey] + ":" + obj[chromKey];
		if(!acc[key]) {
			acc[key] = [];
		}
		// Add object to list for given key's value
		if(valueKey) acc[key].push(obj[valueKey]);
		else acc[key].push(obj);
		return acc;
	}, {});
}
/****
 * give a key group by and return array
 ****/
function groupBy(objectArray, groupKey, valueKey = null) {
	return objectArray.reduce((acc, obj) => {
		const key = obj[groupKey];
		if(!acc[key]) {
			acc[key] = [];
		}
		// Add object to list for given key's value
		if(valueKey) acc[key].push(obj[valueKey]);
		else acc[key].push(obj);
		return acc;
	}, {});
}

function groupBy(objectArray, index, valueKey = null) {
	  return objectArray.reduce((acc, obj) => {
  		const key = obj[groupKey];
		if(!acc[key]) {
			acc[key] = [];
		}
		// Add object to list for given key's value
		if(valueKey) acc[key].push(obj[valueKey]);
		else acc[key].push(obj);
		return acc;
	}, {});
}

['a', 'b', 'c'].reduce((a, v) => ({ ...a, [v]: v}), {}) 


/****
 * give a chr by segR segLen tumorNumCopies_ciHigh segL
 ****/
function getAllSegmentByChr(e){return e.reduce((e,r)=>{const g=r.segL+":"+r.segR+":"+r.segLen+":"+r.tumorNumCopies_ciHigh+":"+r.callType+":"+r.segChrom;return e[g]||(e[g]=[]),e[g].push(r),e},{})}


function constructSegElementV2(segElements) {
	var div = "";
	$("#segForm").html(div);
	div += '<div class="row">';
	div += '<label type "text" class="col-sm-1 col-form-label"> Chrom </label>';
	div += '<label type "text" class="col-sm-3 col-form-label"> Segment Start Position </label>';
	div += '<label type "text" class="col-sm-3 col-form-label"> Segment End Position </label>';
	div += '<label type "text" class="col-sm-2 col-form-label"> Copy Number </label>';
	div += '<label type "text" class="col-sm-2 col-form-label"> Call Type </label>';
	div += '<label type "text" class="col-sm-1 col-form-label"> Discard </label>';
	div += '</div>';

	for(var i = 0; i < segElements.length; i++) {
		var obj = segElements[i];
		var segleft, segright;
		if(showChromonly == true) {
			segleft = obj["segL"];
			segright = obj["segR"];
		} else {
			segleft = obj["segWL"];
			segright = obj["segWR"];
		}
		div += '<div class="form-group row">';
		div += '<input type="text" class="col-sm-1 col-form-label" value='+ obj["segChrom"] +'  placeholder="Chrom">';
		div += '<input type="text" class="col-sm-3 col-form-label" value=' + segleft + '  placeholder="From">';
		div += ' <input type="text" class="col-sm-3 col-form-label" value=' + segright + '  placeholder="to"> ';
		div += ' <input type="text" class="col-sm-2 col-form-label" value=' + obj["numCopies"] + '  placeholder="Copy Number"> ';
		div += ' <input type="text" class="col-sm-2 col-form-label" value=' + obj["callType"] + '  placeholder="Call type"> ';
    // todo assign id
		div += ' <input type="checkbox" class="col-sm-1 col-form-label" value=' + obj["DT_RowId"] + '>';
		div += '</div>';
	}
	$("#segForm").html(div);
}



function getAllSelectionsV1(start) {
  let dataPosRange =  start;
  // temp fix
  if (showChromonly) {
    if (dataPosRange[1] == getChromLength(defaultChromNum)[1]) {
      dataPosRange[1] *= 2;
    }
  }
	/*
	  plot segment data,using the clip to cut the data
	*/
	let cloneWholegenomSegdata = JSON.parse(JSON.stringify(gwholegenomSegdata));
	let wholegenomSegdata;// = chrom == -1 ? cloneWholegenomSegdata : cloneWholegenomSegdata.filter(o=>o.segChrom == chrom);
	if(!showChromonly) {
		wholegenomSegdata = cloneWholegenomSegdata.filter(function(o) {
			return (Number(o.segWR) <= dataPosRange[1]) && (Number(o.segWL) >= dataPosRange[0]);
		});
	} else {
		wholegenomSegdata = cloneWholegenomSegdata.filter(function(o) {
			// return((Number(o.segL) >= dataPosRange[0]) && (Number(o.segR) <= dataPosRange[1])); 
      return o.segChrom == defaultChromNum && (
            ((Number(o.segR) <= dataPosRange[1]) && (Number(o.segL) >= dataPosRange[0])));
		})
	}
  console.log(wholegenomSegdata)
	constructSegElementV2(wholegenomSegdata);
}

function updateExtent(startPos,endPos){
    if(showChromonly == false) {
		var chromNum = getChromByLocation(startPos, endPos);
		document.getElementById("chromNumber").innerHTML = chromNum;
	} else {
		document.getElementById("chromNumber").innerHTML = "chr" + defaultChromNum + ":";
	}
    document.getElementById("from").innerHTML = startPos.toLocaleString();
	document.getElementById("to").innerHTML = endPos.toLocaleString();
	document.getElementById("extent").innerHTML = Math.trunc(endPos - startPos).toLocaleString();
}


/****
 * convert from cnv segment to screen pixel
 ****/
function constructPixelPosition(cnvStartLocation, cnvEndLocation, chromStartLocation, chromEndLocation, minCopy) {
	var length = chromEndLocation - chromStartLocation;
	var a = x(cnvStartLocation);
	var b = x(cnvEndLocation);
	b = b - a < 1 ? a + 1 : b;
	var h = y(minCopy); //-2 + cnvPlotHeight / 10 * minCopy;
	p = "M " + a + " " + h + " L " + b + " " + h;
	return [p, a, b, h];
}

function constructPixelPositionByAxis(cnvStartLocation, cnvEndLocation, chromStartLocation, chromEndLocation, minCopy, xaxis, yaxis) {
	var length = chromEndLocation - chromStartLocation;
	var a = xaxis(cnvStartLocation);
	var b = xaxis(cnvEndLocation);
	a = a<0?0:a;
	b = b - a < 1 ? a + 1 : b;
	var h = yaxis(minCopy); //-2 + cnvPlotHeight / 10 * minCopy;
	p = "M " + a + " " + h + " L " + b + " " + h;
	return [p, a, b, h];
}

function constructPathByAxis(xstart, xend, y, xaxis, yaxis) {
	var a = xaxis(xstart);
	var b = xaxis(xend);
	a = a < 0 ? 0 : a;
	b = b - a < 1 ? a + 1 : b;
	var h = yaxis(y);
	return "M " + a + " " + h + " L " + b + " " + h;
}