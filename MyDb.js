(function(win){
    var MyIndexedDb = {};

    var indexedDB = win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB;
    MyIndexedDb.db = indexedDB;

    MyIndexedDb.init = function (dbName, dbVersion) {
        MyIndexedDb.dbName = dbName;
        MyIndexedDb.dbVersion = dbVersion;

        var request = MyIndexedDb.db.open(dbName, dbVersion);
        request.onsuccess = function(e) {
            console.log("open success");
            MyIndexedDb.db = request.result;
        };
        request.onupgradeneeded = function(e) {
            MyIndexedDb.db = e.target.result;
            MyIndexedDb.indexedDB.objStore = MyIndexedDb.db.createObjectStore(MyIndexedDb.dbName, {keyPath: "id"});
        }
        request.onfailure = function(e) {
            console.log("connect db error");
        }
    };

    /**
     * 添加数据
     *
     * @param data
     *
     * @return 
     */
    MyIndexedDb.add = function () {
        var data = arguments[0] ? arguments[0] : '';
        if (data == '') {
            return false;
        }

        var successCallback = arguments[1] ? arguments[1] : (function(data){console.log("add success,", data)});
        var errorCallback = arguments[2] ? arguments[2] : (function(){console.log("add fail,", data)});

        var transaction = MyIndexedDb.db.transaction(MyIndexedDb.dbName, 'readwrite');
        var objStore = transaction.objectStore(MyIndexedDb.dbName);
        var request = objStore.add(data);
        request.onsuccess = function(e) {
            (successCallback && typeof(successCallback) === "function") && successCallback(data);
        };
        request.onerror = function (e) {
            (errorCallback && typeof(errorCallback) === "function") && errorCallback(data);
        };

    };

    /**
     * 根据索引id获取信息
     *
     * @param id
     *
     * @return 
     */
    MyIndexedDb.getById = function() {
        var id = arguments[0] ? arguments[0] : '';
        if (id == '') {
            return false;
        }
        var successCallback = arguments[1] ? arguments[1] : (function(data){console.log(data)});
        var errorCallback = arguments[2] ? arguments[2] : (function(id){console.log("get error, id:" + id)});

        var transaction = MyIndexedDb.db.transaction([MyIndexedDb.dbName]);
        var objectStore = transaction.objectStore(MyIndexedDb.dbName);
        var request = objectStore.get(id);

        request.onerror = function (e) {
            (errorCallback && typeof(errorCallback) === "function") && errorCallback(id);
        };
        request.onsuccess = function(event) {
            if(request.result) {
                (successCallback && typeof(successCallback) === "function") && successCallback(request.result);
            } else {
                console.log("Kenny couldn't be found in your database!");
            }
        };
    };

    /**
     * 获取所有数据
     *
     * @return 
     */
    MyIndexedDb.getAll = function () {
        var hasDataCallback = arguments[0] ? arguments[0] : (function(data){console.log(data); return true;});
        var noDataCallback = arguments[1] ? arguments[1] : (function(){console.log("No more entries!")});
        var objectStore = MyIndexedDb.db.transaction(MyIndexedDb.dbName).objectStore(MyIndexedDb.dbName);
        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if(hasDataCallback && typeof(hasDataCallback) === "function"){
                    var result = hasDataCallback(cursor);
                    if (result) {
                        cursor.continue();
                    }
                } 
        }
        else {
            (noDataCallback && typeof(noDataCallback) === "function") && noDataCallback();
        }
    };
};

    /**
     * 范围：
     *（1）匹配等于指定键值的记录：var range = IDBKeyRange.only(指定键值)
     *（2）匹配小于指定键值的记录：var range = IDBKeyRange.lowerBound(指定键值, 是否不包括指定键值)
     *（3）匹配大于指定键值的记录：var range = IDBKeyRange.upperBound(指定键值, 是否不包括指定键值)
     *（4）匹配指定范围内的记录：var range = IDBKeyRange.bound(下限键值，上限键值，是否不包括下限键值，是否不包括上限键值
     * 例如：
     * // 只取得当前索引的值为110的数据  
     * IDBKeyRange.only("110");  
     * // 只取得当前索引的值大于110，并且不包括110的数据  
     * IDBKeyRange.lowerBound("110", true);  
     * // 只取得当前索引的值小于110，并且包括110的数据  
     * IDBKeyRange.upperBound("110", false);  
     * // 取得当前索引的值介于110和120之间，并且包括110，但不包括120的数据  
     * IDBKeyRange.bound("110", "120", false, true);   
     */
    /**
     * 顺序参数：
     * IDBCursor.NEXT，顺序循环；
     * IDBCursor.NEXT_NO_DUPLICATE，顺序循环且键值不重复；
     * IDBCursor.PREV，倒序循环；
     * IDBCursor.PREV _NO_DUPLICATE，倒序循环且键值不重复。
     */
    /**
     * 条件搜索数据
     *
     * @param range
     * @param order
     *
     * @return 
     */
    MyIndexedDb.search = function(range, order) {
        var objectStore = MyIndexedDb.db.transaction(MyIndexedDb.dbName).objectStore(MyIndexedDb.dbName);
        var request = objectStore.openCursor(range, order);
        request.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                console.log(cursor.value);
                cursor.continue();
            }
            else {
                console.log("No more entries!");
            }
        };
    };

    /**
     * 根据id更新某字段
     *
     * @param id
     * @param key
     * @param value
     *
     * @return 
     */
    MyIndexedDb.updateFieldById = function (id, key, value) {
        var id = arguments[0] ? arguments[0] : '';
        var id = arguments[1] ? arguments[1] : '';
        var id = arguments[2] ? arguments[2] : '';
        if (id == '' || key == '' || value == '') {
            return false;
        }

        var successCallback = arguments[3] ? arguments[3] : (function(id){console.log("update success, id:"+id)});
        var errorCallback = arguments[4] ? arguments[4] : (function(id){console.log("update fail, id:"+id)});
        var objectStore = MyIndexedDb.db.transaction(MyIndexedDb.dbName, 'readwrite').objectStore(MyIndexedDb.dbName);
        var ret = objectStore.get(id);
        var dataInfo;
        ret.onsuccess=function(e){
            dataInfo = e.target.result;
            dataInfo[key] = value;
        };
        var request = objectStore.put(dataInfo);
        request.onsuccess = function(e) {
            (successCallback && typeof(successCallback) === "function") && successCallback(id);
        };
        request.onerror = function (e) {
            (errorCallback && typeof(errorCallback) === "function") && errorCallback(id);
        };

    };

    /**
     * 根据id更新数据
     *
     * @param id
     * @param data
     *
     * @return 
     */
    MyIndexedDb.updateById = function (id, data) {
        var id = arguments[0] ? arguments[0] : '';
        if (id == '') {
            return false;
        }
        var data = arguments[1] ? arguments[1] : {};

        var successCallback = arguments[2] ? arguments[2] : (function(id){console.log("update success, id:"+id)});
        var errorCallback = arguments[3] ? arguments[3] : (function(id){console.log("update fail, id:"+id)});

        var objectStore = MyIndexedDb.db.transaction(MyIndexedDb.dbName, 'readwrite').objectStore(MyIndexedDb.dbName);
        var request = objectStore.put(data);
        request.onsuccess = function(e) {
            (successCallback && typeof(successCallback) === "function") && successCallback(id);
        };
        request.onerror = function (e) {
            (errorCallback && typeof(errorCallback) === "function") && errorCallback(id);
        };
    };

    /**
     * 根据id删除数据
     *
     * @param id
     * @param data
     *
     * @return 
     */
    MyIndexedDb.deleteById = function () {
        var id = arguments[0] ? arguments[0] : '';
        if (id == '') {
            return false;
        }
        var successCallback = arguments[1] ? arguments[1] : (function(id){console.log("delete success, id:"+id)});
        var errorCallback = arguments[2] ? arguments[2] : (function(id){console.log("delete fail, id:"+id)});
        var objectStore = MyIndexedDb.db.transaction(MyIndexedDb.dbName, 'readwrite').objectStore(MyIndexedDb.dbName);
        var request = objectStore.delete(id);
        request.onsuccess = function(e) {
            (successCallback && typeof(successCallback) === "function") && successCallback(id);
        };
        request.onerror = function (e) {
            (errorCallback && typeof(errorCallback) === "function") && errorCallback(id);
        };
    };

    win.MyIndexedDB = MyIndexedDb;
}(window))
