function baf2mbaf(val) 
{
	return Math.abs(val - 0.5) + 0.5;
}

function composeProbeDataArray(res, cnv) {
	var cnC = res['cnC'];
	var cnS = res['cnS'];
	var cnD = res['cnD'];
	var cnV = cnv['cnV'];

	var bafC = res['bafC'];
	var bafS = res['bafS'];
	var bafD = res['bafD'];
	var bafT = res['bafT'];
	var bafN = res['bafN'];

	var cnCnt = cnC.length;
	if (cnCnt != cnV.length) {
		console.log("invalid cnvdata");
	}
	for (var i = 0; i < cnCnt; i++) {
		gProbeCNData.push({
			'chrom' : (cnC[i] == 23) ? 'X' : (cnC[i] == 24) ? 'Y' : String(cnC[i]),
			'start' : cnS[i],
			'end': cnS[i] + cnD[i],
            'val':cnV[i],
			'tumorNumCopies' : 2* Math.pow(2, cnV[i]) // 2* Math.pow(2, cnV[i]) => mean = Math.log2(cp/2) 
		})
	}
	cnCnt = bafC.length;
	for (var i = 0; i < cnCnt; i++) {
		gProbeBafData.push({
			'chrom' : (bafC[i] == 23) ? 'X' : (bafC[i] == 24) ? 'Y' : String(bafC[i]),
			'start' : bafS[i],
			'end': bafS[i] + bafD[i],
            'oritumorBaf':bafT[i], 
			'tumor.BAF' : bafT[i],
			'normal.BAF' : bafN[i],			
		})
	}
}

function constructProbeData()
{
	gprobeData = gprobeData.map((o) => {
    	o["wholestart"] = o['start'] + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["wholeend"] = o['end'] + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["alleleRatio"] = baf2mbaf(o["tumor.BAF"]) / baf2mbaf(o["normal.BAF"]);
		return o;
	});

	gprobeCNofTumor = gprobeCNofTumor.map((o) => {
		o["wholestart"] = o['start'] + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["wholeend"] = o['end'] + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		return o;
	});
}

function syncTableData2Plot() {
  gwholegenomSegdata = gNewWholegenomSegdata.map((o) => {
    let newObj ={};
    newObj["DT_RowId"] = o["DT_RowId"];
    newObj["seg_chrom_nm"] = o["seg_chrom_nm"];
    newObj["seg_start_pos_num"] = o["seg_start_pos_num"];
    newObj["seg_end_pos_num"] = o["seg_end_pos_num"];
    newObj["seg_type_nm"] = o["seg_type_nm"];
    newObj["cnv_call_type_nm"] = o["cnv_call_type_nm"];
    newObj["tumor_copy_number_am"] = o["tumor_copy_number_am"];;

    newObj['segChrom'] = o['seg_chrom_nm'];
    newObj['alleleRatio'] = o['allele_balance_in_tumor_rt'];
    newObj['callType'] = o['cnv_call_type_nm'].toLowerCase();
    newObj['numCopies'] = Number(o['tumor_copy_number_am']);
    newObj['oriCopyNum'] = Number(o['tumor_copy_number_am']);
    newObj['MEAN_LOG_COPY_RATIO'] = Math.log2(Number(o['tumor_copy_number_am'])/2) ;      
    newObj['segL'] = o['seg_start_pos_num'];
    newObj['segR'] = o['seg_end_pos_num'];    
    newObj["segWL"] = Number(newObj["segL"]) + Number(wholeGenome["chr" + newObj["segChrom"] + "_length"]);
    newObj["segWR"] = Number(newObj["segR"]) + Number(wholeGenome["chr" + newObj["segChrom"] + "_length"]);
    return newObj;
  })
}

function ajustCNVLocation() {
    gGISTICData  = gGISTICData.map((o) => {
	    o["segChrom"]=o["chr"].replace("chr","");
	    o["segL"] = o["start"];
		o["segR"] = o["end"];
		o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chr"].replace("chr","") + "_length"]);
		o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chr"].replace("chr","") + "_length"]);
		return o;
	});
  syncTableData2Plot()
  
	ggapdata = ggapdata.map((o) => {
		o["gchromStart"] = Number(o["chromStart"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["gchromEnd"] = Number(o["chromEnd"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		return o;
	});
	gsomaticData = gsomaticData.filter((o) => { return o["TSG_OG"] != ""});
	ggermlineData = ggermlineData.filter((o) => { return o["TSG_OG"] != ""});
	
	constructProbeData();

	gsomaticData = gsomaticData.map((o) => {
		o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["gPOS"] = Number(o["pos"]) + Number(wholeGenome["chr" + o["chrom"].replace("chr", "") + "_length"]);
		return o;
	});

	ggermlineData = ggermlineData.map((o) => {
		o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["gPOS"] = Number(o["pos"]) + Number(wholeGenome["chr" + o["chrom"].replace("chr", "") + "_length"]);
		return o;
	});

	gfusionData = gfusionData.filter((o) => {
		return((o["gene_5p"] != "") && (o["gene_3p"] != ""));
	});

	grnaData = grnaData.map((o) => {
		o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
		o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chrom"] + "_length"]);
        if (o['TPM'] == 0) {
            o['logTPM'] = 0;
        } else {
            o['logTPM'] = Math.log2(o['TPM']);
        }
		return o;
	});

	gfusionData = gfusionData.filter((o) => {
		return((o["is_preferred_transcript_3p"] == 1) && (o["is_preferred_transcript_5p"] == 1))
	});

	gfusionData = gfusionData.filter((o) => {
		if (o["segL"] == null ||  o["seg3pL"] == null) {
			return false;
		}
		o["w_pos_3p"] = Number(o["pos_3p"]) + Number(wholeGenome["chr" + o["chrom_3p"] + "_length"]);
		o["w_pos_5p"] = Number(o["pos_5p"]) + Number(wholeGenome["chr" + o["chrom_5p"] + "_length"]);
			
		o["segWL"] = Number(o["segL"]) + Number(wholeGenome["chr" + o["chrom_5p"] + "_length"]);
		o["segWR"] = Number(o["segR"]) + Number(wholeGenome["chr" + o["chrom_5p"] + "_length"]);

		o["seg3pWL"] = Number(o["seg3pL"]) + Number(wholeGenome["chr" + o["chrom_3p"] + "_length"]);
		o["seg3pWR"] = Number(o["seg3pR"]) + Number(wholeGenome["chr" + o["chrom_3p"] + "_length"]);						
		return true;
	});
}