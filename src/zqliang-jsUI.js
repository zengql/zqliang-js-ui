let zql;
$(function(){
	
	/**
	* 元素别名
	*/
	var zqliang_table = "zqliang_table"; //表格
	var zqliang_dialog= "zqliang_dialog";//弹出框
	var zqliang_select= "zqliang_select";//下拉菜单

	/**
	* 表格对象
	*/
	function Table(){
		this.id = "";

		this.page = {
			curentPage : 1,
			pageSize : 15,
			getPageParam : function() {
				return "pageSize="+pageSize+"&curentPage="+curentPage;
			},
			genrator : function(data, tableEle, table) {//根据数据显示分页数据
				var tfoot = $(tableEle).children("tfoot");
				if (tfoot.length <1 || !tfoot.attr("zqliang-page-total")) {
					return;
				}
				let total = tfoot.attr("zqliang-page-total");
				let totalArray = total.split(".");
				let dataArray = data;
				for (var i = 0; i<totalArray.length; i++) {
					dataArray =dataArray[totalArray[i]];
				}

				//如果在第一页不计算页数
				if (dataArray && dataArray/this.pageSize<2) {
					return;
				}
				var content = tfoot.children().children();
				content.html("<div><ul class='zqliang-pageable'><li  onclick=\"zql.table.load('"+this.curentPage+"','"+table.id+"')\">上一页</li><li onclick=\"alert(zqliang)\">下一页</li></ul></div>")
			}
		};

		this.init = function() {//改对象的初始化动作

		};

		this.parseTable = function(table) { //处理表格
			var ajaxUrl = $(table).attr("zqliang-table-ajax");
			if (!ajaxUrl) {//如果不存在就会添加
				return;
			}
			var tbody = $(table).children("tbody");
			if (tbody.length < 1) {
				tbody = $("<tbody></tbody>")
			}
			tbody.children().remove()
			var ths = $(table).children("thead").children().children();
			tbody.append("<tr><td colspan='"+ths.length+"'>加载数据中...</td></tr>")
			$(table).append(tbody);
			ajaxData(ajaxUrl, "", this, table);
		};
		this.succFun = function(data, thisObj) {//表格加载成功后执行的内容
			let responseData = $(thisObj).attr("zqliang-table-ele");
			let responseDataArray = responseData.split(".");
			let dataArray = data;
			for (var i = 0; i<responseDataArray.length; i++) {
				dataArray =dataArray[responseDataArray[i]];
			}
			if (!dataArray) {
				Table.errorFun(thisObj, "没有接收到响应数据！");
				return;
			}
			responseData = dataArray;

			var tbody = $(thisObj).children("tbody");
			if (tbody.length < 1) {
				tbody = $("<tbody></tbody>")
			}
			tbody.children().remove();

			//根据列设置数据
			var ths = $(thisObj).children("thead").children().children();
			if (ths.length <1) {
				return;
			}
			$.each(responseData, function(i, item){
				var tr = "<tr>";
				$.each(ths, function(i, v){
					var fieldName = $(v).attr("zql_col_field");
					if (fieldName.length) {
						tr += "<td>"+ item[fieldName]+"</td>"
					} else {
						tr += "<td></td>"
					}
				});
				tr += "</tr>"
				tbody.append(tr);
			});
			//生成分页
			this.page.genrator(data, thisObj, this);
		};

		this.errorFun = function(thisObj, msg) {//错误处理
			var ths = $(thisObj).children("thead").children().children();
			var tbody = $(thisObj).children("tbody");
			if (!msg) {
				msg = "数据加载失败";
			}
			if (tbody.length > 0) {
				tbody.find("td").html(msg);
			} else {
				$(thisObj).append("<tbody><tr><td colspan='"+ths.length+"'>"+msg+"</td></tr></tbody>")	
			}
		};

		this.load = function() {//重新加载
			this.parseTable($("#"+this.id));
		};

	}
	
	
	var seq = 0;
	/**
	* main 对象
	*/
	let zqliang = {
		init	:	function(){//总览的厨师换
			zqliang.table.init();//表格的初始化动作
		},
		table   :   {
			init : function(){//初始化函数
				var tables = $(".zqliang_table");
				if (tables.length <1) {
					return;
				}
				//循环处理
				$.each(tables, function(i, v) {
					var ths = $(v).children("thead").children().children();
					if (ths.length <1) {
						return;
					}
					
					//加载数据
					var table = new Table();
					$(v).attr("zqliang-seq", "table"+seq);
					if ($(v).attr("id")) {
						table.id = $(v).attr("id");
					} else {
						$(v).att("id", "table"+seq)
						table.id = "table"+seq;
					}
					zqliang[table.id] = table;

					table.parseTable(v, ths)
					seq+=1;
				});
			},
			load : function(curentPage, tableSeq) {
				var table  = zqliang[tableSeq];
				if (!table) {
					return;
				}
				table.load();
			}
		}
	}
	
	//此处会统一调用
	zqliang.init();//初始化函数
	

	zql =  zqliang;
	
	
	/**
	* ajax动态加载数据
	* url ： 	url地址
	* data:	 	请求参数
	* activeObj:  活动的对象
	* 
	* obj :     调用此方法的对象
	*/
	function ajaxData(url, data, activeObj, obj) {
		/*$.ajax({
			url		:	url,
			type	:	"post",
			data	:	data,
			dataType:	"json",
			success	:	function(responseData) {
				if (succFun) {
						succFun(responseData, obj);
				}
			}, 
			error 	: function() {
				if (errorFun) {
						errorFun(obj);
				}				
			}
		});*/
		var dta = {
			"msg": "查询成功",
			"responseObject": {
				"totalSize": 19,
				"totalPage": 2,
				"pageSize": 15,
				"curentPage": 0,
				"content": [{
					"catalogId": "15",
					"advert": "产品1",
					"addDatetime": 1494923166000,
					"id": 26,
					"temps": "3",
					"productName": "产品1"
				},
				{
					"catalogId": "14",
					"advert": "胜多负少",
					"addDatetime": 1494923211000,
					"id": 27,
					"temps": "3",
					"productName": "产品2"
				},
				{
					"catalogId": "17",
					"advert": "123",
					"addDatetime": 1494923222000,
					"id": 28,
					"temps": "",
					"productName": "产品3"
				},
				{
					"catalogId": "16",
					"advert": "123",
					"addDatetime": 1494923231000,
					"id": 29,
					"temps": "3",
					"productName": "产品4"
				},
				{
					"catalogId": "13",
					"advert": "123",
					"addDatetime": 1493478351000,
					"id": 30,
					"temps": "",
					"productName": "产品5"
				},
				{
					"catalogId": "10",
					"advert": "12",
					"addDatetime": 1494923243000,
					"id": 31,
					"temps": "3",
					"productName": "产品6"
				},
				{
					"catalogId": "14",
					"advert": "123",
					"addDatetime": 1494923254000,
					"id": 32,
					"temps": "3",
					"productName": "产品7"
				},
				{
					"catalogId": "",
					"advert": "sdfsd",
					"addDatetime": 1493604557000,
					"id": 33,
					"temps": "",
					"productName": "shipin1"
				},
				{
					"catalogId": "",
					"advert": "312321",
					"addDatetime": 1493604564000,
					"id": 34,
					"temps": "",
					"productName": "21321"
				},
				{
					"catalogId": "19",
					"advert": "sdfds",
					"addDatetime": 1493605006000,
					"id": 35,
					"temps": "3",
					"productName": "视频1"
				},
				{
					"catalogId": "27",
					"advert": "11",
					"addDatetime": 1493651987000,
					"id": 36,
					"temps": "3",
					"productName": "正式产品1"
				},
				{
					"catalogId": "30",
					"advert": "111",
					"addDatetime": 1493652014000,
					"id": 37,
					"temps": "3",
					"productName": "正式产品2"
				},
				{
					"catalogId": "29",
					"advert": "123123",
					"addDatetime": 1493652576000,
					"id": 38,
					"temps": "3",
					"productName": "正式产品2"
				},
				{
					"catalogId": "26",
					"advert": "额温柔",
					"addDatetime": 1493804015000,
					"id": 39,
					"temps": "3",
					"productName": "预约1"
				},
				{
					"catalogId": "26",
					"advert": "123",
					"addDatetime": 1493804067000,
					"id": 40,
					"temps": "",
					"productName": "预约2"
				}]
			},
			"isSuccess": "1"
		}
						activeObj.succFun(dta, obj);
	}
	
});