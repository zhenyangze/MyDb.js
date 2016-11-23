# MyDb.js
H5中对indexedDB的简单封装

## use使用
在页面中引用此js即可

##init 初始化
```jaascript
var dbName = 'user';
var dbVersion = '1.0';
MyIndexedDB.init(dbName, dbVersion)
```
##add 添加数据
```jaascript
var data = {
	id: 1, //统一使用id做为主键
	name: 'ceshi',
	age: 20,
	info: "test info"
};
//不带回调
//MyIndexedDB.add(data);

//带有回调
MyIndexedDB.add(data, function(dt){
	console.log(dt);
}, function() {
	console.log('error');
});
```
##getById 根据id获取数据
```jaascript
var id = 1;
//不带回调
//MyIndexedDB.getById(id);

//带有回调
MyIndexedDB.getById(id, function(dt){
	console.log(dt);
}, function(id) {
	console.log('no data, id:' + id);
});
```
##getAll 获取所有数据
```jaascript
//不带回调
//MyIndexedDB.getAll();

//带有回调
MyIndexedDB.getAll(data, function(dt){
	console.log(dt);
	//可以设置返回值控制获取的数量
	return true;涉及到游标，需要返回true
}, function() {
	console.log('No more entries');
});
```
##search 搜索数据
`range`
* IDBKeyRange.only(指定键值)
* IDBKeyRange.lowerBound(指定键值, 是否不包括指定键值)
* IDBKeyRange.upperBound(指定键值, 是否不包括指定键值)
* IDBKeyRange.bound(下限键值，上限键值，是否不包括下限键值，是否不包括上限键值)

`order`
* IDBCursor.NEXT，顺序循环；
* IDBCursor.NEXT_NO_DUPLICATE，顺序循环且键值不重复；
* IDBCursor.PREV，倒序循环；
* IDBCursor.PREV _NO_DUPLICATE，倒序循环且键值不重复。

```jaascript
//不带回调
//MyIndexedDB.search(IDBKeyRange.only(1), IDBCursor.NEXT);

//带有回调
MyIndexedDB.search(IDBKeyRange.only(1), IDBCursor.NEXT, function(dt){
	console.log(dt);
	//可以设置返回值控制获取的数量
	return true;涉及到游标，需要返回true
}, function() {
	console.log('No more entries');
});
```


##updateFieldById 修改数据某一字段
```jaascript
var id = 1;
var key = 'name';
var value = 'newName';
//不带回调
//MyIndexedDB.updateFieldById(id, key, value);

//带回调
MyIndexedDB.updateFieldById(id, key, value, function(){
	console.log('success')
}, function() {
	console.log('error');
});
```
##updateById 修改数据
```jaascript
var id = 1;
var data = {
	id: 1,
	name: 'newName',
	age: 12
};
//不带回调
//MyIndexedDB.updateById(id, data);

//带回调
MyIndexedDB.updateById(id, data, function(){
	console.log('success')
}, function() {
	console.log('error');
});
```

##deleteById 删除数据
```jaascript
var id = 1;
//不带回调
//MyIndexedDB.deleteById(id);

//带回调
MyIndexedDB.deleteById(id, function(){
	console.log('success')
}, function() {
	console.log('error');
});
```