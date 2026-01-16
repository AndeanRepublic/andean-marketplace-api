import { TextileCertification } from '../../../domain/entities/textileProducts/TextileCertification';

export abstract class TextileCertificationRepository {
  abstract getAllTextileCertifications(): Promise<TextileCertification[]>;
  abstract getTextileCertificationById(id: string): Promise<TextileCertification | null>;
  abstract saveTextileCertification(certification: TextileCertification): Promise<TextileCertification>;
  abstract updateTextileCertification(
    id: string,
    certification: TextileCertification,
  ): Promise<TextileCertification>;
  abstract deleteTextileCertification(id: string): Promise<void>;
}
