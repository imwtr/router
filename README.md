异步路由处理，用于基础JS项目，目前为简易版，仅用于学习交流

# 使用
```javascript
  
  // 引入 router.js
  
  // 当前页面路径
  var pageR = 'abc/d';
  
  // 初始化
  var routeInstance = router.config({
      // history || hash
      history: 'history',
      baseURI: '?r=' + (pageR || 'home/index'),
      // 初始路由集合
      routes: {}
   });
    
   
    // 某些操作后，需要记住链接，进行路由处理
    function routerUpdate(params) {
        // 根据这些条件进行搜索
        fetchData(params);
            
        // 设置路由，将根据 baseURI进行拼接，保存为一条url
        routeInstance.route('&' + $.param(params), () => {
            // 恢复一些搜索条件
            setCondition();
            // 根据这些条件进行搜索
            fetchData(params);
        });
    }
    
```
