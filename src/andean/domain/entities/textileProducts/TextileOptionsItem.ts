export class TextileOptionsItem {
	constructor(
		public label: string, // couldn't be in OptionAlternative
		public mediaIds?: string[],
		public idOpcionAlternative?: string, // if the label was selected
	) {}
}
