## simple object queries
  1. 获取list
  query{
    authors{
      id
      name
    }
  }
  {
    "data":{
      "authors":[
        {
          "id":1,
          "name":"tom"
        },
        {
          "id":2,
          "name":"jerry"
        }
      ]
    }
  }
  2. 主键获取作者
  query{
    authors_by_pk(id:1){
      id
      name
    }
  }
  {
    "data":{
      "authors_by_pk":{
        "id":1,
        "name":"tom"
      }
    }
  }
## aggregated queries 聚合查询
  1. 获取对象
  query{
    articles_aggregate{
      sum{
        rating
      }
      svg{
        rating
      }
      max{
        tating
      }
      nodes{
        id
        title
        rating
      }
    }
  }
  {
    "data":{
      "articles_aggregated":{
        "sum":{
          "rating":26
        },
        "svg":{
          "rating":2.6
        },
        "max":{
          "rating":4
        },
        "nodes":[
          {
            "id":1,
            "title":"sit met",
            "rating":1
          },
          {
            "id":2,
            "title":"sit met",
            "rating":3
          },
          {
            "id":3,
            "title":"sit met",
            "rating":2
          }
        ]
      }
    }
  }
  2. 嵌套
  query{
    authors ( where:{id:{_eq:1}} ){
      id
      name
      article_aggregate{
        aggregate{
          count
          avg{
            rating
          }
          max{
            rating
          }
        }
        nodes{
          id
          title
          rating
        }
      }
    }
  }
  {
    "data":{
      "authors":[
        {
          "id":1,
          "name":"tom",
          "article_aggregate":{
            "count": 2,
            "avg": {
              "rating": 2.5
            },
            "max": {
              "rating": 4
            }
          },
          "nodes": [
            {
              "id": 15,
              "title": "vel dapibus at",
              "rating": 4
            },
            {
              "id": 16,
              "title": "sem duis aliquam",
              "rating": 1
            }
          ]
        },
      ]
    }
  }
## filter query /search queries
  1. where
  query{
    authors(
      where:{name:{_eq:"tome"}}
    ){
      id
      name
    }
  }
  2. 多级
  query{
    authors(where:{articles:{rating:{_gt:4}}}){
      id
      name
      articles(where:{rating:{_gt:4}}){
        id
        title
        rating
      }
    }
  }
  query{
    articles(
      where:{
        _or:[
          {is_published:{_eq:false}},
          {is_published:{_is_null:true}}
        ]
      }
    ){
      id
      title
      is_published
    }
  }
## operators
 1. 大于小于：_gt:(>) _lt:(<>) _gte:(>=) _lte:(<=)
 2. 搜索：_in  _nin
  query{
    articles(where:{rating:{_in:[1,2,3]}}){
      id
      title
      rating
    }
  }
 3. 文本搜索或匹配
     _like, _nlike, _ilike, _nilike, _similar, _nsimilar, _regex, _nregex, _iregex, _niregex
 4. JSONB operators (_contains, _has_key)
    query get_authors_in_pincode($jsonFilter:jsonb){
      authors(
        where:{address:{_contains:$jsonFilter}}
      ){
        id
        name
        address
      }
    }
    "jsonFilter":{
      "pincode":560095
    }
    {
      "data":{
        "authors":[
          {
            "id":1,
            "name":"ash",
            "address":{
              "street_address": "161, 19th Main Road, Koramangala 6th Block",
              "city": "Bengaluru",
              "state": "Karnataka",
              "pincode": 560095,
              "phone": "9090909090"
            },
          }
        ]
      }
    }
 5. 检查空值 _is_null
  query {
    articles(
      where: {published_on: {_is_null: false}}
    ) {
      id
      title
      published_on
    }
  }
 6. _not _eq _neq
 7. _and
    query{
      articles(
        where:{
          _and:[
            {published_on:"2017-01-01"},
            {published_on:"2017-12-31"}
          ]
        }
      ){
        id
        title
        published_on
      }
    }
  8. _or
    query {
    articles (
      where: {
        _or: [
          {rating: {_gte: 4}},
          {published_on: {_gte: "2018-01-01"}}
        ]
      }
    )
    {
      id
      title
      rating
      published_on
    }
## 嵌套
  query{
    articles(where:{author:{name:{_eq:"tom"}}}){
      id
      title
    }
  }
  query{
    articles(
      where:{
        _not:{
          author:{name:{_eq:"tom"}}
        }
      }
    ){
      id
      title
    }
  }
  <!-- 至少有一篇文章 -->
  query{
    authors (
      where: {
        articles: {}
      }
    ) {
      id
      name
      articles_aggregate {
        aggregate {
          count
        }
      }
    }
  }
## order_by
  1. 排序
  query{
    authors(
      order_by:{name:asc}
    ){
      id
      name
    }
  }
  2. 嵌套排序
    query{
      authors (order_by:{name:asc}){
        id
        name
        articles(order_by:{rating:desc}){
          id
          title
          rating
        }
      }
    }
  3. 嵌套字段排序
    query{
      articles(
        order_by:{author:{id:desc}}
      ){
        id
        rating
        author{
          id
          name
        }
      }
    }
## 分页查询 限制和偏移参数
  1. limit results
  query{
    authors(
      limit:5,
      offset:5
      ){
      id
      name
    }
  }
  2. 使用where代替偏移量
    query{
      authors(
        limit:5,
        where:{id:{_gt:5}}
      ){
        id
        name
      }
    }

## 查询中使用多个参数
  query{
    authors{
      id
      name
      articles(
        where:{is_published:{_eq:true}},
        order_by:{published_on:desc},
        limit:2
      ){
        id
        title
        is_published
        published_on
      }
    }
  }
## 一个请求多个查询
  query{
    authors(limit:2){
      id
      name
    }
    articles(limit:2){
      id
      title
    }
  }
## 使用变量（variables） 别名（aliases） 片段（fragments） 指令（directives）
  1. use variables
    {
      "author_id": 1
    }
    query getArticles($author_id:Int!){
      articles(
        where:{author_id:{_eq:$author_id}}
      ){
        id
        title
      }
    }
  2. Using aliases
  query getArticles{
    articles{
      title
      rating
    }
    topTowArticles:articles(
      order_by:{rating:desc},
      limit:2
    ){
      title
      rating
    }
    worstArticle:articles(
      order_bt:{rating:asc},
      limit:1
    ){
      title
      rating
    }
  }
  3. using fragments
    fragment articleFields on articles{
      title
      id
    }
    query getArticles{
      articles{
        ...articleFields
      }
      topTowArticles:articles(
        order_bt:{rating:desc},
        limit:5
      ){
        ...articleFields
      }
    }
  4. using directives
    1. @include(if: Boolean) 包括
      {
        "with_publisher":true
      }
      query getArticles($with_publisher:Boolean!){
        articles{
          title
          publisher:@include(if:$with_publisher)
        }
      }
      ||
      {
        "data": {
          "articles": [
            {
              "title": "How to climb Mount Everest",
              "publisher": "Mountain World"
            },
            {
              "title": "How to be successful on broadway",
              "publisher": "Broadway World"
            },
            {
              "title": "How to make fajitas",
              "publisher": "Fajita World"
            }
          ]
        }
      }
      {
        "with_publisher": false
      }
      ||
      {
        "data": {
          "articles": [
            {
              "title": "How to climb Mount Everest"
            },
            {
              "title": "How to be successful on broadway"
            },
            {
              "title": "How to make fajitas"
            }
          ]
        }
      }
    2. @skip(if: Boolean) 不包括