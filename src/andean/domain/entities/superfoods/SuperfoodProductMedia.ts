/** IDs de MediaItem por rol visual del producto superfood. */
export class SuperfoodProductMedia {
	constructor(
		public mainImgId: string, // imagen principal del producto
		public productPackageOutImgId: string, // producto saliendo del paquete (card hover)
		public plateImgId?: string, // imagen en plato del producto
		public sourceProductImgId?: string, // imagen del producto fuente
		public closestSourceProductImgId?: string, // imagen más cercana del producto fuente
		public otherImagesId?: string[], // otras imágenes relacionadas
	) {}
}
