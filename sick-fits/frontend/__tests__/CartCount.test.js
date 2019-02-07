import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';
import CartCount from '../components/CartCount';

describe('<CartCount/>', () => {
  it('renders', () => {
    shallow(<CartCount count={20}/>);
  });

  it('matches the snapshot', () => {
    const wrapper = shallow(<CartCount count={234}/>);

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('updates via props', () => {
    const wrapper = shallow(<CartCount count={234} />);
    expect(toJSON(wrapper)).toMatchSnapshot();


    const updatedWrapper = shallow(<CartCount count={100}/>);
    expect(toJSON(updatedWrapper)).toMatchSnapshot();
  })
});
