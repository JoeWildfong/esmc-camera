import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylisticPlugin from '@stylistic/eslint-plugin';
import nodePlugin from 'eslint-plugin-n';
import confusingBrowserGlobals from 'confusing-browser-globals';
import { importX, createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      'accessor-pairs': 'off',
      'array-callback-return': ['error', { allowImplicit: true }],
      'block-scoped-var': 'error',
      complexity: ['off', 11],
      'class-methods-use-this': ['error', { exceptMethods: [] }],
      'consistent-return': 'error',
      curly: ['error', 'multi-line'],
      'default-case': ['error', { commentPattern: '^no default$' }],
      'default-case-last': 'off',
      'default-param-last': 'off',
      'dot-notation': ['error', { allowKeywords: true }],
      '@stylistic/dot-location': ['error', 'property'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'grouped-accessor-pairs': 'off',
      'guard-for-in': 'error',
      'max-classes-per-file': ['error', 1],
      'no-alert': 'warn',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-constructor-return': 'off',
      'no-div-regex': 'off',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-function': ['error', {
        allow: [
          'arrowFunctions',
          'functions',
          'methods',
        ],
      }],
      'no-empty-pattern': 'error',
      'no-eq-null': 'off',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      '@stylistic/no-floating-decimal': 'error',
      'no-global-assign': ['error', { exceptions: [] }],
      'no-implicit-coercion': ['off', {
        boolean: false,
        number: true,
        string: true,
        allow: [],
      }],
      'no-implicit-globals': 'off',
      'no-implied-eval': 'error',
      'no-invalid-this': 'off',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': ['off', {
        ignore: [],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
      }],
      'no-multi-spaces': ['error', {
        ignoreEOLComments: false,
      }],
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: [
          'acc',
          'accumulator',
          'e',
          'staticContext',
        ],
      }],
      'no-proto': 'error',
      'no-redeclare': 'error',
      'no-restricted-properties': ['error', {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      }, {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      }, {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      }, {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      }, {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      }, {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      }],
      'no-return-assign': ['error', 'always'],
      'no-script-url': 'error',
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'off',
      'no-unused-expressions': ['error', {
        allowShortCircuit: false,
        allowTernary: false,
        allowTaggedTemplates: false,
      }],
      'no-unused-labels': 'error',
      'no-useless-call': 'off',
      'no-useless-catch': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-warning-comments': ['off', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }],
      'no-with': 'error',
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],
      'prefer-named-capture-group': 'off',
      'prefer-regex-literals': 'off',
      radix: 'error',
      'require-await': 'off',
      'require-unicode-regexp': 'off',
      'vars-on-top': 'error',
      '@stylistic/wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],
      yoda: 'error',
    },
  },
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      'for-direction': 'error',
      'getter-return': ['error', { allowImplicit: true }],
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': ['error', 'always'],
      'no-console': 'warn',
      'no-constant-condition': 'warn',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'off',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      '@stylistic/no-extra-parens': ['off', 'all', {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: 'all', // delegate to eslint-plugin-react
        enforceForArrowConditionals: false,
      }],
      '@stylistic/no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'off',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'off',
      'no-misleading-character-class': 'error',
      'no-obj-calls': 'error',
      'no-promise-executor-return': 'off',
      'no-prototype-builtins': 'error',
      'no-regex-spaces': 'error',
      'no-setter-return': 'off',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unreachable-loop': ['off', { ignore: [] }],
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'no-useless-backreference': 'off',
      'require-atomic-updates': 'off',
      'use-isnan': 'error',
      'valid-typeof': ['error', { requireStringLiterals: true }],
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: nodePlugin,
    },
    rules: {
      'n/callback-return': 'off',
      'n/global-require': 'error',
      'n/handle-callback-err': 'off',
      'n/no-deprecated-api': 'error',
      'n/no-mixed-requires': ['off', false],
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/no-process-env': 'off',
      'n/no-process-exit': 'off',
      'n/no-restricted-require': 'off',
      'n/no-sync': 'off',
    },
  },
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      '@stylistic/array-bracket-newline': ['off', 'consistent'],
      '@stylistic/array-element-newline': ['off', { multiline: true, minItems: 3 }],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
      'capitalized-comments': ['off', 'never', {
        line: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
        block: {
          ignorePattern: '.*',
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      }],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/comma-style': ['error', 'last', {
        exceptions: {
          ArrayExpression: false,
          ArrayPattern: false,
          ArrowFunctionExpression: false,
          CallExpression: false,
          FunctionDeclaration: false,
          FunctionExpression: false,
          ImportDeclaration: false,
          ObjectExpression: false,
          ObjectPattern: false,
          VariableDeclaration: false,
          NewExpression: false,
        },
      }],
      '@stylistic/computed-property-spacing': ['error', 'never'],
      'consistent-this': 'off',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/function-call-argument-newline': ['off', 'consistent'],
      'func-name-matching': ['off', 'always', {
        includeCommonJSModuleExports: false,
        considerPropertyDescriptor: true,
      }],
      'func-names': 'warn',
      'func-style': ['off', 'expression'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      'id-denylist': 'off',
      'id-length': 'off',
      'id-match': 'off',
      '@stylistic/implicit-arrow-linebreak': ['error', 'beside'],
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        ignoreComments: false,
      }],
      '@stylistic/jsx-quotes': ['off', 'prefer-double'],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/keyword-spacing': ['error', {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      }],
      '@stylistic/line-comment-position': ['off', {
        position: 'above',
        ignorePattern: '',
        applyDefaultPatterns: true,
      }],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: false }],
      '@stylistic/lines-around-comment': 'off',
      'max-depth': ['off', 4],
      '@stylistic/max-len': ['error', 100, 2, {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'max-lines': ['off', {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      }],
      'max-lines-per-function': ['off', {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      }],
      'max-nested-callbacks': 'off',
      'max-params': ['off', 3],
      'max-statements': ['off', 10],
      '@stylistic/max-statements-per-line': ['off', { max: 1 }],
      '@stylistic/multiline-comment-style': ['off', 'starred-block'],
      '@stylistic/multiline-ternary': ['off', 'never'],
      'new-cap': ['error', {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      }],
      '@stylistic/new-parens': 'error',
      '@stylistic/newline-per-chained-call': ['error', { ignoreChainWithDepth: 4 }],
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-continue': 'error',
      'no-inline-comments': 'off',
      'no-lonely-if': 'error',
      '@stylistic/no-mixed-operators': ['error', {
        // the list of arthmetic groups disallows mixing `%` and `**`
        // with other arithmetic operators.
        groups: [
          ['%', '**'],
          ['%', '+'],
          ['%', '-'],
          ['%', '*'],
          ['%', '/'],
          ['/', '*'],
          ['&', '|', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!=='],
          ['&&', '||'],
        ],
        allowSamePrecedence: false,
      }],
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      'no-multi-assign': ['error'],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'no-negated-condition': 'off',
      'no-nested-ternary': 'error',
      'no-object-constructor': 'error',
      'no-plusplus': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'ForOfStatement',
          message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/no-tabs': 'error',
      'no-ternary': 'off',
      '@stylistic/no-trailing-spaces': ['error', {
        skipBlankLines: false,
        ignoreComments: false,
      }],
      'no-underscore-dangle': ['error', {
        allow: [],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      }],
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/nonblock-statement-body-position': ['error', 'beside', { overrides: {} }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-curly-newline': ['error', {
        ObjectExpression: { minProperties: 4, multiline: true, consistent: true },
        ObjectPattern: { minProperties: 4, multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      }],
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],
      'one-var': ['error', 'never'],
      '@stylistic/one-var-declaration-per-line': ['error', 'always'],
      'operator-assignment': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'none' } }],
      '@stylistic/padded-blocks': ['error', {
        blocks: 'never',
        classes: 'never',
        switches: 'never',
      }, {
        allowSingleLineBlocks: true,
      }],
      '@stylistic/padding-line-between-statements': 'off',
      'prefer-exponentiation-operator': 'off',
      'prefer-object-spread': 'error',
      '@stylistic/quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/semi-spacing': ['error', { before: false, after: true }],
      '@stylistic/semi-style': ['error', 'last'],
      'sort-keys': ['off', 'asc', { caseSensitive: false, natural: true }],
      'sort-vars': 'off',
      '@stylistic/space-before-blocks': 'error',
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/space-in-parens': ['error', 'never'],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': ['error', {
        words: true,
        nonwords: false,
        overrides: {
        },
      }],
      '@stylistic/spaced-comment': ['error', 'always', {
        line: {
          exceptions: ['-', '+'],
          markers: ['=', '!', '/'], // space here to support sprockets directives, slash for TS /// comments
        },
        block: {
          exceptions: ['-', '+'],
          markers: ['=', '!', ':', '::'], // space here to support sprockets directives and flow comment types
          balanced: true,
        },
      }],
      '@stylistic/switch-colon-spacing': ['error', { after: true, before: false }],
      '@stylistic/template-tag-spacing': ['error', 'never'],
      'unicode-bom': ['error', 'never'],
      '@stylistic/wrap-regex': 'off',
    },
  },
  {
    rules: {
      'init-declarations': 'off',
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'isFinite',
          message:
            'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
        },
        {
          name: 'isNaN',
          message:
            'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
        },
      ].concat(confusingBrowserGlobals),
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
    },
  },
  {
    plugins: {
      '@stylistic': stylisticPlugin,
    },
    rules: {
      'arrow-body-style': ['error', 'as-needed', {
        requireReturnForObjectLiteral: false,
      }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/arrow-spacing': ['error', { before: true, after: true }],
      'constructor-super': 'error',
      '@stylistic/generator-star-spacing': ['error', { before: false, after: true }],
      'no-class-assign': 'error',
      '@stylistic/no-confusing-arrow': ['error', {
        allowParens: true,
      }],
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-imports': 'off',
      'no-new-native-nonconstructor': 'error',
      'no-restricted-exports': ['off', {
        restrictedNamedExports: [
          'default', // use `export default` to provide a default export
          'then', // this will cause tons of confusion when your module is dynamically `import()`ed
        ],
      }],
      'no-restricted-imports': ['off', {
        paths: [],
        patterns: [],
      }],
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': ['error', {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false,
      }],
      'no-var': 'error',
      'object-shorthand': ['error', 'always', {
        ignoreConstructors: false,
        avoidQuotes: true,
      }],
      'prefer-arrow-callback': ['error', {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      }],
      'prefer-const': ['error', {
        destructuring: 'any',
        ignoreReadBeforeAssign: true,
      }],
      'prefer-destructuring': ['error', {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: true,
          object: false,
        },
      }, {
        enforceForRenamedProperties: false,
      }],
      'prefer-numeric-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error',
      '@stylistic/rest-spread-spacing': ['error', 'never'],
      'sort-imports': ['off', {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      }],
      'symbol-description': 'error',
      '@stylistic/template-curly-spacing': 'error',
      '@stylistic/yield-star-spacing': ['error', 'after'],
    },
  },
  {
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [
        createNodeResolver({
          extensions: ['.mjs', '.js', '.json'],
        }),
      ],
      'import-x/extensions': [
        '.js',
        '.mjs',
      ],
      'import-x/core-modules': [],
      'import-x/ignore': [
        'node_modules',
        '\\.(coffee|scss|css|less|hbs|svg|json)$',
      ],
    },
    rules: {
      'import-x/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],
      'import-x/named': 'error',
      'import-x/default': 'off',
      'import-x/namespace': 'off',
      'import-x/export': 'error',
      'import-x/no-named-as-default': 'error',
      'import-x/no-named-as-default-member': 'error',
      'import-x/no-deprecated': 'off',
      'import-x/no-extraneous-dependencies': ['error', {
        devDependencies: [
          'test/**', // tape, common npm pattern
          'tests/**', // also common npm pattern
          'spec/**', // mocha, rspec-like pattern
          '**/__tests__/**', // jest pattern
          '**/__mocks__/**', // jest pattern
          'test.{js,jsx}', // repos with a single test file
          'test-*.{js,jsx}', // repos with multiple top-level test files
          '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
          '**/jest.config.js', // jest config
          '**/jest.setup.js', // jest setup
          '**/vue.config.js', // vue-cli config
          '**/webpack.config.js', // webpack config
          '**/webpack.config.*.js', // webpack config
          '**/rollup.config.js', // rollup config
          '**/rollup.config.*.js', // rollup config
          '**/gulpfile.js', // gulp config
          '**/gulpfile.*.js', // gulp config
          '**/Gruntfile{,.js}', // grunt config
          '**/protractor.conf.js', // protractor config
          '**/protractor.conf.*.js', // protractor config
          '**/karma.conf.js', // karma config
        ],
        optionalDependencies: false,
      }],
      'import-x/no-mutable-exports': 'error',
      'import-x/no-commonjs': 'off',
      'import-x/no-amd': 'error',
      'import-x/no-nodejs-modules': 'off',
      'import-x/first': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-namespace': 'off',
      'import-x/extensions': ['error', 'ignorePackages', {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
      }],
      'import-x/order': ['error', { groups: [['builtin', 'external', 'internal']] }],
      'import-x/newline-after-import': 'error',
      'import-x/prefer-default-export': 'error',
      'import-x/no-restricted-paths': 'off',
      'import-x/max-dependencies': ['off', { max: 10 }],
      'import-x/no-absolute-path': 'error',
      'import-x/no-dynamic-require': 'error',
      'import-x/no-internal-modules': ['off', {
        allow: [],
      }],
      'import-x/no-webpack-loader-syntax': 'error',
      'import-x/no-unassigned-import': 'off',
      'import-x/no-named-default': 'error',
      'import-x/no-anonymous-default-export': ['off', {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowLiteral: false,
        allowObject: false,
      }],
      'import-x/exports-last': 'off',
      'import-x/group-exports': 'off',
      'import-x/no-default-export': 'off',
      'import-x/no-named-export': 'off',
      'import-x/no-self-import': 'error',
      'import-x/no-cycle': ['error', { maxDepth: '∞' }],
      'import-x/no-useless-path-segments': ['error', { commonjs: true }],
      'import-x/dynamic-import-chunkname': ['off', {
        importFunctions: [],
        webpackChunknameFormat: '[0-9a-zA-Z-_/.]+',
      }],
      'import-x/no-relative-parent-imports': 'off',
      'import-x/no-unused-modules': ['off', {
        ignoreExports: [],
        missingExports: true,
        unusedExports: true,
      }],
    },
  },
  {
    rules: {
      strict: ['error', 'never'],
    },
  },
  {
    plugins: {
      react: pluginReact,
      '@stylistic': stylisticPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-underscore-dangle': ['error', {
        allow: ['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: true,
      }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      'class-methods-use-this': ['error', {
        exceptMethods: [
          'render',
          'getInitialState',
          'getDefaultProps',
          'getChildContext',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount',
          'componentDidCatch',
          'getSnapshotBeforeUpdate',
        ],
      }],
      'react/display-name': ['off', { ignoreTranspilerName: false }],
      'react/forbid-prop-types': ['error', {
        forbid: ['any', 'array', 'object'],
        checkContextTypes: true,
        checkChildContextTypes: true,
      }],
      'react/forbid-dom-props': ['off', { forbid: [] }],
      'react/jsx-boolean-value': ['error', 'never', { always: [] }],
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-closing-tag-location': 'error',
      'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
      'react/jsx-handler-names': ['off', {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      }],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-key': 'off',
      'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
      'react/jsx-no-bind': ['error', {
        ignoreRefs: true,
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
        ignoreDOMComponents: true,
      }],
      'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
      'react/jsx-no-literals': ['off', { noStrings: true }],
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': ['error', {
        allowAllCaps: true,
        ignore: [],
      }],
      'react/sort-prop-types': ['off', {
        ignoreCase: true,
        callbacksLast: false,
        requiredFirst: false,
        sortShapeProp: true,
      }],
      'react/jsx-sort-props': ['off', {
        ignoreCase: true,
        callbacksLast: false,
        shorthandFirst: false,
        shorthandLast: false,
        noSortAlphabetically: false,
        reservedFirst: true,
      }],
      'react/jsx-sort-default-props': ['off', {
        ignoreCase: true,
      }],
      'react/jsx-uses-react': ['error'],
      'react/jsx-uses-vars': 'error',
      'react/no-danger': 'warn',
      'react/no-deprecated': ['error'],
      'react/no-did-mount-set-state': 'off',
      'react/no-did-update-set-state': 'error',
      'react/no-will-update-set-state': 'error',
      'react/no-direct-mutation-state': 'off',
      'react/no-is-mounted': 'error',
      'react/no-multi-comp': 'off',
      'react/no-set-state': 'off',
      'react/no-string-refs': 'error',
      'react/no-unknown-property': 'error',
      'react/prefer-es6-class': ['error', 'always'],
      'react/prefer-stateless-function': ['error', { ignorePureComponents: true }],
      'react/prop-types': ['error', {
        ignore: [],
        customValidators: [],
        skipUndeclared: false,
      }],
      'react/react-in-jsx-scope': 'error',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/sort-comp': ['error', {
        order: [
          'static-variables',
          'static-methods',
          'instance-variables',
          'lifecycle',
          '/^handle.+$/',
          '/^on.+$/',
          'getters',
          'setters',
          '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
          'instance-methods',
          'everything-else',
          'rendering',
        ],
        groups: {
          lifecycle: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'getInitialState',
            'state',
            'getChildContext',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
          rendering: [
            '/^render.+$/',
            'render',
          ],
        },
      }],
      'react/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],
      'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      'react/jsx-equals-spacing': ['error', 'never'],
      'react/jsx-indent': ['error', 2],
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
      'react/jsx-no-comment-textnodes': 'error',
      'react/no-render-return-value': 'error',
      'react/require-optimization': ['off', { allowDecorators: [] }],
      'react/no-find-dom-node': 'error',
      'react/forbid-component-props': ['off', { forbid: [] }],
      'react/forbid-elements': ['off', { forbid: [] }],
      'react/no-danger-with-children': 'error',
      'react/no-unused-prop-types': ['error', {
        customValidators: [],
        skipShapeProps: true,
      }],
      'react/style-prop-object': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-children-prop': 'error',
      'react/jsx-tag-spacing': ['error', {
        closingSlash: 'never',
        beforeSelfClosing: 'always',
        afterOpening: 'never',
        beforeClosing: 'never',
      }],
      'react/no-array-index-key': 'error',
      'react/require-default-props': ['error', {
        forbidDefaultForRequired: true,
      }],
      'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
      'react/void-dom-elements-no-children': 'error',
      'react/default-props-match-prop-types': ['error', { allowRequiredDefaults: false }],
      'react/no-redundant-should-component-update': 'error',
      'react/no-unused-state': 'error',
      'react/boolean-prop-naming': ['off', {
        propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
        rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
        message: '',
      }],
      'react/no-typos': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
      'react/destructuring-assignment': ['error', 'always'],
      'react/no-access-state-in-setstate': 'error',
      'react/button-has-type': ['error', {
        button: true,
        submit: true,
        reset: false,
      }],
      'react/jsx-child-element-spacing': 'off',
      'react/no-this-in-sfc': 'error',
      'react/jsx-max-depth': 'off',
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-curly-newline': ['error', {
        multiline: 'consistent',
        singleline: 'consistent',
      }],
      'react/jsx-props-no-spreading': ['error', {
        html: 'enforce',
        custom: 'enforce',
        explicitSpread: 'ignore',
        exceptions: [],
      }],
      'react/prefer-read-only-props': 'off',
      'react/jsx-no-script-url': ['off', [
        {
          name: 'Link',
          props: ['to'],
        },
      ]],
      'react/jsx-no-useless-fragment': 'off',
      'react/no-adjacent-inline-elements': 'off',
      'react/function-component-definition': ['off', {
        namedComponents: 'function-expression',
        unnamedComponents: 'function-expression',
      }],
    },
    settings: {
      'import-x/resolver': {
        node: {
          extensions: ['.mjs', '.js', '.jsx', '.json'],
        },
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      'jsx-a11y': jsxA11yPlugin,
      react: pluginReact,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'jsx-a11y/anchor-has-content': ['error', { components: [] }],
      'jsx-a11y/aria-role': ['error', { ignoreNonDOM: false }],
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/alt-text': ['error', {
        elements: ['img', 'object', 'area', 'input[type="image"]'],
        img: [],
        object: [],
        area: [],
        'input[type="image"]': [],
      }],
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/label-has-associated-control': ['error', {
        labelComponents: [],
        labelAttributes: [],
        controlComponents: ['*Input'],
        assert: 'either',
        depth: 25,
      }],
      'jsx-a11y/control-has-associated-label': ['error', {
        labelAttributes: ['label'],
        controlComponents: [],
        ignoreElements: [
          'audio',
          'canvas',
          'embed',
          'input',
          'textarea',
          'tr',
          'video',
        ],
        ignoreRoles: [
          'grid',
          'listbox',
          'menu',
          'menubar',
          'radiogroup',
          'row',
          'tablist',
          'toolbar',
          'tree',
          'treegrid',
        ],
        depth: 5,
      }],
      'jsx-a11y/mouse-events-have-key-events': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/heading-has-content': ['error', { components: [''] }],
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/lang': 'error',
      'jsx-a11y/no-distracting-elements': ['error', {
        elements: ['marquee', 'blink'],
      }],
      'jsx-a11y/scope': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': ['error', {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      }],
      'jsx-a11y/no-noninteractive-element-interactions': ['error', {
        handlers: [
          'onClick',
          'onMouseDown',
          'onMouseUp',
          'onKeyPress',
          'onKeyDown',
          'onKeyUp',
        ],
      }],
      'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': ['error', {
        tr: ['none', 'presentation'],
      }],
      'jsx-a11y/no-noninteractive-element-to-interactive-role': ['error', {
        ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
        li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
        table: ['grid'],
        td: ['gridcell'],
      }],
      'jsx-a11y/no-noninteractive-tabindex': ['error', {
        tags: [],
        roles: ['tabpanel'],
      }],
      'jsx-a11y/anchor-is-valid': ['error', {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      }],
      'jsx-a11y/autocomplete-valid': ['off', {
        inputComponents: [],
      }],
    },
  },
  {
    extends: ['js/recommended'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      js,
    },
    rules: {
      'import-x/no-named-as-default': 0,
      'no-underscore-dangle': 0,
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    files: ['tests/**', 'src/tests/**', '**/*.test.{js,jsx,ts,tsx}', '**/__mocks__/**'],
    languageOptions: {
      globals: {
        // Add testing globals to test files
        ...globals.jest,
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    files: ['eslint.config.{cjs,mjs,js,ts,cts,mts}', 'vite.config.{cjs,mjs,js,ts,cts,mts}'],
    rules: {
      'import-x/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
  {
    extends: [
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
    ],
    files: ['**/*.jsx', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/error-boundaries': 'error',
      'react-hooks/globals': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/use-memo': 'error',
      'react/require-default-props': ['error', { functions: 'defaultArguments' }],
    },
  },
  {
    files: ['**/*.jsx', '**/*.tsx', '**/*.js', '**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.d.ts'],
    extends: [
      '@typescript-eslint/recommended',
      'import-x/flat/typescript',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importX,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver(),
        createNodeResolver({
          extensions: ['.mjs', '.js', '.jsx', '.json'],
        }),
      ],
      'import-x/extensions': [
        '.ts',
        '.d.ts',
        '.js',
        '.mjs',
        '.tsx',
        '.jsx',
      ],
    },
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      'import-x/extensions': ['error', 'ignorePackages', {
        ts: 'never',
        tsx: 'never',
      }],
    },
  },
  {
    rules: {
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    },
  },
  {
    ignores: [
      'dist/**',
      'coverage/**',
    ],
  },
]);
