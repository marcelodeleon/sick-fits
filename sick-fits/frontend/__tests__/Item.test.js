import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';
import Item from '../components/Item';

const fakeItem = {
  image: 'somepng.jpg',
  title: 'title',
  id: 'ItemID',
  description: 'Awesome Description',
  price: 123330,
};

describe('<Item/>', () => {
  it('renders', () => {
    shallow(<Item item={fakeItem} />);
  });

  it('matches the snapshot', () => {
    const wrapper = shallow(<Item item={fakeItem} />);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const updatedFakeItem = {...fakeItem, title: 'modified title'};

    const wrapper = shallow(<Item item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();


    const updatedWrapper = shallow(<Item item={updatedFakeItem} />);
    expect(toJSON(updatedWrapper)).toMatchSnapshot();
  })
});
