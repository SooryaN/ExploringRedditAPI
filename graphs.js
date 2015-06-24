function graph(ctx_id){ 
	this.ctx_id = document.getElementById(ctx_id);
	this.ctx = this.ctx_id.getContext("2d");
	this.padding;
	this.color;
	this.data={};
	this.setData=setData;
	function setData(data){
		this.data=data;
		console.log(this.data);
	}
	this.setConfig=setConfig;
	function setConfig(padding,color){
		this.padding=padding;
		this.color=color;
	}
	this.render=render;
	function render(){
		this.ctx.fillStyle="#FF0000";
		var width = this.ctx_id.width;
		var height = this.ctx_id.height;
		var w_offset = 20;
		height=height-w_offset;//axis label
		var padding = this.padding;
		var num_items = this.data.length;
		var bar_width = (width/num_items)-padding;//-10 for padding
		console.log("bar_width: "+bar_width);
		var scale;
		for (var i = this.data.length - 1; i >= 0; i--) {
			if(scale==undefined){
				scale=this.data[i].y;
			}else if(this.data[i].y>scale){
				scale=this.data[i].y;
			}
		};
		console.log("width:"+width);
		console.log("height:"+height);
		console.log("num_items:"+num_items);
		console.log("scale:"+scale);
		var scale_counter = 0;
		for (key in this.data) {
			this.ctx.fillStyle=this.color;
			this.ctx.font = '12px Tahoma';
			this.ctx.fillRect(scale_counter+(padding/2),height-((this.data[key].y/scale)*height),bar_width,((this.data[key].y/scale)*height));
			this.ctx.fillStyle="black";
			var temp = height+13;
			this.ctx.fillText(this.data[key].x,scale_counter+padding/2,temp);
			var temp = (height-((this.data[key].y/scale)*height))+13;
			if(temp>height){temp = temp-20;}
			this.ctx.fillStyle="white";
			this.ctx.fillText(this.data[key].y,scale_counter+(padding/2)+(padding/3),temp);
			scale_counter=scale_counter+bar_width+padding;
			this.ctx.beginPath();
		    this.ctx.moveTo(0,height);
		    this.ctx.lineTo(width,height);
		    this.ctx.closePath();
		    this.ctx.strokeStyle = '#ff4500';
		    this.ctx.stroke();

		};
	}
}
