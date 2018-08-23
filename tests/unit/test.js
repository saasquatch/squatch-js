// import MyClass from '../../src/app/MyClass';

const { describe, it } = intern.getPlugin('interface.bdd');
const { expect } = intern.getPlugin('chai');

describe('MyClass', () => {
    it('should have a name property when instantiated', () => {
        const obj = new MyClass('foo');
        expect(obj).to.have.property('name', 'foo');
    });
});

class MyClass{
    constructor(name){
        this.name = name;       
    }
}