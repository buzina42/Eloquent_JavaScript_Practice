
//6.1 Тип вектора
class Vec{
    constructor(x, y) {
        this.x = x;
      this.y = y;
    }
    plus(a) {
      return new Vec(this.x + a.x, this.y + a.y)
    }
      minus(b){
        return new Vec(this.x - b.x, this.y - b.y)
      }
      get length(){
          return Math.hypot(this.x, this.y);
      }
  }
  console.log(new Vec(1, 2).plus(new Vec(2, 3)));
  // → Vec{x: 3, y: 5}
  console.log(new Vec(1, 2).minus(new Vec(2, 3)));
  // → Vec{x: -1, y: -1}
  console.log(new Vec(3, 4).length);
  // → 5


//6.2 Группы
class Group {
    constructor (){
      this.group = []
    }
    add(arg){//добавляет в нее значение (но только если такого значения там еще нет)
      if (!this.group.includes(arg)){
       this.group.push(arg);
      }
    }
    delete(arg){// удаляет свой аргумент из группы (если таковой там был),
        this.group = this.group.filter(item => item != arg);
      }
    has(arg){// возвращает логическое значение, указывающее, является ли его аргумент членом группы.
      return this.group.includes(arg);
    }
    static from(items){
      let group2 = new Group();
      for (let i of items) {
        group2.add(i);
      }
      return group2;
    }
    [Symbol.iterator]() {
      return new GroupIterator(this);
    };  
  }
  
  let group = Group.from([10, 20]);
  console.log(group.has(10));
  // → true
  console.log(group.has(30));
  // → false
  group.add(10);
  group.delete(10);
  console.log(group.has(10));
  // → false

  //6.3 Итерируемые группы
  //Добавочный код к выполненому заданию выше


class GroupIterator {
    constructor (arg){
      this.arg = arg.group;
      this.counter = 0;
    }
    next(){
    if (this.arg.length === this.counter) return {done: true};
    let value = this.arg[this.counter];
    this.counter++;
    return {value, done: false};
    }
}  
for (let i of Group.from(["a", "b", "c"])) {
  console.log(i);
}


// 6.4 Заимствование метода
let map = {one: true, two: true, hasOwnProperty: true};

// Fix this call
//console.log(map.hasOwnProperty("one"));
console.log(hasOwnProperty.call(map, "one")); 
// → true