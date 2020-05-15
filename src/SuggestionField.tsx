import React, { useEffect,useState } from 'react'
import Autosuggest, { GetSuggestionValue } from 'react-autosuggest'

type SuggestedItem = GetSuggestionValue<any> & any

type Props<T extends SuggestedItem> = {
    searchSuggestions: (searchValue: string) => Promise<Array<T>>,

    defaultItem?: T
    onSelectItem?: (selectedItem: T) => void,

    renderSearchInput?: (
        formInputProps: React.InputHTMLAttributes<HTMLInputElement>,
        isAwaitingSearch: boolean,
        suggestedItems: T[],
        searchInputValue: string
    ) => React.ReactNode,
    renderSuggestedItem?: (suggestedItem: T, isItemSelected: boolean) => React.ReactNode,
    renderSelectedItem?: (selectedItem: T | null) => React.ReactNode,

    searchDelay?: number,
    determineItemIdentifier?: (item: T | null) => string | number,

    debugCallback?: (...args: any) => void,
}

const _renderSuggestedItem = <T extends SuggestedItem>(suggestedItem: any, isItemSelected: boolean, props: Props<T>) => {

    const _debugOut = props.debugCallback || function noop() { }

    if (props.renderSuggestedItem) {
        _debugOut('_renderSuggestedItem() props.renderSuggestedItem(suggestedItem) suggestedItem:', suggestedItem)
        return props.renderSuggestedItem(suggestedItem, isItemSelected)
    } else {
        _debugOut('_renderSuggestedItem() JSON.stringify(suggestedItem) suggestedItem:', suggestedItem)
        return `${isItemSelected ? '>' : ''} ${JSON.stringify(suggestedItem)}`
    }

}

const DEFAULT_SEARCH_DELAY_DURATION = 100
let _searchDelayTimeout: NodeJS.Timeout

export function SuggestionField<T extends SuggestedItem>(props: Props<T>) {

    const [suggestedItems, setSuggestedItems] = useState<T[]>([])
    const [selectedItem, setSelectedItem] = useState<T | null>(props.defaultItem ? props.defaultItem : null)
    const [isAwaitingSearch, setIsAwaitingSearch] = useState(false)
    const [searchInputValue, setSearchInputValue] = useState<string>('')
    const [showSuggestionSearch, setShowSuggestionSearch] = useState<boolean>(false)

    const _debugOut = props.debugCallback || function noop() { }
    const _determineItemIdentifier = props.determineItemIdentifier || ((item: T | null) => item ? JSON.stringify(item) : '')
    const searchDelay = props.searchDelay || DEFAULT_SEARCH_DELAY_DURATION

    const _renderSearchInput: Props<T>['renderSearchInput'] = props.renderSearchInput ?
        props.renderSearchInput :
        (
            formInputProps,
            isAwaitingSearch,
            suggestedItems,
            searchInputValue
        ) => {
            return <div>
                <input {...formInputProps} />
                {
                    searchInputValue.length ?
                        isAwaitingSearch ? <>Loading...</>
                            : suggestedItems.length <= 0 ? <>No suggestions.</> : <></>

                        : <></>
                }
            </div>
        }

    const _renderSelectedItem = props.renderSelectedItem ?
        props.renderSelectedItem : (selectedItem: T | null) =>
            selectedItem ? <>{JSON.stringify(selectedItem)}</> : <i>Not specified.</i>

    useEffect(
        () => {

            setIsAwaitingSearch(true)
            clearTimeout(_searchDelayTimeout)
            _searchDelayTimeout = setTimeout(async () => {

                _debugOut('useEffect(searchInputValue,showSuggestionSearch)', `_searchDelayTimeout(...,${searchDelay}) finished - await searchSuggestions(searchInputValue) searchInputValue:`, searchInputValue)

                try {

                    const suggestedItems = await props.searchSuggestions(searchInputValue)

                    _debugOut('useEffect(searchInputValue,showSuggestionSearch)', 'suggestedItems:', suggestedItems)

                    setSuggestedItems(selectedItem && suggestedItems.length ? [selectedItem, ...suggestedItems.filter((suggestedItem) => {
                        return _determineItemIdentifier(suggestedItem) !== _determineItemIdentifier(selectedItem)
                    })] : suggestedItems)

                } finally {
                    setIsAwaitingSearch(false)
                }

                _debugOut('useEffect(searchInputValue,showSuggestionSearch)', 'await searchSuggestions(searchInputValue) finished - suggestedItems:', suggestedItems)

            }, searchDelay)

            return () => {
                clearTimeout(_searchDelayTimeout)
            }
        },
        [searchInputValue, showSuggestionSearch]
    )// end useEffect

    return <>

        <label style={{ margin: 0 }} onClick={(e) => {
            if (showSuggestionSearch) {
                e.preventDefault()
                e.stopPropagation()
            }
            _debugOut('label.onClick()')
            if (!showSuggestionSearch) {
                setShowSuggestionSearch(true)
            }
        }}>

            {_renderSelectedItem(selectedItem)}

            {
                <Autosuggest

                    alwaysRenderSuggestions={showSuggestionSearch}
                    renderInputComponent={(inputProps: any) => _renderSearchInput(inputProps, isAwaitingSearch, suggestedItems, searchInputValue)}

                    suggestions={suggestedItems}
                    onSuggestionsFetchRequested={() => null}
                    onSuggestionsClearRequested={() => {
                        setIsAwaitingSearch(false)
                    }}
                    getSuggestionValue={(suggestedItem: T) => {

                        _debugOut('getSuggestionValue()', suggestedItem)
                        setSelectedItem(suggestedItem)

                        if (typeof props.onSelectItem === 'function') {
                            props.onSelectItem(suggestedItem)
                        }

                        // todo: check
                        return JSON.stringify(suggestedItem)

                    }}
                    renderSuggestion={(suggestedItem: T) => {
                        return <div onClick={() => {
                            setShowSuggestionSearch(false)
                        }}>
                            {_renderSuggestedItem(suggestedItem, _determineItemIdentifier(selectedItem) === _determineItemIdentifier(suggestedItem), props)}
                        </div>
                    }}
                    highlightFirstSuggestion={true}
                    inputProps={
                        {
                            id: 'auto-suggest',
                            style: showSuggestionSearch ? {} : { display: 'none' },
                            className: 'form-control',
                            autoFocus: true,
                            onChange: (e: any) => {

                                if (e.keyCode === 13) {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    _debugOut('inputProps.onChange()', 'keyCode===13')
                                    e.target.blur()
                                    return
                                }

                                // prevent re-render trigger which breaks dropdown up and down arrows
                                if (e.target.value === searchInputValue) {
                                    _debugOut('inputProps.onChange()', 'e.target.value === searchInputValue')
                                    return
                                }

                                _debugOut('inputProps.onChange()', 'setSearchInputValue(e.target.value) e.target.value:', e.target.value)
                                setSearchInputValue(e.target.value || '')

                            },
                            value: searchInputValue,
                            onFocus: () => {

                                _debugOut('inputProps.onFocus()')
                                setShowSuggestionSearch(true)

                            },
                            onBlur: (e: React.FormEvent<HTMLInputElement>) => {
                                e.preventDefault()
                                e.stopPropagation()
                                _debugOut('inputProps.onBlur()')
                                setShowSuggestionSearch(false)
                                setSearchInputValue('')
                                setSuggestedItems([])
                                return

                            }
                        }
                    }
                />
            }
        </label>

    </>
}