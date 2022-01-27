

let i = 1;
for (; i<101; i++){
   if (i%3 ===0 && i%5 ===0){
        console.log("FizzBuzz")
   }else if(i%3 == 0){
        console.log("Fizz")
   }else if (i%5 == 0){
        console.log("Buzz")
   }else console.log(i)
}

//шахматная доска
const sim1 = "#";
const sim2 = " ";
const sizeD = 15;

for (let x = 1; x <= sizeD; x++) {
  var line = " ";

  for (let y = 1; y <= sizeD; y++) {
    if (x % 2) {
          line = y % 2 ? line += sim2 : line += sim1;
    } else {
          line = y % 2 ? line += sim1 : line += sim2;
    }

  }

  console.log(line);
}


function getDivisorsCnt(n){
     let result = 0;
     for (let i = 0; i > n; i++){
       if (n > 1){
         const division = n % i;
         result = (n - division) / i;
       } else result = n;
     }
     return (result);
 }
 console.log (getDivisorsCnt(1));
  
  //принимает массив, возвращает список
 function arrayToList(arr) {
    let resultList = null;
    const arrRev = arr.reverse();
    for (let el of arrRev){
      resultList = { value: el, 
                    rest: resultList
                    }
    }
    return resultList;
  }

 //принимаеи список, возвращает массив
  function listToArray(list){
    let resultArr = [list.value];
    while (list.rest !==  null){
      list = list.rest;
      resultArr.push(list.value);
    }
    return resultArr;
  }

  //добавляет элемент в начало списка
  function prepend(element, list) {
    return {value: element,
            rest: list};
  }
// возвращает  элемент, находящийся в заданной позиции в этом списке 
  function nth(list, num){
    return listToArray(list)[num];
  }
// рекурсивная версия этой же ф-ии
  function nthRecurs(list, num){
    if (list.rest === null){
      return undefined;
    } else return num === 0 ? list.value : nthRecurs(list.rest, num-1);
  }

  console.log(arrayToList([10, 20]));
  console.log(listToArray(arrayToList([10, 20, 30 ,40 ,50 ])));
  console.log(prepend(10, prepend(20, prepend(30, null))));
  console.log(nth(arrayToList([10, 20, 30]), 1));
  console.log(nthRecurs(arrayToList([10, 20, 30, 40]), 2));  

  function deepEqual(arg1, arg2){
    
    if (arg1 === null || typeof arg1 != "object" || 
        arg2 === null || typeof arg2 != "object" ){
          return arg1 === arg2;
    } else if ((Object.entries(arg1)).length === (Object.entries(arg2)).length) {
        function sortArr(arg){
          let arrNew = [];
          for (let [key, value] of Object.entries(arg)){
            arrNew.push(key, value);
                arrNew.sort();  
          }
          return arrNew
        }
        for (let i of sortArr(arg1)){
          for (let j of sortArr(arg2)){
            return deepEqual(i, j);  
          }
        } 
    } else return false;
  }


  var obj = {here: {is: "an"}, object: 2};

  console.log(deepEqual(obj, obj));
  console.log(deepEqual(obj, {here: 1, object: 2}));
 console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
  console.log(deepEqual(obj, {object: 2, here: {is: "an"}}));
  