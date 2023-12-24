type Fn<Params, Result> = Params extends undefined ? () => Result : (params: Params) => Result;

const main: Fn<undefined, Promise<void>> = async () => {
  const unsortedArray = createUnsortedArray({ length: 20, min: 1, max: 50 });
  const sortedArray = await sleepSort(unsortedArray);
  console.log({ unsortedArray, sortedArray });
};

type SleepSortFnParams = number[];
type SleepSortFnResult = Promise<number[]>;
type SleepSortFn = Fn<SleepSortFnParams, SleepSortFnResult>;

const sleepSort: SleepSortFn = async (unsortedArray) => {
  const sortedArray: number[] = [];

  await Promise.all(unsortedArray.map(value => deferTask({
    task: () => sortedArray.push(value),
    deferTime: value
  })));

  return sortedArray;
}

type DeferTaskFnParams = { task: () => void; deferTime: number };
type DeferTaskFnResult = Promise<void>;
type DeferTaskFn = Fn<DeferTaskFnParams, DeferTaskFnResult>;

const deferTask: DeferTaskFn = async ({ task, deferTime }) => new Promise(resolve => {
  setTimeout(() => {
    task();
    resolve();
  }, deferTime);
});

type CreateUnsortedArrayFnParams = { length: number, min: number, max: number };
type CreateUnsortedArrayFnResult = number[];
type CreateUnsortedArrayFn = Fn<CreateUnsortedArrayFnParams, CreateUnsortedArrayFnResult>;

const createUnsortedArray: CreateUnsortedArrayFn = ({ length, min, max }) => {
  const difference = max - min;

  return new Array<number>(length).fill(0).map(() => Math.floor(min + Math.random() * difference ));
}

main();