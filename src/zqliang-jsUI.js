$(function(){
	
	/**
	* 元素别名
	*/
	var zqliang_table = "zqliang_table"; //表格
	var zqliang_dialog= "zqliang_dialog";//弹出框
	var zqliang_select= "zqliang_select";//下拉菜单
	
	
	/**
	* main 对象
	*/
	let zqliang = {
		init	:	function(){
			
		},
		table	:	function(){
			//初始化函数
			var tables = $(".zqliang_table");
			if (tables.length <1) {
				return;
			}
			//循环处理
			$.each(tables, function(i, v) {
				var ths = $(v).children("thead").children();
				if (ths.length <1) {
					return;
				}
				
				//加载数据
				parseTable(v, ths)
			});
			
		}
	}
	
	//此处会统一调用
	zqliang.init();//初始化函数
	zqliang.table();//表格的初始化动作
	
	/**
	* 分页组件
	*/
	var page = {
		pageSize	:	15,//页行数
		curentPage	:	1, //当前页
		getPageParam: 	function() {
			return "pageSize="+pageSize+"&curentPage="+curentPage;
		}
	}
	
	
	
	/**
	* 处理表格
	*/
	function parseTable(table, ths) {
		var ajaxUrl = $(table).attr("zqliang-table-ajax");
		if (!ajaxUrl) {//如果不存在就会添加
			return;
		}
		$(v).append("<tbody><tr><td colspan='"+ths.length+"'>加载数据中...</td></tr></tbody>")
	}

	
	/**
	* ajax动态加载数据
	* url ： 	url地址
	* data:	 	请求参数
	* SuccFun:  成功回调函数（会把响应数据返回）
	* errorFun: 失败回调函数
	*/
	function ajaxData(url, data, succFun, errorFun, responseNode) {
		$.ajax({
			url		:	url,
			type	:	"post",
			data	:	data,
			dataType:	"json",
			success	:	function(responseData) {
				if (succFun) {
						succFun(responseData);
				}
			}, 
			error 	: function() {
				if (errorFun) {
						errorFun();
				}				
			}
		});
	}
});