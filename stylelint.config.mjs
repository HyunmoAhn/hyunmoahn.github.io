/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier-scss',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'selector-class-pattern': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'value-keyword-case': null,
    'alpha-value-notation': 'number',
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'function-name-case': null,
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: ['apple-system-wrapper'],
      },
    ],
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'scss/no-global-function-names': null,
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    'selector-id-pattern': null,
    'scss/at-function-pattern': null,
    'scss/percent-placeholder-pattern': null,
    'no-duplicate-selectors': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
    'media-feature-name-no-unknown': [
      true,
      {
        ignoreMediaFeatureNames: ['variables'],
      },
    ],
    'media-feature-range-notation': null,
  },
};
