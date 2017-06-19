这个框架就是以HTML为主， 增加一些固定的DOM节点属性，这个辅助脚本会自动做一些固定的动作，
具体效果请参考index.html  

目的是增加DOM元素属性来减少或不写js代码，来达到应有的效果，减少因不同开发人员不同技术熟练度造成的位置错误。
依赖jquery 和bootstrap的css文件。  

jquery:只要用到元素的查询和事件的绑定  

bootstrap：不是美工出身，一些样式要用到，只需要min.css，其他不需要

我只是想要一个简单的网页展示


比如
表格：
div class="container text-right"  >

		<!-- 跳转按钮属性
			zqliang-btn-href 跳转链接
			zqliang-btn-type 按钮类型，先只有两个，href:跳转，edit:修改
		 -->
		<button type="button" class="zqliang-btn btn btn-primary" 
			zqliang-btn-href="http://www.baidu.com" 
			zqliang-btn-type="href">增加</button>
		<!--  删除按钮属性，先只支持ajax方式提交
			zqliang-btn-href 跳转链接
			zqliang-btn-type 按钮类型，先只有两个，href:跳转，edit:修改
			zqliang-for 表格的id值
			zqliang-btn-method 提交方式post或get
			zqliang-btn-id 以行数据的哪个字段组装参数以，号分割，先只支持单个字段
		 -->
		<button type="button" class="zqliang-btn btn btn-primary"
			zqliang-for="j_table"	
			zqliang-btn-type="delete"  
			zqliang-btn-href="http://localhost:8080/delete"
			zqliang-btn-method="post"
			zqliang-btn-id="id">删除</button>
		<!--  修改按钮属性
			zqliang-for 对应的表格id值
			zqliang-btn-href 跳转链接，现只支持get方式，参数以#{}这种方式会从行数据中拉取对应的参数
			zqliang-btn-type 按钮类型，先只有两个，href:跳转，edit:修改
		 -->
		<button type="button" class="zqliang-btn btn btn-primary" 
			zqliang-for="j_table"	
			zqliang-btn-type="edit" 
			zqliang-btn-href="http://www.baidu.com?id=#{id}">修改</button>
		<button type="button" class="zqliang-btn btn btn-primary"
			zqliang-btn-type="query">查询</button>
	</div>
	<div class="container">
		<!--  表格属性
			zqliang-table-ajax 对应的表格id值
			zqliang-table-ajax 数据ajax请求连接
			zqliang-table-ele 返回的数据体中，对应列表数据的父元素节点顺序
		 -->
		<table id="j_table" class="zqliang_table table-bordered"  
			zqliang-table-ajax="http://localhost:8384/admin/product/list" 
			zqliang-table-ele="responseObject.content">
			<thead>
				<tr>
					<!--  列属性
						zqliang_table_checkboxAll 添加到需要添加复选框的行上
						zql_col_field 数据的列名称
					 -->
					<th class="zqliang_table_checkboxAll"> <input type="checkbox" > </th>
					<th zql_col_field="id">主键</th>
					<th zql_col_field="catalogId" >名称</th>
					<th zql_col_field="productName" 	>代码</th>
					<th zql_col_field="name" >随机</th>
					<th zql_col_field="date">日期</th>
				</tr>
			</thead>
			<!-- 分页信息
					tfoot现在只能用作分页，暂时不支持自定义分页容器
					zqliang-page-size 行页数
					zqliang-page-totalPage 总页数在数据体中的位置
			-->
			<tfoot  zqliang-page-size="15" zqliang-page-totalPage="responseObject.totalPage">
				<tr><td colspan="6"></td></tr>
			</tfoot>
		</table>
	</div>
