import { OpenApi } from './api/OpenApi';
import cookie from './tracking/Cookie';

export { cookie } from './tracking/Cookie';
export { OpenApi } from './api/OpenApi';

export function init(config) {
  console.log(config);
}
