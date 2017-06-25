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
		this.id = "";//表格标识

		this.rowData = {};//行数据

		this.page = {
			curentPage : 1,//当前页
			totalPage: 1,//总页数
			totalSize: 0, //总页数
			pageSize :  15,
			pageNum : function(){//页码
				//最多可以有五个页码加一个最后一个和第一个
				var pageNum = new Array(7);
				pageNum[3] = this.curentPage;//最中间一个是当前页

				//计算前两页
				if (this.curentPage-2>1) {
					pageNum[2] = this.curentPage-1;
					pageNum[1] = this.curentPage-2;
					pageNum[0] = 1;
				} else if (this.curentPage ==3) {
					pageNum[2] = this.curentPage-1;
					pageNum[1] = this.curentPage-2;
				} else if (this.curentPage ==2) {
					pageNum[2] = this.curentPage-1;
				}

				//计算后两页
				if (this.curentPage+2<this.totalPage) {
					pageNum[4] = this.curentPage+1;
					pageNum[5] = this.curentPage+2;
					pageNum[6] = this.totalPage;
				} else if (this.curentPage+1==this.totalPage) {
					pageNum[4] = this.curentPage+1;
				} else if (this.curentPage+2==this.totalPage) {
					pageNum[4] = this.curentPage+1;
					pageNum[5] = this.curentPage+2;
				}
				return pageNum;
			},
			getPageParam : function(pageSize, curentPath) {
				return "pageSize="+pageSize+"&curentPage="+curentPath;
			},
			genrator : function(data, tableEle, table) {//根据数据显示分页数据
				//初始化行数据

				var tfoot = $(tableEle).children("tfoot");
				if (tfoot.length <1 || !tfoot.attr("zqliang-page-totalPage")) {
					return;
				}
				let total = tfoot.attr("zqliang-page-totalPage");
				let totalArray = total.split(".");
				let dataArray = data;
				for (var i = 0; i<totalArray.length; i++) {
					dataArray =dataArray[totalArray[i]];
				}
				this.totalPage = dataArray;
				
				var pageNum = this.pageNum();
				var ul = "";
				for (num in pageNum) {
					if (4 == num) {
						ul += "<li class='zqliang-page-num zqliang-page-active'>"+pageNum[num]+"</li>";
					} else {
						ul += "<li class='zqliang-page-num'>"+pageNum[num]+"</li>";
					}
					
				}
				var content = tfoot.children().children();
				content.html("<div><ul class='zqliang-pageable'>"+ul+"</ul></div>");

				var _page = this;

				//给分页组件添加事件
				$(".zqliang-page-num").click(function(){
					//如果是当前页不做处理
					if ($(this).hasClass("zqliang-page-active")) {
						return;
					}
					$(this).siblings().removeClass("zqliang-page-active");
					$(this).addClass("zqliang-page-active");
					table.parseTable(table, _page.getPageParam(_page.pageSize, $(this).text()));
				});
			}
		};

		this.init = function() {//改对象的初始化动作

		};

		this.parseTable = function(table, param) { //处理表格
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

			if (!param) {
				param = "";
			}
			ajaxData(ajaxUrl, param, this, table);
		};
		this.succFun = function(data, thisObj) {//表格加载成功后执行的内容
			_tableObj = this;

			let responseData = $(thisObj).attr("zqliang-table-ele");
			let responseDataArray = responseData.split(".");
			let dataArray = data;
			for (var i = 0; i<responseDataArray.length; i++) {
				dataArray =dataArray[responseDataArray[i]];
			}
			if (!dataArray) {
				_tableObj.errorFun(thisObj, "没有接收到响应数据！");
				return;
			}
			responseData = dataArray;

			var tbody = $(thisObj).children("tbody");
			if (tbody.length < 1) {
				tbody = $("<tbody></tbody>")
			}
			tbody.children().remove();
			_tableObj.rowData = {};

			//判断是否含有复选框,则给复选框添加事件
			var checkboxAll = $(thisObj).find(".zqliang_table_checkboxAll");
			if (checkboxAll.length > 0) {
				checkboxAll = checkboxAll.children();
				checkboxAll.click(function(){
					if ($(this).prop('checked') ) {
						$(".zqliang-table-checkbox").attr("checked", true);
					} else {
						$(".zqliang-table-checkbox").attr("checked", false);
					}
				});
			}

			//根据列设置数据
			var ths = $(thisObj).children("thead").children().children();
			if (ths.length <1) {
				return;
			}

			$.each(responseData, function(i, item){
				var tr = "<tr rownum='"+i+"'>";
				_tableObj.rowData["row"+i]=item;
				$.each(ths, function(i, v){
					var fieldName = $(v).attr("zql_col_field");
					if (fieldName) {
						tr += "<td>"+ item[fieldName]+"</td>"
					} else {
						if (checkboxAll.length > 0) {
							tr += "<td><input type='checkbox' class='zqliang-table-checkbox'> </td>"
						} else {
							tr += "<td></td>"	
						}
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

	/**
	* 下拉菜单
	*/
	function Select(){

	}
	

	/**
	* 按钮对象
	*/
	var btn =  {
		init : function() {
			$(".zqliang-btn").click(function(){
				var type = $(this).attr("zqliang-btn-type");
				if (!type) {
					return;
				}
				if("href"== type && $(this).attr("zqliang-btn-href")){
					location.href=$(this).attr("zqliang-btn-href");
					return;
				} else if("edit" == type) {
					btn.edit($(this));
				}
			});
		},
		edit : function(thisEle){

			var table = thisEle.attr("zqliang-for");
			if(!table || $("#"+table).length<1) {
				return;
			}
			var checkeds = $("#"+table).find(".zqliang-table-checkbox:checked");
			if (checkeds.length <1 || checkeds.length>1) {
				alert("只能选择一项！");
				return;
			}
			var rowNum = checkeds.parents("tr").attr("rownum");
			if (!rowNum) {//行号必须存在，数据根据行号获取
				return;
			}
			var href = thisEle.attr("zqliang-btn-href");
			if (!href) {
				return;
			}
			//从行数据中拿到响应的参数
			var rowData = zqliang[table].rowData["row"+rowNum];
			var strArray = href.split("#");
			href = "";
			for (item in strArray) {
				var itemStr = strArray[item];
				var end = itemStr.indexOf("}")
				if (end<0){
					href+=itemStr;
				} else {
					var key = itemStr.substring(1, end);
					key = rowData[key];
					if (!key) {
						key = "";
					}
					href += key+itemStr.substring(end+1);
				}
			}
			location.href=href;
		}
	}
	
	var seq = 0;
	/**
	* main 对象
	*/
	let zqliang = {
		init	:	function(){//总览的初始化
			//加载css
			$.each($("script"), function(i,v){
				if ($(v).attr("src").indexOf("zqliang")>-1) {
					var paths = $(v).attr("src").substring(0, $(v).attr("src").lastIndexOf("/"));
					loadCss(paths+"/zqliang-jsUI.css");
				}
			});

			this.table.init();//表格的初始化动作
			this.button.init();//表格的初始化动作
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
		},
		button : {
			init : function(){
				if($(".zqliang-btn").length < 1) {
					return;
				}
				btn.init();
			}
		}
	}
	
	//此处会统一调用
	zqliang.init();//初始化函数
	

	zql =  zqliang;


	/**
	* 动态加载js
	*/
	function loadCss(url){
		var link = document.createElement( "link" );
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		document.getElementsByTagName( "head" )[0].appendChild( link );
	}; 
	
	
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