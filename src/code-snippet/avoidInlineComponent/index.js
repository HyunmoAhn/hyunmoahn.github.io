import badCase from '!!raw-loader!./badCase.js';
import goodCase from '!!raw-loader!./goodCase';

export const badCaseSnippet = {
  '/App.js': badCase,
};

export const goodCaseSnippet = {
  '/App.js': goodCase,
};
