import { swizzleTrap } from './ir_builders';
export class StrandsNode {
  constructor(id, dimension, strandsContext) {
    this.id = id;
    this.strandsContext = strandsContext;
    this.dimension = dimension;
  }
  copy() {
    return createStrandsNode(this.id, this.dimension, this.strandsContext);
  }
}
export function createStrandsNode(id, dimension, strandsContext, onRebind) {
  return new Proxy(
    new StrandsNode(id, dimension, strandsContext),
    swizzleTrap(id, dimension, strandsContext, onRebind)
  );
}