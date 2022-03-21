// 8.1 Retry / Повторная попытка

class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  try {
    return primitiveMultiply(a, b);
  } catch (e) {
    if (e instanceof MultiplicatorUnitFailure) {//ошибка является экземпляром класса MultiplicatorUnitFailure
      return reliableMultiply(a, b);
    } else {
      throw e;
    }
  }
}

console.log(reliableMultiply(8, 8));


// 8.2 The locked box / Запертая коробка
const box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true;  },
    _content: [],
    get content() {
      if (this.locked) throw new Error("Locked!");
      return this._content;
    }
  };
  
  function withBoxUnlocked(body) {
    console.log(`${body}`);
    if (!box.locked) {
        
        return body();
    }
    box.unlock();
    try {
        return body();
    } finally {
        box.lock();
    }
  }
  
  withBoxUnlocked(function() {
    box.content.push("gold piece");
  });
  
  try {
    withBoxUnlocked(function() {
      throw new Error("Pirates on the horizon! Abort!");
    });
  } catch (e) {
    console.log("Error raised: " + e);
  }
  console.log(box.locked);
