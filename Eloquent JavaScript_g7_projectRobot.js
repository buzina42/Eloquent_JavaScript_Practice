
//код из учебника для работы робота
var roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];

function buildGraph(edges) {
  let graph = Object.create(null); 
  function addEdge(from, to) { 
    if (graph[from] == null) { 
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

var roadGraph = buildGraph(roads); //карта дорог

var VillageState = class VillageState { 
  constructor(place, parcels) {
    this.place = place;//местоположение
    this.parcels = parcels;//массив посылок
  }

  move(destination) {// аргумент - текущее местоположение
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {//исключение из массива отработанного(текущего) адреса
        if (p.place != this.place) return p;// если текущее место не равно адресу посылки
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);//отфильтровать совпадающие адреса
      return new VillageState(destination, parcels);//текущее место, посылки
    }
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
    //  console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
   // console.log(`Moved to ${action.direction}`);
  }
}

function randomPick(array) {// рандомайзер адресов из массива адресов
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5) {
  let parcels = []; //массив адресов откуда-куда
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));//адрес откуда
    let place;
    do {
      place = randomPick(Object.keys(roadGraph)); //адрес куда
    } while (place == address);//в случае совпадения возврат к определению адреса отправки
    parcels.push({place, address});//записать в массив адреса на посылках откуда-куда если адреса не совпадают
  }
  return new VillageState("Post Office", parcels);
};

var mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];
// первая версия робота
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}
// поиск кратчайшего пути
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];// откуда куда
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {//точка с карты
      if (place == to) return route.concat(place);//если точка равна месту назначения, добавить в дорожную карту
      if (!work.some(w => w.at == place)) {//поиск в дорожном массиве совпадений точки отправки
        work.push({at: place, route: route.concat(place)});// добавить в массив движения только не совпадающие 
      }
    }
  }
}
//вторая версия робота
function goalOrientedRobot({place, parcels}, route) { // места, посылки, маршрут
  if (route.length == 0) {// если список движения пуст
    let parcel = parcels[0];// выбирается первая посылка из массива
    if (parcel.place != place) { //если адрес посылки не местонахождение
      route = findRoute(roadGraph, place, parcel.place);// найти путь к посылке
    } else {
      route = findRoute(roadGraph, place, parcel.address);// найти путь к адресату посылки
    }
  }
  return {direction: route[0], memory: route.slice(1)};//удалить адрес из памяти маршрута
}


 
//Правктическая часть 7 главы 
 //7.1 Измерение параметров робота

//ранРобот без логов
 function taskRobot(state, robot, memory) { 
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {//проверка длинны массива с посылками
      return turn;// вернуть 0 если массив пуст
    }
    let action = robot(state, memory);//ф-ия робота в аргументах массив посылок и память
    state = state.move(action.direction);// обращение к методу класса VillageState
    memory = action.memory;//записать в память точку движения, далее проверка длинны массива посылок
  }
}

//сравнение роботов
function compareRobots(robot1, memory1, robot2, memory2, robot3, memory3) {
  let tasks = [];//массив для задач
  for (let i = 0; i <= 100; ++i) {
    tasks.push(VillageState.random());//запись задач в массив
  }
  let total1 = 0;
  let total2 = 0;
  let total3 = 0;
  for (let task of tasks) {
    total1 += taskRobot(task, robot1, memory1);
    total2 += taskRobot(task, robot2, memory2);
    total3 += taskRobot(task, robot3, memory3);
  }
  console.log(`robot1 ${total1 / 100}, robot2 ${total2 / 100}, robot3 ${total3 / 100}`);
}

compareRobots(routeRobot, [], goalOrientedRobot, [], bloopRobot, []);

//7.2 Эффективность робота
//третья версия робота - ученическая
//код который из текущих адресов выбирает ближайший
function bloopRobot({place, parcels}, route) { // места, посылки, маршрут
  
  if (route.length == 0) {// если список движения пуст
    let parcelsUp = [];//массив для находжения ближайшей посылки
    for (let i = 0; i < parcels.length; i++){
      parcelsUp.push({
        place: parcels[i].place,
        address: parcels[i].address,
        route: findRoute(roadGraph, place, parcels[i].place)
      });
    }
    parcelsUp.sort((a, b) => a.route.length - b.route.length);
    let parcel = parcelsUp[0];// выбирается первая посылка из массива
    if (parcel.place != place) { //если место посылки не местонахождение
      route = parcel.route;// найти путь к посылке 
    } else {
      //с этим куском кода надо разобраться, почему не работает как мне хочется
      let parcelsDrop = [];
      for (let i = 0; i < parcels.length; i++){
        parcelsDrop.push({
          place: parcels[i].place,
          address: parcels[i].address,
          route: findRoute(roadGraph, place, parcels[i].address)
        });
      }
      parcelsDrop.sort((a, b) => a.route.length - b.route.length);
      let drop = parcelsDrop[0];
      route = drop.route;// найти путь к адресату посылки
    route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};//удалить адрес из памяти маршрута
}   

//7.3 Постоянная группа
class PGroup {
  constructor (group){
    this.group = group;
  }
  add(arg){//добавляет в нее значение (но только если такого значения там еще нет)
    if (!this.group.includes(arg)){
      return new PGroup(this.group.concat(arg));
    }
  }
  delete(arg){// удаляет свой аргумент из группы (если таковой там был),
    return new PGroup(this.group.filter(item => item != arg));
    }
  has(arg){// возвращает логическое значение, указывающее, является ли его аргумент членом группы.
    return this.group.includes(arg);
  }
  static empty(){
    return new PGroup([]);
  }
}

let a = PGroup.empty().add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false

