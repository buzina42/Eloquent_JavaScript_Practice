
//5.1 свертка
let arrays = [[1, 2, 3], [4, 5], [6]];
let result = arrays.reduce(function(a, b) {
  return a.concat(b);
});
console.log(result);

//5.2 Ваш собственный цикл
function loop(start, conditions, update, body) {
  for (let i = start; conditions(i); i = update(i)) {
    body(i);
  }
}
loop(3, n => n > 0, n => n - 1, console.log);

//5.3 метод every с циклом
function every(array, test) {
  for (let el of array) {
    console.log(el);
    if (test(el) === false) {
      return false;
    }
  }
  return true;
}

// метод every с some
function every(array, test) {
  return !array.some(el => !test(el));
}

console.log(every([1, 3, 5], n => n < 10));
console.log(every([2, 4, 16], n => n < 10));
console.log(every([], n => n < 10));


//5.4 Доминирующее направление письма

function dominantDirection(text) {
  //вычисление к какому скрипту принадлежит символ, на основе его кода
  function characterScript(code) { 
    for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script.direction;
    }
  }
  return null;
}
//перебор букв в слове, подсчет количества в каждом скрипте
  function countBy(items, groupName) {
    let counts = [];
    for (let item of items) {
      let name = groupName(item);
      let known = counts.findIndex(c => c.name == name);
      if (known == -1) {
        counts.push({name, count: 1});
      } else {
        counts[known].count++;
      }
    }
    return counts;
  }
//финальный расчет
  let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script : "none";
  }).filter(({name}) => name != "none"); //отсеивает знаки без принадлежности к языку
 
  if (scripts.length === 0) {
    return "No dominant";
  } else if(scripts.length === 1){
    return scripts[0].name;
  } else return scripts.reduce((a, b) => a.count < b.count ? b.name : a.name);
}


console.log(dominantDirection("Hello!"));
console.log(dominantDirection("Hey, مساء الخير"));
console.log(dominantDirection("Hello مسا"));
console.log(dominantDirection(" "));