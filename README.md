# \<SuggestionField \/\>

<a href="https://react-suggestion-field.now.sh/" target="_blank"><img src="https://raw.githubusercontent.com/storybooks/brand/master/badge/badge-storybook.svg"></a>


# Usage

1. Install dependency
    ```bash
    yarn add @etidbury/react-suggestion-field

    npm install @etidbury/react-suggestion-field
    ```
2. Add to your project

    ```jsx
    import SuggestionField from '@etidbury/react-suggestion-field'

    //...

    <SuggestionField<{title:string}>
        searchSuggestions={async (searchValue: string) => {

            //simulate load delay
            await new Promise((r) => setTimeout(r, 500))

            return [
                {title:"red"},
                {title:"blue"}
            ].filter(({ title }) => title.includes(searchValue))

        }}
    />
    ```




# License

This code is released under the [MIT license](LICENSE.md) - feel free to use it.

# Contribute

1. Fork or clone this repository
2. If using VS Code, install recommended extensions
3. `yarn install`
4. `yarn start`

## `yarn` Scripts
- `test` - _run unit tests_
- `test:cover` - _run unit tests with test coverage_
- `lint` - _check `eslint` and `prettier` rules_
- `lint:fix` - _autofix unmet `eslint` and `prettier` rules_
- `local-pack` - _create the `tgz` package locally to test consumers without publishing_
- `start` - _start the storybook server and automatically open in browser_
- `compile` - _standard typescript compile `tsc`_
- `now-build` - _used by Zeit when building your storybook for deployment (do not rename this script)_

Before each commit, `husky` and `lint-staged` will automatically lint your staged `ts, tsx, js, jsx` files.

Please contribute any improvements or fixes to this project!

To make sure you have a pleasant experience, please read the [code of conduct](CODE_OF_CONDUCT.md). It outlines core values and beliefs and will make working together a happier experience.
