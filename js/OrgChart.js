class OrgChart
{
	constructor(orgChart, setup)
	{
		this.orgChart = orgChart;
		//$("#"+orgChart.id).css({position: 'relative'});
		this.setup = setup;
		this.update();
	}

	updateNodeList()
	{
		//------------ Node list -----------//
		// Child of each node
		let nodeList = [];
		let nodes = this.setup.nodes;

		for(let i=0;i<nodes.length;i++)
		{
			nodeList.push([]);
		}

		for(let i=0;i<nodes.length;i++)
		{
			let node = nodes[i];
			if(node.pid!=null)
				nodeList[node.pid].push(node.id);
		}
		this.nodeList = nodeList;
		//------------ Node level -----------//
		// Level of each node
		let nodeLevel = [];

		for(let n=0;n<nodes.length;n++)
		{
			nodeLevel.push(0);
		}
		for(let n=0;n<nodes.length;n++)
		{
			let id = nodes[n].id;
			let node = this.getNodeById(id); 
			let nodeId = this.orgChart.id+id;
			let pid = node.pid;
			if(node.pid != null)
				nodeLevel[id] = nodeLevel[pid]+1;
			else
				nodeLevel[id] = 0;
		}
		this.nodeLevel = nodeLevel;
	}

	update()
	{
		this.sortNodes();
		this.updateNodeList();

		// Class parameters
		let nodes = this.setup.nodes;
		let orgChart = this.orgChart;
		let config = this.setup.config;
		orgChart.innerHTML="";

		// Width/Height
		let widthDiv = config.width;
		let heightDiv = config.height;
		let widthN = config.widthNode; 
		let heightN = config.heightNode; 

		let nodeLevel = this.nodeLevel;
		let nodeX = [];
		let parentCurrWidth = []

		for(let i=0;i<nodes.length;i++)
		{
			parentCurrWidth.push(0);
			nodeX.push(0);
		}

			document.getElementById("test").innerHTML+=
			'<div id="nodeId3"class="draggable nodeBlock">\
				<i class="orgChartNodeMove fa fa-arrows-alt"></i>\
				<i class="orgChartNodeEdit fa fa-pencil"></i>\
				<p class="orgChartNodeText">testing</p>\
			</div>';
		for(let n=0;n<nodes.length;n++)
		{
			let id = nodes[n].id;
			let node = this.getNodeById(id);
			let nodeIdHTML = orgChart.id+id;
			let y = nodeLevel[id]*(heightN+config.margin*2) + heightN/2;
			let x = 0;
			if(node.pid==null)
			{
				x = widthDiv/2+this.relativeX(node.id);
				nodeX[node.id] = x;
			}
			else
			{
				let parentWidth = this.maximumWidth(node.pid);
				let currWidth = this.maximumWidth(node.id);
				x = nodeX[node.pid] - parentWidth/2 + parentCurrWidth[node.pid] + currWidth/2;// + this.relativeX(node.id);
				nodeX[node.id] = nodeX[node.pid] - parentWidth/2 + parentCurrWidth[node.pid] + currWidth/2;
				parentCurrWidth[node.pid] += currWidth;
			}

			//document.getElementById("test").innerHTML+=
			orgChart.innerHTML+=
			'<div id="'+nodeIdHTML+'"class="draggable nodeBlock">\
				<i class="orgChartNodeMove fa fa-arrows-alt"></i>\
				<i class="orgChartNodeEdit fa fa-pencil"></i>\
				<p class="orgChartNodeText">'+node.name+'</p>\
			</div>';

			//$("#"+nodeIdHTML).css('position', 'absolute');
			//$("#"+nodeIdHTML).css('top', parseInt(y-heightN/2)+'px');
			//$("#"+nodeIdHTML).css('left', parseInt(x-widthN/2)+'px');
			//$("#"+nodeIdHTML).width(widthN);
			//$("#"+nodeIdHTML).height(heightN);

			$("#"+nodeIdHTML).draggable({
				handle: "i.orgChartNodeMove",
				revert : function(event, ui) {
					$(this).data("uiDraggable").originalPosition = {
						top : 0,
						left : 0
					};
					return !event;
				}
			});
		}
		this.drawLines();
	}

	drawLines()
	{
		// Class parameters
		let nodes = this.setup.nodes;
		let orgChart = this.orgChart;
		let config = this.setup.config;

		let lineStyle = "2px solid black";
		let lineRadius = 20;

		for(let n=0;n<nodes.length;n++)
		{
			let id = nodes[n].id;

			let nodeIdHTML = orgChart.id+id;
			let heightN = $("#"+nodeIdHTML).height();
			let widthN = $("#"+nodeIdHTML).width();

			let x = parseInt($("#"+nodeIdHTML).position().left+widthN/2);
			let y = parseInt($("#"+nodeIdHTML).position().top+heightN/2);

			for(let i=0;i<this.nodeList[id].length;i++)
			{
				let cid = this.nodeList[id][i];
				let childNodeIdHTML = orgChart.id+cid;
				let cx = parseInt($("#"+childNodeIdHTML).position().left+widthN/2);
				let cy = parseInt($("#"+childNodeIdHTML).position().top+heightN/2);

				if(cx>x)
				{
					orgChart.innerHTML = '<div style="position:absolute;\
											left:'+x+'px;\
											top:'+y+'px;\
											height:'+(cy-y).toString()+'px;\
											width:'+(cx-x).toString()+'px;\
											border-top:'+lineStyle+';\
											border-right:'+lineStyle+';\
											border-radius:'+lineRadius+'px;\
											z-index: -1;"></div>'+orgChart.innerHTML;
				}else if(cx<x){
					orgChart.innerHTML = '<div style="position:absolute;\
											left:'+cx+'px;\
											top:'+y+'px;\
											height:'+(cy-y).toString()+'px;\
											width:'+(x-cx).toString()+'px;\
											border-top:'+lineStyle+';\
											border-left:'+lineStyle+';\
											border-radius:'+lineRadius+'px;\
											z-index: -1;"></div>'+orgChart.innerHTML;
				}else{
					orgChart.innerHTML = '<div style="position:absolute;\
											left:'+x+'px;\
											top:'+y+'px;\
											height:'+(cy-y).toString()+'px;\
											width:0px;\
											border-left:'+lineStyle+';\
											border-radius:'+lineRadius+'px;\
											z-index: -1;"></div>'+orgChart.innerHTML;
				}
			}
		}
	}

	maximumWidth(nodeId)
	{
		let nodeList = this.nodeList;

		let config = this.setup.config;
		let widthN = config.widthNode; 
		let margin = config.margin;

		if(nodeList[nodeId].length==0)		
		{
			return widthN+margin*2;
		}
		else
		{
			let sumWidth = 0;
			for(let i=0;i<nodeList[nodeId].length;i++)
			{
				sumWidth+=this.maximumWidth(nodeList[nodeId][i]);
			}
			return sumWidth;
		}
	}

	relativeX(nodeId)
	{
		let nodeList = this.nodeList;

		let config = this.setup.config;
		let widthN = config.widthNode; 
		let margin = config.margin;
		
		if(nodeList[nodeId].length==0)		
		{
			return 0;
		}
		else
		{
			let widths = [];
			for(let i=0;i<nodeList[nodeId].length;i++)
			{
				widths.push(this.maximumWidth(nodeList[nodeId][i]));
			}
			let sumR = 0;
			for(let i=0;i<parseInt(widths.length/2);i++)
			{
				sumR+=widths[i];
			}
			if((widths.length)%2==0)
			{
				let result = sumR-this.maximumWidth(nodeId)/2;
				return result;
			}
			else
			{
				let result = 0;// (sumR+widths[parseInt(widths.length/2)+1]/2)-this.maximumWidth(nodeId)/2;
				return result;
			}
		}

	}

	getNodeById(id)
	{
		let nodes = this.setup.nodes;
		for(let n=0;n<nodes.length;n++)
		{
			if(nodes[n].id==id)
				return nodes[n];
		}
	}

	sortNodes()
	{
		let nodes = this.setup.nodes;

		for(let i=0;i<nodes.length;i++)
		{
			let level = 0;
			let nextNode = nodes[i];
			while(nextNode.pid != null)
			{
				level++; 
				nextNode = this.getNodeById(nextNode.pid);
			}
			nodes[i]["level"]=level;
		}

		var byProperty = function(prop) {
			return function(a,b) {
				return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
			};
		};

		nodes.sort(byProperty("level"));
	}
}

function dragStart(event) {
	var dragId = event.explicitOriginalTarget.id;
	event.dataTransfer.setData("Text", dragId);
}

function allowDrop(event) {
	event.preventDefault();
}

function drop(event) {
	event.preventDefault();
	console.log(event);
 	var dragName = event.dataTransfer.getData("Text");
 	var dropName = event.originalTarget.id;
	
	var dragId = dragName.split(chart.orgChart.id)[1];
	var dropId = dropName.split(chart.orgChart.id)[1];

	console.log(dragId, dropId);
	if(dragId && dropId)
	{
		// Class parameters
		let nodes = chart.setup.nodes;
		let orgChart = chart.orgChart;
		let config = chart.setup.config;

		let node = chart.getNodeById(dragId);

		node.pid = parseInt(dropId); 
		chart.update();
	}
}
