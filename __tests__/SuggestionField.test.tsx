import { shallow } from 'enzyme';
import * as React from 'react';

import { SuggestionField } from '../src/SuggestionField';

const TEST_SUGGESTIONS = [
  {
    title: "Blue",
  },
  {
    title: "Green",
  },
  {
    title: "Red",
  }
]

describe('<SuggestionField />', () => {
  it('should render and match snapshot', () => {
    const tree = shallow(<SuggestionField
      searchSuggestions={
        async (searchValue: string) => {

          //simulate load delay
          await new Promise((r) => setTimeout(r, 500))

          return searchValue.length ? TEST_SUGGESTIONS.filter(({ title }) => title.toLowerCase().includes(searchValue.toLowerCase()))
            : TEST_SUGGESTIONS
        }
      }
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
      renderSuggestedItem={(item: any, isItemSelected: boolean) => {
        return <>{isItemSelected ? ">" : ""} {item.title}</>
      }}
      renderSelectedItem={(item: any) => {
        return item ? <>Selected colour: <strong>{item.title}</strong> ✎</> : <i>Set colour ✎</i>
      }}
      searchDelay={100}
      determineItemIdentifier={(item) => JSON.stringify(item)}

    />);

    expect(tree).toMatchSnapshot();
  });
});
