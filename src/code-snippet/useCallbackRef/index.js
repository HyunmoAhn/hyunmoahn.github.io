import basicProblemCode from '!!raw-loader!./basicProblem.js';
import basicProblemSolve from '!!raw-loader!./basicProblemSolve.js';
import listProblem from '!!raw-loader!./listProblem';
import listProblemSolve from '!!raw-loader!./listProblemSolve';
import edgeCase from '!!raw-loader!./edgeCase';
import useAsyncDataCode from '!!raw-loader!./useAsyncData.js';
import useCallbackRef from '!!raw-loader!./useCallbackRef.js';

export const basicProblemSnippet = {
  '/App.js': basicProblemCode,
  '/useAsyncData.js': useAsyncDataCode,
};

export const basicProblemSolveSnippet = {
  '/App.js': basicProblemSolve,
  '/useAsyncData.js': useAsyncDataCode,
};

export const listProblemSnippet = {
  '/App.js': listProblem,
  '/useAsyncData.js': useAsyncDataCode,
};

export const useCallbackRefSnippet = {
  '/App.js': listProblemSolve,
  '/useAsyncData.js': useAsyncDataCode,
  '/useCallbackRef.js': useCallbackRef,
};

export const edgeCaseSnippet = {
  '/App.js': edgeCase,
  '/useAsyncData.js': useAsyncDataCode,
  '/useCallbackRef.js': useCallbackRef,
};
