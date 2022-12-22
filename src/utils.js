import _ from 'lodash';

const isObject = (value) => _.isObject(value) && value !== null;

export default isObject;
