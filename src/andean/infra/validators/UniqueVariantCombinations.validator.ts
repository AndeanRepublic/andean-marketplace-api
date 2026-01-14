import {
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'uniqueVariantCombinations', async: false })
export class UniqueVariantCombinationsConstraint implements ValidatorConstraintInterface {
	validate(variants: any[], args: ValidationArguments) {
		if (!variants || variants.length === 0) {
			return true; // Si no hay variantes, es válido
		}

		const combinations = variants.map(v => JSON.stringify(v.combination));
		const uniqueCombinations = new Set(combinations);

		return combinations.length === uniqueCombinations.size;
	}

	defaultMessage(args: ValidationArguments) {
		return 'There are variants with duplicate combinations';
	}
}

export function UniqueVariantCombinations(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: UniqueVariantCombinationsConstraint,
		});
	};
}
