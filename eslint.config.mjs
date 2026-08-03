import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const sourceFiles = ['resources/js/**/*.{js,jsx,ts,tsx}']
const typeScriptFiles = ['resources/js/**/*.{ts,tsx}']

export default tseslint.config(
    {
        ignores: ['node_modules/', 'public/', 'vendor/'],
    },
    {
        ...eslint.configs.recommended,
        files: sourceFiles,
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
    },
    {
        extends: [
            ...tseslint.configs.recommended,
            react.configs.flat.recommended,
            react.configs.flat['jsx-runtime'],
            jsxA11y.flatConfigs.recommended,
        ],
        files: typeScriptFiles,
        plugins: {
            'react-hooks': reactHooks,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // The GA4 queue intentionally mirrors Google's `gtag` snippet and pushes its
            // `arguments` object into dataLayer.
            'prefer-rest-params': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^(React|_)$',
                },
            ],
            'react-hooks/exhaustive-deps': 'error',
            'react-hooks/rules-of-hooks': 'error',
            'react/no-unescaped-entities': 'off',
            'react/prop-types': 'off',
        },
    },
    prettier
)
