import '@testing-library/jest-dom/extend-expect'

import { configure } from 'enzyme'
import 'jest-enzyme'
import Adapter from 'enzyme-adapter-react-16'

import 'mobx-react-lite/batchingForReactDom'

configure({ adapter: new Adapter() })
