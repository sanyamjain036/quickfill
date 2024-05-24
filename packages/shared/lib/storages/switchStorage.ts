import { BaseStorage, createStorage, StorageType } from "@lib/storages/base";

type Switch = "off" | "on";

type SwitchStorage = BaseStorage<Switch> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<Switch>("switch-storage-key", "on", {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const switchStorage: SwitchStorage = {
  ...storage,
  toggle: async () => {
    await storage.set((currentSwitch) => {
      return currentSwitch === "on" ? "off" : "on";
    });
  },
};
