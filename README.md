现在只是一个初步想法，现有的JSui框架基本上完全依靠js来创建，以js为主，
有可能我一开始学习网页技术的时候从哪本书上看到过，js只是辅助html结束的，

这个框架就是以HTML为主，把一些常用的控件加到DOM元素上，js来自动调用
比如
表格：
<table class="zqliang-table" zqliang-table-ajax="http://127.0.0.1/load-data" zqliang-table-ele="responseObject">
	<tr>
		<th zql-col-field="productName" zqliang-table-col-type="checkbox"></th>
		<th zql-col-field="productName" zqliang-table-col-type="text"></th>
		<th zql-col-field="code" zqliang-table-col-type="date" zqliang-date-format="yyyy-MM-dd"></th>
		<th zql-col-field="name" zqliang-table-col-type="select" zqliang-dic-ajax="yyyy-MM-dd"></th>
		<th zql-col-field="date" zqliang-table-col-type="text"></th>
	</tr>
</table>

弹出框
<div class="zqliang-dialog">
	<div class="zqliang-dialog-title">提示</div>
	<div class="zqliang-dialog-content">模式</div>
</div>
