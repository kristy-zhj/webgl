## 模式匹配的基本用法
    匹配模式通过match...with
      match [something] with
    | pattern1 -> expression1
    | pattern2 -> expression2
    | pattern3 -> expression3
  1. 匹配是有顺序的
  2. 模式匹配是一个表达式(不同分支应该返回相同类型的值)
  3. 至少有一个分支能被匹配到
    type Choices = A | B | C
    let x =
        match A with
        | A -> "a"
        | B -> "b"
        | C -> "c"

## 匹配元组（Tuple）
  let y =
    match (1,0) with
    | (1,x) -> print "x="  x
    | (_,x) -> print "other x=" x

  1. 多个模式写在同一个分支上，多个模式是或的关系时用 |
  type Choices A|B|C|D
  let x = match A with
    | A|B|C -> "a or b or c"
    | D -> "d"

  2. 多个模式时与的关系时用&
  let y = match (1,0) with
    | (2,x)$(_,1) ->print "x=" x

## 匹配list
  三种模式
  1. [x;y;z]用来显示匹配list中的元素
  2. head::tail head 会匹配到第一个元素，其他的元素会匹配到tail，这个模式常用来对list做递归
  3. [] 会匹配到空的list
    let rec loopAndPrint aList =
    match aList with
    | []-> print "empty"
    | x::xs ->print "element="x
              loopAndPrint xs
    loopAndPrint [1..5]
      当[]模式被匹配到，说明list已经为空，可以作为递归的终止条件；
      x::xs模式会将第一个元素匹配到x中，剩余的元素被匹配到xs，然后xs又被当做参数做下一次递归

## 匹配Recoard type 和 Descriminated Union type
  //record type
    type Person ={First:string;Last:string}
    let person ={First="john";Last="doe"}
      match person with
      | {First="john"} -> print "matched John"
      | _-> print "not john"

  //union type
    type OntOrBool =I of int | B of bool
    let inOrBool = I 42
      match inOrBool with
      | I i ->print "Int=" i
      | B b ->print "Bool=" b

## 其他
  1. as 关键字（把模式用as关键字指向另一只名称）
    let y =
      match (1,0) with
      | (x,y) as t->
        print "x= and y=" x y
        print "the whole tuple is " t

  2. 匹配子类（:? 用来匹配类型）
   let detectType v=
    match box v with
    | :? int ->print "this is an int"
    | _ -> print "something else"

  3. when 条件
    let elementsAreEqual aTuple =
      match aTuple with
      |(x,y) ->
        if(x=y) then print "both parts are the same"
        else print "both parts are different"

    let elementsAreEqual aTuple =
      match aTuple with
      | (x,y) when x=y -> print "both parts are the same"
      | _ -> print "both parts are different"

## Active pattern
  when语句过于复杂的时候可以考虑某个分支的模式定义为一个方法
  let (|EmailAddress|_|) input =
    let m=Regex.Match(input,@".+@.+")
    if(m.Success) then Some input else None

  let classifyString aString
    match aString with
    | EmailAddress x -> print"s% is an email" x
    | _ -> print"%s is something else " aString

