import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { SuggestionField } from '../src/SuggestionField'

type ColorItem = {
  title: string
}
const TEST_COLOR_SUGGESTIONS: ColorItem[] = [
    {
        title: 'Blue'
    },
    {
        title: 'Green',
    },
    {
        title: 'Red',
    }
]

storiesOf('SuggestionField Component', module)

    .add(
        'Basic',
        () => {

            return (
                <div style={{ display: 'inline-block', border: '1px solid #eee', padding: '5px 15px' }}>

                    <SuggestionField<ColorItem>
                        searchSuggestions={
                            async (searchValue: string) => {

                                // simulate load delay
                                await new Promise((r) => setTimeout(r, 500))

                                return TEST_COLOR_SUGGESTIONS.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
                            }
                        }

                    />
                </div>
            )
        },
        { notes: 'Component with only the required props.' }
    )

    .add(
        'With all props specified',
        () => {
            return (
                <div style={{ display: 'inline-block', border: '1px solid #eee', padding: '5px 15px' }}>

                    <SuggestionField<ColorItem>
                        searchSuggestions={
                            async (searchValue: string) => {

                                // simulate load delay
                                await new Promise((r) => setTimeout(r, 500))

                                return searchValue.length ? TEST_COLOR_SUGGESTIONS.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
                                    : TEST_COLOR_SUGGESTIONS
                            }
                        }
                        onSelectItem={action('SuggestionField.onSelectItem')}
                        renderSearchInput={(
                            formInputProps,
                            isAwaitingSearch,
                            suggestedItems,
                            searchInputValue,
                        ) => {

                            return (
                                <div>
                                    <input {...formInputProps} />

                                    {
                                        searchInputValue.length ?
                                            isAwaitingSearch ? <>Loading...</>
                                                : suggestedItems.length <= 0 ? <>No suggestions.</> : <></>

                                            : <></>
                                    }
                                </div>
                            )

                        }}
                        renderSuggestedItem={(item, isItemSelected: boolean) => {
                            return <>{isItemSelected ? '>' : ''} {item.title}</>
                        }}
                        renderSelectedItem={(item) => {
                            return item ? <>Selected colour: <strong>{item.title}</strong> ✎</> : <i>Set colour ✎</i>
                        }}
                        searchDelay={100}
                        determineItemIdentifier={(item) => JSON.stringify(item)}

                        debugCallback={action('SuggestionField.debugCallback()')}

                    />

                </div>
            )
        },
        { notes: 'Component with ALL the props specified.' }
    )
