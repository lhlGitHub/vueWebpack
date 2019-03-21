
const inject = (condition = (entity, args) => {}, decorator) => {
	return (target, name, descriptor) => {
		let fn = descriptor.value;
		descriptor.value = function(...arg)  {
			if(!condition(this, [...arg])) {
//				console.warn(decorator, this, [...arg])
				return this;
			}
			return this::fn(...arg);
		}
		return descriptor;
	}
}

export const typeLimit = (...validator) => inject((entity, args) => {
	return [...validator].every(v => v(args[0]));
},'typeLimit');

export const hasElement = inject((entity, args) => {
	return entity.length > 0;
},'hasElement');

