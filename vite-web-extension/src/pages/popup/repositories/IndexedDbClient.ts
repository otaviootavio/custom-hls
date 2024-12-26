export class IndexedDBClient {
    private db: IDBDatabase | null = null;
  
    constructor(
      private dbName: string,
      private version: number,
      private storeConfigs: Array<{
        name: string;
        keyPath?: string;
        indexes?: Array<{ name: string; keyPath: string; options?: IDBIndexParameters }>;
      }>
    ) {
      this.initDB();
    }
  
    private async initDB(): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
  
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          this.storeConfigs.forEach(config => {
            if (!db.objectStoreNames.contains(config.name)) {
              const store = db.createObjectStore(config.name, 
                config.keyPath ? { keyPath: config.keyPath } : undefined
              );
              
              config.indexes?.forEach(index => {
                store.createIndex(index.name, index.keyPath, index.options);
              });
            }
          });
        };
      });
    }
  
    private async ensureDBConnection(): Promise<void> {
      if (!this.db) {
        await this.initDB();
      }
    }
  
    async performTransaction<T>(
      storeName: string,
      mode: IDBTransactionMode,
      callback: (store: IDBObjectStore) => IDBRequest<T>
    ): Promise<T> {
      await this.ensureDBConnection();
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = callback(store);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  }