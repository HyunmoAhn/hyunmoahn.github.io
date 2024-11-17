export const DELAY = 1000;

export function timeout(ns: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ns);
  });
}

const createController = () => {
  let events: (() => void)[] = [];
  let processor = eventProcessor();

  const register = async (cb: () => void) => {
    events.push(cb);
    await processor.next();
  };

  async function* eventProcessor() {
    while (true) {
      const event = events.shift();
      if (event) {
        yield event();
      }
    }
  }

  const clear = () => {
    events = [];
    processor = eventProcessor();
  };

  return {
    register,
    clear,
  };
};

export const reactEventController = createController();
export const vanillaEventController = createController();
