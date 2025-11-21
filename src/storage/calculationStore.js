const DB_NAME = "sandCalculatorDB";
const STORE_NAME = "calculations";
const DB_VERSION = 1;

const getIndexedDB = () =>
  typeof window !== "undefined" ? window.indexedDB : undefined;

const openDatabase = () =>
  new Promise((resolve, reject) => {
    const indexedDB = getIndexedDB();

    if (!indexedDB) {
      reject(new Error("IndexedDB недоступен в этом окружении"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new Error(request.error?.message || "Ошибка открытия IndexedDB"));
  });

export const fetchCalculations = async () => {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const entries = [];
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          entries.push(cursor.value);
          cursor.continue();
        } else {
          resolve(entries);
        }
      };

      request.onerror = () =>
        reject(new Error(request.error?.message || "Ошибка чтения IndexedDB"));
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error("Не удалось загрузить расчеты:", error);
    throw error;
  }
};

export const persistCalculation = async (record) => {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        db.close();
        resolve(record);
      };

      transaction.onerror = () =>
        reject(
          new Error(transaction.error?.message || "Ошибка записи в IndexedDB")
        );
      store.put(record);
    });
  } catch (error) {
    console.error("Не удалось сохранить расчет:", error);
    throw error;
  }
};

export const removeCalculation = async (id) => {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () =>
        reject(
          new Error(
            transaction.error?.message || "Ошибка удаления из IndexedDB"
          )
        );
      store.delete(id);
    });
  } catch (error) {
    console.error("Не удалось удалить расчет:", error);
    throw error;
  }
};

export const clearCalculations = async () => {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () =>
        reject(
          new Error(transaction.error?.message || "Ошибка очистки IndexedDB")
        );

      store.clear();
    });
  } catch (error) {
    console.error("Не удалось очистить расчеты:", error);
    throw error;
  }
};
