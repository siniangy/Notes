### 1：了解SQL

数据库是保存有组织的数据的容器；数据库表是某种特定类型数据的结构化清单；表由列组成，列是表中的一个字段，所有的表都是由一个或多个列组成；表中的数据是行存储的

SQL是结构化查询语句（Structured query language）的缩写，使用SQL语句来与DBMS打交道，这里用的DBMS是关系型数据库MySQL，数据库可视操作工具使用Sequel Pro，下载网址 https://sequelpro.com/test-builds

--- 

### 2：检索数据

SQL语句的最佳实践，SQL关键字比如SELECT等使用大写，对表名和列名使用小写

```sql
# 选中所有的行
SELECT * FROM Products;

# 去重
SELECT DISTINCT vend_id FROM Products;

# 这里的OFFSET指定了起始位置
SELECT prod_name FROM Products LIMIT 5 OFFSET 5; 
```

---

### 3：排序检索数据

在使用ORDER BY子句时，应该保证其是SELECT语句的最后一句，否则可能会出错

```sql
# 按照多列排序
SELECT prod_name, prod_id, prod_price FROM Products ORDER BY prod_name, prod_id;

# 按照SELECT的列位置排序 同上
SELECT prod_name, prod_id, prod_price FROM Products ORDER BY 1, 2; 

# DESC降序，值得注意的是DESC只作用于位于前面的列名
SELECT prod_name, prod_id, prod_price FROM Products ORDER BY prod_name DESC, prod_id; 
```

--- 

### 4：过滤数据

SELECT语句中，数据根据WHERE子句中指定的搜索条件进行搜索，WHERE语句的操作符包括蛮多，=、<>、!=、<、<=、!<、>、>=、!>、BETWEEN、IS NULL

```sql
# BETWEEN AND
SELECT prod_name, prod_id FROM Products WHERE prod_id BETWEEN 5 AND 10;

# IS NULL
SELECT prod_name, prod_id FROM Products WHERE prod_id IS NULL;
```

--- 

### 5：高级数据过滤

SQL允许给出多个WHERE语句，即以AND和OR子句的形式使用，值得注意的是AND的优先级大于OR，因此有必要使用圆括号避免歧义

```sql
SELECT prod_id, prod_name FROM Products WHERE vend_id = 'xxx' AND prod_price <= 4;

SELECT prod_id, prod_name FROM Products WHERE vend_id = 'xxx' OR vend_id = 'XXX';

# 选择价格大于10美元、且制造商为xxx和XXX的产品id及name
SELECT prod_id, prod_name FROM Products WHERE (vend_id = 'xxx' AND vend_id = 'XXX') OR prod_price > 10;
```

IN操作符是WHERE子句中用来匹配值的清单的关键字，功能与OR相当

```sql
SELECT prod_id, prod_name FROM Products WHERE vend_id = 'xxx' IN ('xxx', 'XXX');
```

NOT操作符是WHERE语句中用来否定其后条件的关键字，功能与!=或者<>相当

```sql
SELECT prod_name FROM Products WHERE NOT vend_id = 'xxx';
```

